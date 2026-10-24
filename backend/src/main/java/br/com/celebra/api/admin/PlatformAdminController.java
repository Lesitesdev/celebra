package br.com.celebra.api.admin;

import br.com.celebra.api.admin.PlatformAdminDtos.AccountRow;
import br.com.celebra.api.admin.PlatformAdminDtos.Overview;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class PlatformAdminController {
    private final PlatformAdminService admin;
    public PlatformAdminController(PlatformAdminService admin) { this.admin = admin; }

    @GetMapping("/overview")
    public Overview overview(@AuthenticationPrincipal Jwt jwt) {
        return admin.overview(UUID.fromString(jwt.getSubject()));
    }

    @GetMapping("/accounts")
    public List<AccountRow> accounts(@AuthenticationPrincipal Jwt jwt) {
        return admin.accounts(UUID.fromString(jwt.getSubject()));
    }
}
