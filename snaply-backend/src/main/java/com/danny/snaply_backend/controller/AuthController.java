package com.danny.snaply_backend.controller;

import com.danny.snaply_backend.dto.AuthLoginRequest;
import com.danny.snaply_backend.dto.AuthRegisterRequest;
import com.danny.snaply_backend.dto.AuthResponse;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthLoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> me(@RequestHeader("Authorization") String authorization) {
        String token = authorization.startsWith("Bearer ")
                ? authorization.substring(7)
                : authorization;
        return ResponseEntity.ok(authService.me(token));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authorization) {
        String token = authorization.startsWith("Bearer ")
                ? authorization.substring(7)
                : authorization;
        authService.logout(token);
        return ResponseEntity.noContent().build();
    }
}