package com.danny.snaply_backend.service;

import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.Duration;

/**
 * Handles the email + password authentication flow:
 *   1. register()    — hash password, save pending user (unverified), send OTP
 *   2. verifyOtp()   — validate OTP, activate user, return JWT
 *   3. login()       — verify credentials, return JWT
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PasswordAuthService {

    private static final String OTP_KEY_PREFIX = "snaply:otp:";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate stringRedisTemplate;

    @Value("${otp.expiration-ms:600000}")
    private long otpExpirationMs;

    // ---------------------------------------------------------------
    // Step 1 — Register
    // ---------------------------------------------------------------

    /**
     * Creates a pending (unverified) user account and sends a 6-digit OTP to the given email.
     *
     * @throws ResponseStatusException 409 if the email is already registered and verified
     */
    public void register(String email, String rawPassword, String displayName) {
        // Check if an already-verified account exists for this email
        userRepository.findByEmail(email).ifPresent(existing -> {
            if (existing.isEmailVerified()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "An account with this email already exists.");
            }
            // If a pending (unverified) account exists, delete it so we can resend a fresh OTP
            userRepository.delete(existing);
            userRepository.flush();
        });

        // Derive display name from email prefix if not provided
        String name = StringUtils.hasText(displayName)
                ? displayName
                : email.substring(0, email.indexOf('@'));

        // Hash password
        String hash = passwordEncoder.encode(rawPassword);

        // Save pending user (disabled, not yet verified)
        User user = User.builder()
                .email(email)
                .passwordHash(hash)
                .name(name)
                .emailVerified(false)
                .enabled(false)
                .role(User.Role.USER)
                .build();
        userRepository.save(user);

        // Generate and send OTP
        String otp = generateOtp();
        stringRedisTemplate.opsForValue().set(
                otpKey(email), otp, Duration.ofMillis(otpExpirationMs));

        long expiryMinutes = otpExpirationMs / 60_000;
        String html = emailService.buildOtpHtml(otp, expiryMinutes);

        try {
            emailService.sendHtml(email, "Verify your Snaply account", html);
            log.info("OTP sent to {}", email);
        } catch (RuntimeException ex) {
            // Roll back OTP on email failure (user + OTP will be stale, but next register() cleans up)
            stringRedisTemplate.delete(otpKey(email));
            throw ex;
        }
    }

    // ---------------------------------------------------------------
    // Step 2 — Verify OTP → activate + issue JWT
    // ---------------------------------------------------------------

    /**
     * Validates the OTP, activates the user, and returns a JWT token string.
     *
     * @throws ResponseStatusException 400 if OTP is invalid/expired or user not found
     */
    public String verifyOtp(String email, String otp) {
        String key = otpKey(email);
        String storedOtp = stringRedisTemplate.opsForValue().get(key);

        if (storedOtp == null || !storedOtp.equals(otp)) {
            log.warn("Invalid or expired OTP for {}", email);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid or expired OTP. Please request a new one.");
        }

        // OTP is one-time use
        stringRedisTemplate.delete(key);

        // Activate user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Account not found. Please register again."));

        user.setEmailVerified(true);
        user.setEnabled(true);
        userRepository.save(user);

        log.info("Email verified for {}", email);
        return jwtService.generateToken(email);
    }

    // ---------------------------------------------------------------
    // Step 3 — Login
    // ---------------------------------------------------------------

    /**
     * Authenticates with email + password and returns a JWT token string.
     *
     * @throws ResponseStatusException 401 for wrong credentials, 403 if email not verified
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

        if (!user.isEmailVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Email not verified. Please check your inbox for the verification OTP.");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash())) {
            log.warn("Password mismatch for {}", email);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }

        log.info("Password login successful for {}", email);
        return jwtService.generateToken(email);
    }

    // ---------------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------------

    private String generateOtp() {
        return String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));
    }

    private String otpKey(String email) {
        return OTP_KEY_PREFIX + email;
    }
}
