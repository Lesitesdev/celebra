package br.com.celebra.api.account;

import br.com.celebra.api.auth.UserEntity;
import br.com.celebra.api.auth.UserRepository;
import br.com.celebra.api.account.AccountDtos.*;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccountService {
    private final AccountMemberRepository memberships;
    private final UserRepository users;
    public AccountService(AccountMemberRepository memberships,UserRepository users) { this.memberships=memberships;this.users=users; }

    @Transactional(readOnly=true)
    public List<AccountMember> listMembers(UUID accountId,UUID actorId) {
        requireMembership(accountId,actorId);
        return memberships.findByAccountId(accountId).stream().map(m->users.findById(m.getUserId())
            .map(u->new AccountMember(u.getId(),u.getEmail(),u.getFullName(),m.getRole())).orElse(null)).filter(java.util.Objects::nonNull).toList();
    }

    @Transactional
    public AccountMember addMember(UUID accountId,UUID actorId,AddMemberRequest request) {
        AccountMemberEntity actor=requireMembership(accountId,actorId);
        if (actor.getRole()!=MemberRole.OWNER && actor.getRole()!=MemberRole.ADMIN) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if (request.role()==MemberRole.OWNER) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"A funcao de proprietario nao pode ser atribuida por este endpoint.");
        if (actor.getRole()==MemberRole.ADMIN && request.role()!=MemberRole.MEMBER) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        String email=request.email().trim().toLowerCase(Locale.ROOT);
        UserEntity user=users.findByEmail(email).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Crie uma conta para este e-mail antes de adiciona-lo ao buffet."));
        if (memberships.findByAccountIdAndUserId(accountId,user.getId()).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT,"Este usuario ja pertence a conta.");
        AccountMemberEntity member=memberships.save(new AccountMemberEntity(accountId,user.getId(),request.role()));
        return new AccountMember(user.getId(),user.getEmail(),user.getFullName(),member.getRole());
    }
    private AccountMemberEntity requireMembership(UUID accountId,UUID userId) {
        return memberships.findByAccountIdAndUserId(accountId,userId).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
    }
}
