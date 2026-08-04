package com.danny.snaply_backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

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
    private final JavaMailSender mailSender;

    @Value("${magic-link.expiration-ms:600000}")
    private long magicLinkExpirationMs;

    @Value("${app.backend.url:http://localhost:8080}")
    private String backendUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendMagicLink(String email) {
        String token = generateSecureToken();

        stringRedisTemplate.opsForValue().set(
                redisKey(token),
                email,
                Duration.ofMillis(magicLinkExpirationMs)
        );

        String magicLink = buildMagicLink(token);

        try {
            sendEmail(email, magicLink);
            log.info("Magic link sent to {}", email);
        } catch (MessagingException ex) {
            stringRedisTemplate.delete(redisKey(token));
            log.error("Failed to send magic link email to {}: {}", email, ex.getMessage());
            throw new RuntimeException("Failed to send magic link email. Please try again.", ex);
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

    private void sendEmail(String to, String magicLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject("Sign in to Snaply");
        helper.setText(buildEmailHtml(magicLink), true);

        mailSender.send(message);
    }

    private String buildEmailHtml(String magicLink) {
        long expiryMinutes = magicLinkExpirationMs / 60_000;

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin:0; padding:0; background-color:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <table role="presentation" width="100%%" cellspacing="0" cellpadding="0" style="max-width:480px; margin:40px auto; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                        <tr>
                            <td style="padding:40px 32px; text-align:center;">
                                <h1 style="margin:0 0 8px; font-size:24px; font-weight:700; color:#18181b;">Snaply</h1>
                                <p style="margin:0 0 32px; font-size:15px; color:#71717a;">Sign in to your account</p>

                                <a href="%s"
                                   style="display:inline-block; padding:14px 40px; background:#2563eb; color:#ffffff; text-decoration:none; border-radius:8px; font-size:15px; font-weight:600; letter-spacing:0.3px;">
                                    Sign in to Snaply
                                </a>

                                <p style="margin:32px 0 0; font-size:13px; color:#a1a1aa;">
                                    This link expires in %d minutes.<br>
                                    If you didn't request this, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(magicLink, expiryMinutes);
    }

    private String redisKey(String token) {
        return MAGIC_KEY_PREFIX + token;
    }
}
