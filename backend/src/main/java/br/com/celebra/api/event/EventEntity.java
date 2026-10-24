package br.com.celebra.api.event;

import tools.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "events")
public class EventEntity {
    @Id private UUID id;
    @Column(name = "account_id", nullable = false) private UUID accountId;
    @Column(name = "created_by", nullable = false) private UUID createdBy;
    @Column(name = "public_slug", nullable = false, unique = true, length = 180) private String publicSlug;
    @Column(nullable = false, length = 180) private String title;
    @Column(name = "event_kind", nullable = false, length = 60) private String eventKind;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 24) private EventStatus status;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "event_data", nullable = false, columnDefinition = "jsonb") private JsonNode eventData;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    protected EventEntity() {}
    public EventEntity(UUID id, UUID accountId, UUID createdBy, String publicSlug, String title, String eventKind, EventStatus status, JsonNode eventData) {
        this.id=id; this.accountId=accountId; this.createdBy=createdBy; this.publicSlug=publicSlug; this.title=title; this.eventKind=eventKind; this.status=status; this.eventData=eventData; this.createdAt=Instant.now(); this.updatedAt=this.createdAt;
    }
    public void update(String title, String eventKind, EventStatus status, JsonNode eventData) {
        this.title=title; this.eventKind=eventKind; this.status=status; this.eventData=eventData; this.updatedAt=Instant.now();
    }
    public UUID getId() { return id; }
    public UUID getAccountId() { return accountId; }
    public UUID getCreatedBy() { return createdBy; }
    public String getPublicSlug() { return publicSlug; }
    public String getTitle() { return title; }
    public String getEventKind() { return eventKind; }
    public EventStatus getStatus() { return status; }
    public JsonNode getEventData() { return eventData; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
