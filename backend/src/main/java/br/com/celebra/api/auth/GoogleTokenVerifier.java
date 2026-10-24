package br.com.celebra.api.auth;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class GoogleTokenVerifier {
    private final String clientId;
    private final JwtDecoder decoder;

    public GoogleTokenVerifier(@Value("${celebra.google.client-id:}") String clientId) {
        this.clientId = clientId;
        NimbusJwtDecoder googleDecoder = NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();
        OAuth2TokenValidator<Jwt> issuer = JwtValidators.createDefaultWithIssuer("https://accounts.google.com");
        OAuth2TokenValidator<Jwt> audience = token -> {
            Object aud = token.getClaims().get("aud");
            boolean valid = aud instanceof String s ? s.equals(clientId) : aud instanceof List<?> list && list.contains(clientId);
            return valid ? OAuth2TokenValidatorResult.success() : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Invalid Google token audience", null));
        };
        googleDecoder.setJwtValidator(token -> {
            OAuth2TokenValidatorResult issuerResult = issuer.validate(token);
            return issuerResult.hasErrors() ? issuerResult : audience.validate(token);
        });
        this.decoder = googleDecoder;
    }

    public GoogleIdentity verify(String credential) {
        if (clientId.isBlank()) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "O login com Google ainda não foi configurado.");
        try {
            Jwt token = decoder.decode(credential);
            Boolean emailVerified = token.getClaim("email_verified");
            String email = token.getClaimAsString("email");
            String name = token.getClaimAsString("name");
            if (!Boolean.TRUE.equals(emailVerified) || email == null || email.isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "O Google não confirmou este e-mail.");
            }
            return new GoogleIdentity(email, name == null || name.isBlank() ? email : name);
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não foi possível validar sua conta Google.");
        }
    }

    public record GoogleIdentity(String email, String name) {}
}
