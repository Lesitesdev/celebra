package br.com.celebra.api.account;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface AccountRepository extends JpaRepository<AccountEntity, UUID> {}
