package com.danny.snaply_backend.controller;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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

    private String resolveFrontendBaseUrl() {
        if (frontendUrl == null || frontendUrl.isBlank()) {
            return "http://localhost:5173";
        }
        return frontendUrl.split(",")[0].trim();
    }

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
        String baseUrl = resolveFrontendBaseUrl();

        if (error != null && !error.isBlank()) {
            log.warn("Google Drive OAuth error received: {}", error);
            String target = baseUrl + "/settings?drive_error=" + URLEncoder.encode(error, StandardCharsets.UTF_8);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(target))
                    .build();
        }

        if (code == null || state == null) {
            String target = baseUrl + "/settings?drive_error=" + URLEncoder.encode("Missing authorization code or state parameter", StandardCharsets.UTF_8);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(target))
                    .build();
        }

        try {
            User user = googleDriveService.handleOAuthCallback(code, state);

            String emailParam = user.getGoogleEmail() != null ? user.getGoogleEmail() : "";
            String target = baseUrl + "/settings?drive=connected&email=" + URLEncoder.encode(emailParam, StandardCharsets.UTF_8);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(target))
                    .build();

        } catch (Exception e) {
            log.error("Failed to complete Google Drive callback: {}", e.getMessage(), e);

            // If the state was consumed or expired, check if user is already connected
            try {
                User currentUser = userService.getCurrentUser();
                if (currentUser.isDriveConnected()) {
                    String emailParam = currentUser.getGoogleEmail() != null ? currentUser.getGoogleEmail() : "";
                    String target = baseUrl + "/settings?drive=connected&email=" + URLEncoder.encode(emailParam, StandardCharsets.UTF_8);
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(URI.create(target))
                            .build();
                }
            } catch (Exception ignored) {}

            String errorMsg = e.getMessage() != null ? e.getMessage() : "Unknown error";
            String target = baseUrl + "/settings?drive_error=" + URLEncoder.encode(errorMsg, StandardCharsets.UTF_8);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(target))
                    .build();
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
