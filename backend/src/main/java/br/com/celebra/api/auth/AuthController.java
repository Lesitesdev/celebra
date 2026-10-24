package br.com.celebra.api.auth;

import br.com.celebra.api.auth.AuthDtos.*;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    private final GoogleTokenVerifier google;
    public AuthController(AuthService auth, GoogleTokenVerifier google) { this.auth=auth; this.google=google; }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) { return auth.register(request); }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) { return auth.login(request); }

    @PostMapping("/google")
    public AuthResponse google(@Valid @RequestBody GoogleLoginRequest request) {
        GoogleTokenVerifier.GoogleIdentity identity = google.verify(request.credential());
        return auth.loginGoogle(identity.email(), identity.name());
    }

    @GetMapping("/me")
    public UserSummary me(@AuthenticationPrincipal Jwt jwt) { return auth.currentUser(UUID.fromString(jwt.getSubject())); }
}
