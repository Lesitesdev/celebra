package br.com.celebra.api.event;

import tools.jackson.databind.JsonNode;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
public class EventController {
    private final EventService service;
    public EventController(EventService service) { this.service=service; }

    @GetMapping("/api/accounts/{accountId}/events")
    public List<JsonNode> list(@PathVariable UUID accountId, @AuthenticationPrincipal Jwt jwt) {
        return service.list(accountId,UUID.fromString(jwt.getSubject()));
    }

    @GetMapping("/api/accounts/{accountId}/events/{eventId}")
    public JsonNode get(@PathVariable UUID accountId,@PathVariable UUID eventId,@AuthenticationPrincipal Jwt jwt) {
        return service.get(accountId,eventId,UUID.fromString(jwt.getSubject()));
    }

    @PostMapping("/api/accounts/{accountId}/events")
    public JsonNode create(@PathVariable UUID accountId, @AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode event) {
        return service.create(accountId,UUID.fromString(jwt.getSubject()),event);
    }

    @PutMapping("/api/accounts/{accountId}/events/{eventId}")
    public JsonNode update(@PathVariable UUID accountId, @PathVariable UUID eventId, @AuthenticationPrincipal Jwt jwt, @RequestBody JsonNode event) {
        return service.update(accountId,eventId,UUID.fromString(jwt.getSubject()),event);
    }

    @GetMapping("/api/public/invitations/{slug}")
    public JsonNode publicInvitation(@PathVariable String slug) { return service.publicInvitation(slug); }
}
