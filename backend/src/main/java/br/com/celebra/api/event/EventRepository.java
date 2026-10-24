package br.com.celebra.api.event;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {
    List<EventEntity> findByAccountIdOrderByUpdatedAtDesc(UUID accountId);
    Optional<EventEntity> findByIdAndAccountId(UUID id, UUID accountId);
    Optional<EventEntity> findByPublicSlugAndStatus(String publicSlug, EventStatus status);
}
