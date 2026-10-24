package br.com.celebra.api.admin;

import br.com.celebra.api.account.AccountType;
import java.time.Instant;
import java.util.UUID;

public final class PlatformAdminDtos {
    private PlatformAdminDtos() {}
    public record Overview(long registeredUsers, long buffetAccounts, long individualAccounts,
                           long totalInvitations, long publishedInvitations, long draftInvitations) {}
    public record AccountRow(UUID accountId, AccountType accountType, String accountName,
                             String ownerName, String ownerEmail, int memberCount,
                             int invitationCount, int publishedInvitationCount, Instant createdAt) {}
}
