package br.com.celebra.api.account;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public final class AccountDtos {
    private AccountDtos() {}
    public record AddMemberRequest(@NotBlank @Email @Size(max=320) String email, @NotNull MemberRole role) {}
    public record AccountMember(UUID userId, String email, String fullName, MemberRole role) {}
}
