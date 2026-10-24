package br.com.celebra.api.auth;

import br.com.celebra.api.account.AccountType;
import br.com.celebra.api.account.MemberRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos() {}
    public record RegisterRequest(
        @NotBlank @Email @Size(max=320) String email,
        @NotBlank @Size(min=12, max=100) String password,
        @NotBlank @Size(max=160) String fullName,
        @NotNull AccountType accountType,
        @Size(max=180) String accountName
    ) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record GoogleLoginRequest(@NotBlank String credential) {}
    public record UserSummary(UUID id, String email, String fullName) {}
    public record AccountMembership(UUID accountId, AccountType accountType, String accountName, MemberRole role) {}
    public record AuthResponse(String accessToken, String tokenType, Instant expiresAt, UserSummary user, List<AccountMembership> accounts) {}
}
