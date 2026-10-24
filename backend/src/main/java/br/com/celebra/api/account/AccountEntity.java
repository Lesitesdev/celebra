package br.com.celebra.api.account;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "accounts")
public class AccountEntity {
    @Id private UUID id;
    @Enumerated(EnumType.STRING) @Column(name = "account_type", nullable = false, length = 24) private AccountType accountType;
    @Column(nullable = false, length = 180) private String name;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;

    protected AccountEntity() {}
    public AccountEntity(AccountType accountType, String name) {
        this.id = UUID.randomUUID(); this.accountType = accountType; this.name = name; this.createdAt = Instant.now();
    }
    public UUID getId() { return id; }
    public AccountType getAccountType() { return accountType; }
    public String getName() { return name; }
    public Instant getCreatedAt() { return createdAt; }
}
