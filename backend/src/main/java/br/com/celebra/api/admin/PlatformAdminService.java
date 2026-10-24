package br.com.celebra.api.admin;

import br.com.celebra.api.account.AccountEntity;
import br.com.celebra.api.account.AccountMemberEntity;
import br.com.celebra.api.account.AccountMemberRepository;
import br.com.celebra.api.account.AccountRepository;
import br.com.celebra.api.account.AccountType;
import br.com.celebra.api.account.MemberRole;
import br.com.celebra.api.auth.UserEntity;
import br.com.celebra.api.auth.UserRepository;
import br.com.celebra.api.event.EventEntity;
import br.com.celebra.api.event.EventRepository;
import br.com.celebra.api.event.EventStatus;
import br.com.celebra.api.admin.PlatformAdminDtos.AccountRow;
import br.com.celebra.api.admin.PlatformAdminDtos.Overview;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PlatformAdminService {
    private final AccountRepository accounts;
    private final AccountMemberRepository members;
    private final UserRepository users;
    private final EventRepository events;
    private final List<String> allowedEmails;

    public PlatformAdminService(AccountRepository accounts, AccountMemberRepository members,
                                UserRepository users, EventRepository events,
                                @Value("${celebra.platform-admin-emails:}") String configuredEmails) {
        this.accounts = accounts;
        this.members = members;
        this.users = users;
        this.events = events;
        this.allowedEmails = Arrays.stream(configuredEmails.split(","))
            .map(String::trim).filter(email -> !email.isBlank())
            .map(email -> email.toLowerCase(Locale.ROOT)).toList();
    }

    @Transactional(readOnly = true)
    public Overview overview(UUID actorId) {
        requirePlatformAdmin(actorId);
        List<AccountEntity> allAccounts = accounts.findAll();
        List<EventEntity> allEvents = events.findAll();
        return new Overview(users.count(),
            allAccounts.stream().filter(a -> a.getAccountType() == AccountType.BUFFET).count(),
            allAccounts.stream().filter(a -> a.getAccountType() == AccountType.INDIVIDUAL).count(),
            allEvents.size(), allEvents.stream().filter(e -> e.getStatus() == EventStatus.PUBLISHED).count(),
            allEvents.stream().filter(e -> e.getStatus() == EventStatus.DRAFT).count());
    }

    @Transactional(readOnly = true)
    public List<AccountRow> accounts(UUID actorId) {
        requirePlatformAdmin(actorId);
        return accounts.findAll().stream().map(account -> {
            List<AccountMemberEntity> accountMembers = members.findByAccountId(account.getId());
            List<EventEntity> accountEvents = events.findByAccountIdOrderByUpdatedAtDesc(account.getId());
            UserEntity owner = accountMembers.stream().filter(m -> m.getRole() == MemberRole.OWNER).findFirst()
                .flatMap(m -> users.findById(m.getUserId())).orElse(null);
            return new AccountRow(account.getId(), account.getAccountType(), account.getName(),
                owner == null ? null : owner.getFullName(), owner == null ? null : owner.getEmail(),
                accountMembers.size(), accountEvents.size(),
                (int) accountEvents.stream().filter(e -> e.getStatus() == EventStatus.PUBLISHED).count(),
                account.getCreatedAt());
        }).toList();
    }

    private void requirePlatformAdmin(UUID actorId) {
        String email = users.findById(actorId).map(UserEntity::getEmail)
            .map(value -> value.toLowerCase(Locale.ROOT)).orElse("");
        if (allowedEmails.isEmpty() || !allowedEmails.contains(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "Seu usuário não tem permissão de administrador da plataforma.");
        }
    }
}
