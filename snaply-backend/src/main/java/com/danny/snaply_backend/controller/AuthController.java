package com.danny.snaply_backend.controller;

import com.danny.snaply_backend.dto.AuthLoginRequest;
import com.danny.snaply_backend.dto.AuthRegisterRequest;
import com.danny.snaply_backend.dto.AuthResponse;
import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;
import java.net.URI;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${app.frontend.url:}")
    private String frontendUrl;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        User user = authService.verifyEmail(token);

        if (frontendUrl != null && !frontendUrl.isBlank()) {
            String target = frontendUrl + "/login?verified=true&email=" + user.getEmail();
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(target))
                    .build();
        }

        String htmlSuccess = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Email Verified</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
                        .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 480px; text-align: center; border: 1px solid #334155; }
                        h2 { margin: 0 0 0.5rem; color: #f1f5f9; font-size: 1.5rem; }
                        p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin: 0.5rem 0; }
                        .badge { display: inline-block; background: #334155; color: #38bdf8; padding: 0.35rem 0.8rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.875rem; margin-top: 0.75rem; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2>Email Verified</h2>
                        <p>Your account has been verified successfully.</p>
                        <div class="badge">%s</div>
                        <p style="margin-top: 1.5rem; font-size: 0.85rem; color: #64748b;">You can now return to Snaply and sign in.</p>
                    </div>
                </body>
                </html>
                """.formatted(user.getEmail());

        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(htmlSuccess);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthLoginRequest request,
            HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.login(request);

        if (authResponse.token() != null) {
            ResponseCookie cookie = ResponseCookie.from(CacheConstants.AUTH_COOKIE, authResponse.token())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(60 * 60 * 24 * 7)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());
        }

        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/dev-login")
    public ResponseEntity<AuthResponse> devLogin(
            @RequestParam String email,
            @RequestParam(defaultValue = "Dev User") String name,
            HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.devLogin(name, email);

        if (authResponse.token() != null) {
            ResponseCookie cookie = ResponseCookie.from(CacheConstants.AUTH_COOKIE, authResponse.token())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .sameSite("Lax")
                    .maxAge(60 * 60 * 24 * 7)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());
        }

        return ResponseEntity.ok(authResponse);
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            HttpServletRequest request
    ) {
        String token = resolveToken(authorization, request);
        return ResponseEntity.ok(authService.me(token));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            HttpServletRequest request
    ) {
        String token = resolveToken(authorization, request);
        authService.logout(token);
        return ResponseEntity.noContent().build();
    }

    private String resolveToken(String authorization, HttpServletRequest request) {
        if (authorization != null && !authorization.isBlank()) {
            return authorization.startsWith("Bearer ")
                    ? authorization.substring(7)
                    : authorization;
        }

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (CacheConstants.AUTH_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        throw new RuntimeException("Missing authentication token");
    }
}