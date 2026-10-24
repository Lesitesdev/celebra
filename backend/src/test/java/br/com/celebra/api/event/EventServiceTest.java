package br.com.celebra.api.event;

import br.com.celebra.api.account.AccountMemberEntity;
import br.com.celebra.api.account.AccountMemberRepository;
import br.com.celebra.api.account.MemberRole;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class EventServiceTest {
    private final EventRepository events=mock(EventRepository.class);
    private final AccountMemberRepository memberships=mock(AccountMemberRepository.class);
    private final EventService service=new EventService(events,memberships);
    private final JsonMapper mapper=JsonMapper.builder().build();

    @Test
    void createsEventAsDraftAndGeneratesServerIdentity() throws Exception {
        UUID accountId=UUID.randomUUID(),userId=UUID.randomUUID();
        when(memberships.findByAccountIdAndUserId(accountId,userId)).thenReturn(Optional.of(new AccountMemberEntity(accountId,userId,MemberRole.OWNER)));
        JsonNode input=mapper.readTree("""
            {"id":"forged-id","slug":"forged-slug","status":"Publicado","title":"Festa de teste","hosts":"Pessoa Teste","kind":"Aniversario","date":"2027-01-10"}
            """);

        JsonNode created=service.create(accountId,userId,input);

        assertNotEquals("forged-id",created.path("id").asText());
        assertNotEquals("forged-slug",created.path("slug").asText());
        assertEquals("Rascunho",created.path("status").asText());
        verify(events).save(any(EventEntity.class));
    }

    @Test
    void doesNotAllowAnUnassociatedUserToCreateEvents() throws Exception {
        UUID accountId=UUID.randomUUID(),userId=UUID.randomUUID();
        when(memberships.findByAccountIdAndUserId(accountId,userId)).thenReturn(Optional.empty());
        JsonNode input=mapper.readTree("""
            {"title":"Festa","hosts":"Pessoa","kind":"Aniversario","date":"2027-01-10"}
            """);

        ResponseStatusException error=assertThrows(ResponseStatusException.class,()->service.create(accountId,userId,input));

        assertEquals(HttpStatus.NOT_FOUND,error.getStatusCode());
        verify(events,never()).save(any());
    }
}
