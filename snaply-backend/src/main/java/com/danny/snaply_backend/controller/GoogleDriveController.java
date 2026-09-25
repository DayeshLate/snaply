package com.danny.snaply_backend.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.danny.snaply_backend.dto.GoogleDriveAuthUrlDTO;
import com.danny.snaply_backend.dto.GoogleDriveStatusDTO;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.GoogleDriveService;
import com.danny.snaply_backend.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/drive")
@RequiredArgsConstructor
public class GoogleDriveController {

    private final GoogleDriveService googleDriveService;
    private final UserService userService;

    @Value("${app.frontend.url:}")
    private String frontendUrl;

    @GetMapping("/auth-url")
    public ResponseEntity<GoogleDriveAuthUrlDTO> getAuthUrl() {
        User currentUser = userService.getCurrentUser();
        String authUrl = googleDriveService.generateAuthUrl(currentUser.getId());
        return ResponseEntity.ok(new GoogleDriveAuthUrlDTO(authUrl));
    }

    @GetMapping("/connect")
    public ResponseEntity<Void> connectDrive() {
        User currentUser = userService.getCurrentUser();
        String authUrl = googleDriveService.generateAuthUrl(currentUser.getId());
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(authUrl))
                .build();
    }

    @GetMapping("/callback")
    public ResponseEntity<?> handleCallback(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "error", required = false) String error
    ) {
        if (error != null && !error.isBlank()) {
            log.warn("Google Drive OAuth error received: {}", error);
            if (frontendUrl != null && !frontendUrl.isBlank()) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(frontendUrl + "/settings?drive_error=" + error))
                        .build();
            }
            return ResponseEntity.badRequest()
                    .contentType(MediaType.TEXT_HTML)
                    .body("<h3>Google Drive Authorization Failed</h3><p>Error: " + error + "</p>");
        }

        if (code == null || state == null) {
            return ResponseEntity.badRequest().body("Missing code or state parameter");
        }

        try {
            User user = googleDriveService.handleOAuthCallback(code, state);

            if (frontendUrl != null && !frontendUrl.isBlank()) {
                String target = frontendUrl + "/settings?drive=connected&email=" + (user.getGoogleEmail() != null ? user.getGoogleEmail() : "");
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create(target))
                        .build();
            }

            String htmlSuccess = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Google Drive Connected</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }
                        .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 480px; text-align: center; border: 1px solid #334155; }
                        .icon { width: 56px; height: 56px; margin: 0 auto 1.5rem; background: #059669; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                        .icon svg { width: 32px; height: 32px; fill: white; }
                        h2 { margin: 0 0 0.5rem; color: #f1f5f9; font-size: 1.5rem; }
                        p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin: 0.5rem 0; }
                        .badge { display: inline-block; background: #334155; color: #38bdf8; padding: 0.35rem 0.8rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.875rem; margin-top: 0.75rem; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <div class="icon">
                            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </div>
                        <h2>Google Drive Connected!</h2>
                        <p>Your Google Drive account has been linked to Snaply.</p>
                        <div class="badge">%s</div>
                        <p style="margin-top: 1.5rem; font-size: 0.85rem; color: #64748b;">You can safely close this window and continue using Snaply.</p>
                    </div>
                </body>
                </html>
                """.formatted(user.getGoogleEmail() != null ? user.getGoogleEmail() : "Drive Connected");

            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_HTML)
                    .body(htmlSuccess);

        } catch (Exception e) {
            log.error("Failed to complete Google Drive callback: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_HTML)
                    .body("<h3>Google Drive Connection Failed</h3><p>" + e.getMessage() + "</p>");
        }
    }

    @GetMapping("/status")
    public ResponseEntity<GoogleDriveStatusDTO> getStatus() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(googleDriveService.getStatus(currentUser));
    }

    @PostMapping("/disconnect")
    public ResponseEntity<String> disconnect() {
        User currentUser = userService.getCurrentUser();
        googleDriveService.disconnectDrive(currentUser);
        return ResponseEntity.ok("Google Drive disconnected successfully");
    }
}
