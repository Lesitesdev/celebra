package br.com.celebra.api.account;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "account_members", uniqueConstraints = @UniqueConstraint(name = "uq_account_members_account_user", columnNames = {"account_id", "user_id"}))
public class AccountMemberEntity {
    @Id private UUID id;
    @Column(name = "account_id", nullable = false) private UUID accountId;
    @Column(name = "user_id", nullable = false) private UUID userId;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 24) private MemberRole role;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;

    protected AccountMemberEntity() {}
    public AccountMemberEntity(UUID accountId, UUID userId, MemberRole role) {
        this.id = UUID.randomUUID(); this.accountId = accountId; this.userId = userId; this.role = role; this.createdAt = Instant.now();
    }
    public UUID getId() { return id; }
    public UUID getAccountId() { return accountId; }
    public UUID getUserId() { return userId; }
    public MemberRole getRole() { return role; }
}
