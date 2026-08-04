package com.danny.snaply_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Centralised email-sending utility.
 * All auth services (magic-link, OTP, etc.) delegate here.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends an HTML email. Throws {@link RuntimeException} on SMTP failure.
     */
    public void sendHtml(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email sent to {} — subject: {}", to, subject);
        } catch (MessagingException ex) {
            log.error("Failed to send email to {}: {}", to, ex.getMessage());
            throw new RuntimeException("Failed to send email. Please try again.", ex);
        }
    }

    // ---------------------------------------------------------------
    // Email templates
    // ---------------------------------------------------------------

    /** Builds the magic-link HTML email body. */
    public String buildMagicLinkHtml(String magicLink, long expiryMinutes) {
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

    /** Builds the OTP verification HTML email body. */
    public String buildOtpHtml(String otp, long expiryMinutes) {
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
                                <p style="margin:0 0 24px; font-size:15px; color:#71717a;">Verify your email address</p>

                                <p style="margin:0 0 8px; font-size:14px; color:#52525b;">Your verification code is:</p>
                                <div style="display:inline-block; padding:16px 40px; background:#f4f4f5; border-radius:10px; font-size:36px; font-weight:700; letter-spacing:12px; color:#18181b;">
                                    %s
                                </div>

                                <p style="margin:32px 0 0; font-size:13px; color:#a1a1aa;">
                                    This code expires in %d minutes.<br>
                                    If you didn't request this, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(otp, expiryMinutes);
    }
}
