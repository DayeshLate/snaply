package com.danny.snaply_backend.service;

import java.time.Duration;
import java.util.UUID;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.dto.AuthLoginRequest;
import com.danny.snaply_backend.dto.AuthRegisterRequest;
import com.danny.snaply_backend.dto.AuthResponse;
import com.danny.snaply_backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Duration VERIFICATION_TTL = Duration.ofMinutes(15);
    private static final Duration SESSION_TTL = Duration.ofDays(7);

    private final UserService userService;
    private final EmailService emailService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;

    @Transactional
    public AuthResponse register(AuthRegisterRequest request) {
        if (userService.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }

        User user = userService.createPasswordUser(request.name(), request.email(), request.password());
        String verificationToken = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(
                CacheConstants.AUTH_VERIFICATION + verificationToken,
                user.getEmail(),
                VERIFICATION_TTL
        );

        String verificationLink = backendUrl + "/api/auth/verify?token=" + verificationToken;
        emailService.sendVerificationEmail(user.getEmail(), verificationLink);

        return new AuthResponse(null, user, "Registration successful. Verify your email to continue.");
    }

    @Transactional
    public User verifyEmail(String token) {
        String key = CacheConstants.AUTH_VERIFICATION + token;
        Object emailValue = redisTemplate.opsForValue().get(key);

        if (emailValue == null) {
            throw new RuntimeException("Invalid or expired verification token");
        }

        redisTemplate.delete(key);
        String email = emailValue.toString();

        User user = userService.findByEmailDirect(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmailVerified(true);
        return userService.save(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthLoginRequest request) {
        User user = userService.findByEmailDirect(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        if (user.getPasswordHash() == null || !userService.matchesPassword(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(
                CacheConstants.AUTH_SESSION + token,
                user.getEmail(),
                SESSION_TTL
        );

        return new AuthResponse(token, user, "Login successful");
    }

    public User me(String token) {
        Object emailValue = redisTemplate.opsForValue().get(CacheConstants.AUTH_SESSION + token);

        if (emailValue == null) {
            throw new RuntimeException("Invalid or expired session token");
        }

        return userService.findByEmailDirect(emailValue.toString())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void logout(String token) {
        redisTemplate.delete(CacheConstants.AUTH_SESSION + token);
    }
}