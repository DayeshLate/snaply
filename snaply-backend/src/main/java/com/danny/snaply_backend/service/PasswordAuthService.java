package com.danny.snaply_backend.service;

import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;

/**
 * Handles the email + password authentication flow:
 *   1. register() — hash password, activate user immediately, return JWT (no OTP step)
 *   2. login()    — verify credentials, return JWT
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PasswordAuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    // ---------------------------------------------------------------
    // Step 1 — Register (immediate activation, no OTP)
    // ---------------------------------------------------------------

    /**
     * Creates and immediately activates a user account, then returns a JWT token.
     * No email verification step is required — the user is logged in right away.
     *
     * @return JWT token string
     * @throws ResponseStatusException 409 if the email is already registered
     */
    public String register(String email, String rawPassword, String displayName) {
        // Reject if a verified account already exists
        userRepository.findByEmail(email).ifPresent(existing -> {
            if (existing.isEmailVerified()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "An account with this email already exists.");
            }
            // Remove any stale unverified account so we can create a fresh one
            userRepository.delete(existing);
            userRepository.flush();
        });

        // Derive display name from email prefix if not provided
        String name = StringUtils.hasText(displayName)
                ? displayName
                : email.substring(0, email.indexOf('@'));

        // Hash password and save a fully activated user
        String hash = passwordEncoder.encode(rawPassword);
        User user = User.builder()
                .email(email)
                .passwordHash(hash)
                .name(name)
                .emailVerified(true)
                .enabled(true)
                .role(User.Role.USER)
                .build();
        userRepository.save(user);

        log.info("User registered and activated: {}", email);
        return jwtService.generateToken(email);
    }

    // ---------------------------------------------------------------
    // Step 2 — Login
    // ---------------------------------------------------------------

    /**
     * Authenticates with email + password and returns a JWT token string.
     *
     * @throws ResponseStatusException 401 for wrong credentials
     */
    public String login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password."));

        if (user.getPasswordHash() == null) {
            // Account was created via magic-link or Google — no password set
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "This account does not use password login. Try the magic link option.");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            log.warn("Password mismatch for {}", email);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        log.info("Password login successful for {}", email);
        return jwtService.generateToken(email);
    }
}
