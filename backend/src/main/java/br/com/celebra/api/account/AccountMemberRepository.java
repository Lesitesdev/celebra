package br.com.celebra.api.account;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountMemberRepository extends JpaRepository<AccountMemberEntity, UUID> {
    List<AccountMemberEntity> findByUserId(UUID userId);
    List<AccountMemberEntity> findByAccountId(UUID accountId);
    Optional<AccountMemberEntity> findByAccountIdAndUserId(UUID accountId, UUID userId);
}
