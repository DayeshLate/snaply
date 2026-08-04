package com.danny.snaply_backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class MagicLinkService {

    private static final String MAGIC_KEY_PREFIX = "snaply:magic:";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final StringRedisTemplate stringRedisTemplate;
    private final EmailService emailService;

    @Value("${magic-link.expiration-ms:600000}")
    private long magicLinkExpirationMs;

    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;

    public void sendMagicLink(String email) {
        String token = generateSecureToken();

        stringRedisTemplate.opsForValue().set(
                redisKey(token),
                email,
                Duration.ofMillis(magicLinkExpirationMs)
        );

        String magicLink = buildMagicLink(token);
        long expiryMinutes = magicLinkExpirationMs / 60_000;
        String html = emailService.buildMagicLinkHtml(magicLink, expiryMinutes);

        try {
            emailService.sendHtml(email, "Sign in to Snaply", html);
            log.info("Magic link sent to {}", email);
        } catch (RuntimeException ex) {
            stringRedisTemplate.delete(redisKey(token));
            log.error("Failed to send magic link email to {}: {}", email, ex.getMessage());
            throw ex;
        }
    }

   
    public String verifyToken(String token) {
        String key = redisKey(token);
        String email = stringRedisTemplate.opsForValue().get(key);

        if (email == null) {
            log.warn("Magic link token not found or expired");
            return null;
        }

       
        stringRedisTemplate.expire(key, Duration.ofSeconds(60));
        log.info("Magic link verified for {}", email);
        return email;
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String buildMagicLink(String token) {
        return backendUrl + "/api/auth/verify?token=" + token;
    }

    private String redisKey(String token) {
        return MAGIC_KEY_PREFIX + token;
    }
}
