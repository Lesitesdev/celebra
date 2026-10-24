package br.com.celebra.api.event;

import br.com.celebra.api.account.AccountMemberRepository;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.ObjectNode;
import java.text.Normalizer;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EventService {
    private static final Pattern NON_SLUG = Pattern.compile("[^a-z0-9]+"
    );
    private final EventRepository events;
    private final AccountMemberRepository memberships;

    public EventService(EventRepository events, AccountMemberRepository memberships) {
        this.events=events; this.memberships=memberships;
    }

    @Transactional(readOnly=true)
    public java.util.List<JsonNode> list(UUID accountId, UUID userId) {
        requireMembership(accountId,userId);
        return events.findByAccountIdOrderByUpdatedAtDesc(accountId).stream().map(EventEntity::getEventData).toList();
    }

    @Transactional(readOnly=true)
    public JsonNode get(UUID accountId, UUID eventId, UUID userId) {
        requireMembership(accountId,userId);
        return events.findByIdAndAccountId(eventId,accountId).map(EventEntity::getEventData)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public JsonNode create(UUID accountId, UUID userId, JsonNode input) {
        requireMembership(accountId,userId); ObjectNode data=object(input);
        requireText(data,"title"); requireText(data,"hosts"); requireText(data,"kind"); requireText(data,"date");
        UUID id=UUID.randomUUID(); String slug=slug(data.path("hosts").asText(data.path("title").asText()))+"-"+id.toString().substring(0,5);
        data.put("id",id.toString()); data.put("slug",slug); data.put("status","Rascunho"); data.put("createdAt",java.time.Instant.now().toString());
        data.put("accountId",accountId.toString());
        events.save(new EventEntity(id,accountId,userId,slug,data.path("title").asText(),data.path("kind").asText(),EventStatus.DRAFT,data));
        return data;
    }

    @Transactional
    public JsonNode update(UUID accountId, UUID eventId, UUID userId, JsonNode input) {
        requireMembership(accountId,userId); ObjectNode data=object(input);
        EventEntity current=events.findByIdAndAccountId(eventId,accountId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        requireText(data,"title"); requireText(data,"hosts"); requireText(data,"kind"); requireText(data,"date");
        EventStatus status=parseStatus(data.path("status").asText(current.getStatus()==EventStatus.PUBLISHED?"Publicado":"Rascunho"));
        data.put("id",current.getId().toString()); data.put("slug",current.getPublicSlug()); data.put("createdAt",current.getEventData().path("createdAt").asText(current.getCreatedAt().toString())); data.put("accountId",accountId.toString());
        current.update(data.path("title").asText(),data.path("kind").asText(),status,data);
        return data;
    }

    @Transactional(readOnly=true)
    public JsonNode publicInvitation(String slug) {
        return events.findByPublicSlugAndStatus(slug,EventStatus.PUBLISHED).map(EventEntity::getEventData)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Convite publicado nao encontrado."));
    }

    private void requireMembership(UUID accountId, UUID userId) {
        if (memberships.findByAccountIdAndUserId(accountId,userId).isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    private ObjectNode object(JsonNode input) {
        if (input == null || !input.isObject()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"O evento precisa ser um objeto JSON.");
        return (ObjectNode) input.deepCopy();
    }
    private void requireText(ObjectNode data,String field) {
        if (!data.hasNonNull(field) || data.path(field).asText().isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Campo obrigatorio: "+field);
    }
    private EventStatus parseStatus(String status) {
        return switch(status.toLowerCase(Locale.ROOT)) {
            case "publicado","published" -> EventStatus.PUBLISHED;
            case "arquivado","archived" -> EventStatus.ARCHIVED;
            case "rascunho","draft" -> EventStatus.DRAFT;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Status de evento invalido.");
        };
    }
    private String slug(String value) {
        String normalized=Normalizer.normalize(value.toLowerCase(Locale.ROOT),Normalizer.Form.NFD).replaceAll("\\p{M}","");
        String safe=NON_SLUG.matcher(normalized).replaceAll("-").replaceAll("^-|-$","");
        return safe.isBlank()?"evento":safe.substring(0,Math.min(150,safe.length()));
    }
}
