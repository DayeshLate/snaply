package com.danny.snaply_backend.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private static final String TOKEN_KEY_PREFIX = "snaply:auth:jwt:";
    private static final String FALLBACK_SECRET = "snaply-development-jwt-secret-change-me-now";

    private final StringRedisTemplate stringRedisTemplate;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private SecretKey secretKey;

    @PostConstruct
    void init() {
        if (!StringUtils.hasText(jwtSecret)) {
            log.warn("jwt.secret is not configured; using a development fallback secret");
            jwtSecret = FALLBACK_SECRET;
        }

        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        String token = Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();

        stringRedisTemplate.opsForValue().set(
                redisKey(token),
                email,
                Duration.ofMillis(jwtExpirationMs)
        );

        return token;
    }

    public String extractEmail(String token) {
        return parseClaims(token).getPayload().getSubject();
    }

    public boolean isTokenValid(String token, String email) {
        try {
            Claims claims = parseClaims(token).getPayload();
            String storedEmail = stringRedisTemplate.opsForValue().get(redisKey(token));

            return storedEmail != null
                    && storedEmail.equals(email)
                    && email.equals(claims.getSubject())
                    && claims.getExpiration() != null
                    && claims.getExpiration().after(new Date());
        } catch (Exception ex) {
            log.warn("Invalid JWT token: {}", ex.getMessage());
            return false;
        }
    }

    public void invalidateToken(String token) {
        stringRedisTemplate.delete(redisKey(token));
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token);
    }

    private String redisKey(String token) {
        return TOKEN_KEY_PREFIX + token;
    }
}