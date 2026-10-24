package br.com.celebra.api.account;

import br.com.celebra.api.account.AccountDtos.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accounts/{accountId}/members")
public class AccountController {
    private final AccountService service;
    public AccountController(AccountService service) { this.service=service; }
    @GetMapping public List<AccountMember> list(@PathVariable UUID accountId,@AuthenticationPrincipal Jwt jwt) {
        return service.listMembers(accountId,UUID.fromString(jwt.getSubject()));
    }
    @PostMapping public AccountMember add(@PathVariable UUID accountId,@AuthenticationPrincipal Jwt jwt,@Valid @RequestBody AddMemberRequest request) {
        return service.addMember(accountId,UUID.fromString(jwt.getSubject()),request);
    }
}
