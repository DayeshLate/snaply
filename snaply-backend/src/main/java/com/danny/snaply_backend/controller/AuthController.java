package com.danny.snaply_backend.controller;

import com.danny.snaply_backend.dto.AuthLoginRequest;
import com.danny.snaply_backend.dto.AuthRegisterRequest;
import com.danny.snaply_backend.dto.AuthResponse;
import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/verify")
    public ResponseEntity<User> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
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