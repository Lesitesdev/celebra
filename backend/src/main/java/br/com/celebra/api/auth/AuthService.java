package br.com.celebra.api.auth;

import br.com.celebra.api.account.*;
import br.com.celebra.api.auth.AuthDtos.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users;
    private final AccountRepository accounts;
    private final AccountMemberRepository members;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final String issuer;
    private final long expirationHours;

    public AuthService(UserRepository users, AccountRepository accounts, AccountMemberRepository members,
                       PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder,
                       @Value("${celebra.jwt.issuer}") String issuer,
                       @Value("${celebra.jwt.expiration}") java.time.Duration expiration) {
        this.users=users; this.accounts=accounts; this.members=members; this.passwordEncoder=passwordEncoder;
        this.jwtEncoder=jwtEncoder; this.issuer=issuer; this.expirationHours=expiration.toHours();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (users.existsByEmail(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail ja possui uma conta.");
        if (request.accountType() == AccountType.BUFFET && (request.accountName() == null || request.accountName().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o nome do buffet.");
        }
        UserEntity user = users.save(new UserEntity(email, request.fullName().trim(), passwordEncoder.encode(request.password())));
        String accountName = request.accountName() == null || request.accountName().isBlank() ? request.fullName().trim() : request.accountName().trim();
        AccountEntity account = accounts.save(new AccountEntity(request.accountType(), accountName));
        members.save(new AccountMemberEntity(account.getId(), user.getId(), MemberRole.OWNER));
        return response(user);
    }

    @Transactional(readOnly=true)
    public AuthResponse login(LoginRequest request) {
        UserEntity user = users.findByEmail(normalizeEmail(request.email()))
            .filter(candidate -> passwordEncoder.matches(request.password(), candidate.getPasswordHash()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos."));
        return response(user);
    }

    @Transactional
    public AuthResponse loginGoogle(String emailAddress, String fullName) {
        String email = normalizeEmail(emailAddress);
        UserEntity user = users.findByEmail(email).orElseGet(() -> {
            UserEntity created = users.save(new UserEntity(email, fullName.trim(), passwordEncoder.encode(UUID.randomUUID().toString() + UUID.randomUUID())));
            String accountName = fullName == null || fullName.isBlank() ? email : fullName.trim();
            AccountEntity account = accounts.save(new AccountEntity(AccountType.INDIVIDUAL, accountName));
            members.save(new AccountMemberEntity(account.getId(), created.getId(), MemberRole.OWNER));
            return created;
        });
        return response(user);
    }

    @Transactional(readOnly=true)
    public UserSummary currentUser(UUID userId) {
        return users.findById(userId).map(u -> new UserSummary(u.getId(),u.getEmail(),u.getFullName()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    private AuthResponse response(UserEntity user) {
        Instant now = Instant.now(); Instant expires = now.plus(expirationHours, ChronoUnit.HOURS);
        JwtClaimsSet claims = JwtClaimsSet.builder().issuer(issuer).subject(user.getId().toString())
            .issuedAt(now).expiresAt(expires).claim("email", user.getEmail()).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        List<AccountMembership> accountList = members.findByUserId(user.getId()).stream().map(m -> accounts.findById(m.getAccountId())
            .map(a -> new AccountMembership(a.getId(),a.getAccountType(),a.getName(),m.getRole())).orElse(null)).filter(java.util.Objects::nonNull).toList();
        return new AuthResponse(token, "Bearer", expires, new UserSummary(user.getId(),user.getEmail(),user.getFullName()), accountList);
    }
    private String normalizeEmail(String email) { return email.trim().toLowerCase(Locale.ROOT); }
}
