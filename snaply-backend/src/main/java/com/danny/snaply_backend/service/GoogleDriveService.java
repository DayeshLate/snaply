package com.danny.snaply_backend.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.config.GoogleDriveConfig;
import com.danny.snaply_backend.dto.GoogleDriveFileDTO;
import com.danny.snaply_backend.dto.GoogleDriveStatusDTO;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleDriveService {

    private final GoogleDriveConfig driveConfig;
    private final RestClient googleRestClient;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final UserService userService;

    public String generateAuthUrl(Long userId) {
        if (driveConfig.getClientId() == null || driveConfig.getClientId().isBlank()) {
            throw new RuntimeException("Google Client ID is not configured. Please set GOOGLE_CLIENT_ID in your environment.");
        }

        String state = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(
                CacheConstants.GOOGLE_OAUTH_STATE + state,
                String.valueOf(userId),
                Duration.ofMinutes(15)
        );

        return UriComponentsBuilder.fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", driveConfig.getClientId())
                .queryParam("redirect_uri", driveConfig.getRedirectUri())
                .queryParam("response_type", "code")
                .queryParam("scope", driveConfig.getScope())
                .queryParam("access_type", "offline")
                .queryParam("prompt", "consent select_account")
                .queryParam("state", state)
                .build()
                .toUriString();
    }

    @Transactional
    public User handleOAuthCallback(String code, String state) {
        String key = CacheConstants.GOOGLE_OAUTH_STATE + state;
        String userIdStr = redisTemplate.opsForValue().get(key);

        if (userIdStr == null || userIdStr.isBlank()) {
            throw new RuntimeException("Invalid or expired OAuth state parameter");
        }

        redisTemplate.delete(key);
        Long userId = Long.valueOf(userIdStr);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        MultiValueMap<String, String> tokenRequest = new LinkedMultiValueMap<>();
        tokenRequest.add("code", code);
        tokenRequest.add("client_id", driveConfig.getClientId());
        tokenRequest.add("client_secret", driveConfig.getClientSecret());
        tokenRequest.add("redirect_uri", driveConfig.getRedirectUri());
        tokenRequest.add("grant_type", "authorization_code");

        JsonNode tokenResponse;
        try {
            tokenResponse = googleRestClient.post()
                    .uri("https://oauth2.googleapis.com/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(tokenRequest)
                    .retrieve()
                    .body(JsonNode.class);
        } catch (Exception e) {
            log.error("Failed to exchange code with Google: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to exchange authorization code with Google: " + e.getMessage());
        }

        if (tokenResponse == null || !tokenResponse.has("access_token")) {
            throw new RuntimeException("Google OAuth response missing access token");
        }

        String accessToken = tokenResponse.get("access_token").asText();
        int expiresIn = tokenResponse.has("expires_in") ? tokenResponse.get("expires_in").asInt() : 3600;

        String refreshToken = null;
        if (tokenResponse.has("refresh_token") && !tokenResponse.get("refresh_token").asText().isBlank()) {
            refreshToken = tokenResponse.get("refresh_token").asText();
        }

        JsonNode userInfo = null;
        try {
            userInfo = googleRestClient.get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .body(JsonNode.class);
        } catch (Exception e) {
            log.warn("Failed to retrieve Google userinfo: {}", e.getMessage());
        }

        String googleId = (userInfo != null && userInfo.has("sub")) ? userInfo.get("sub").asText() : null;
        String googleEmail = (userInfo != null && userInfo.has("email")) ? userInfo.get("email").asText() : null;

        if (googleId != null) {
            user.setGoogleId(googleId);
        }
        if (googleEmail != null) {
            user.setGoogleEmail(googleEmail);
        }
        if (refreshToken != null) {
            user.setRefreshToken(refreshToken);
        }
        user.setDriveConnected(true);

        cacheAccessToken(user.getId(), accessToken, expiresIn);

        String rootFolderId = ensureSnaplyRootFolder(accessToken, user.getDriveRootFolderId());
        user.setDriveRootFolderId(rootFolderId);

        User savedUser = userRepository.save(user);
        userService.evictUserCache(savedUser.getEmail());

        log.info("Google Drive successfully connected for user: {} ({})", savedUser.getEmail(), googleEmail);
        return savedUser;
    }

    public String getValidAccessToken(User user) {
        if (!user.isDriveConnected() || user.getRefreshToken() == null || user.getRefreshToken().isBlank()) {
            throw new RuntimeException("Google Drive is not connected for user: " + user.getEmail() + ". Please connect your Google Drive account first.");
        }

        String cacheKey = CacheConstants.GOOGLE_DRIVE_ACCESS_TOKEN + user.getId();
        String cachedToken = redisTemplate.opsForValue().get(cacheKey);
        if (cachedToken != null && !cachedToken.isBlank()) {
            return cachedToken;
        }

        MultiValueMap<String, String> refreshRequest = new LinkedMultiValueMap<>();
        refreshRequest.add("refresh_token", user.getRefreshToken());
        refreshRequest.add("client_id", driveConfig.getClientId());
        refreshRequest.add("client_secret", driveConfig.getClientSecret());
        refreshRequest.add("grant_type", "refresh_token");

        JsonNode refreshResponse;
        try {
            refreshResponse = googleRestClient.post()
                    .uri("https://oauth2.googleapis.com/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(refreshRequest)
                    .retrieve()
                    .body(JsonNode.class);
        } catch (Exception e) {
            log.error("Failed to refresh Google access token for user {}: {}", user.getEmail(), e.getMessage());
            throw new RuntimeException("Failed to refresh Google Drive session. Please reconnect your Google Drive account.");
        }

        if (refreshResponse == null || !refreshResponse.has("access_token")) {
            throw new RuntimeException("Google OAuth response missing access token during refresh");
        }

        String accessToken = refreshResponse.get("access_token").asText();
        int expiresIn = refreshResponse.has("expires_in") ? refreshResponse.get("expires_in").asInt() : 3600;

        cacheAccessToken(user.getId(), accessToken, expiresIn);
        return accessToken;
    }

    public String createFolder(User user, String folderName, String parentFolderId) {
        String accessToken = getValidAccessToken(user);

        String parent = (parentFolderId != null && !parentFolderId.isBlank())
                ? parentFolderId
                : user.getDriveRootFolderId();

        Map<String, Object> folderMeta = new HashMap<>();
        folderMeta.put("name", folderName);
        folderMeta.put("mimeType", "application/vnd.google-apps.folder");
        if (parent != null && !parent.isBlank()) {
            folderMeta.put("parents", List.of(parent));
        }

        try {
            JsonNode response = googleRestClient.post()
                    .uri("https://www.googleapis.com/drive/v3/files?fields=id,name")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(folderMeta)
                    .retrieve()
                    .body(JsonNode.class);

            if (response != null && response.has("id")) {
                return response.get("id").asText();
            }
            throw new RuntimeException("No folder ID returned from Google Drive");
        } catch (Exception e) {
            log.error("Failed to create folder '{}' in Google Drive: {}", folderName, e.getMessage());
            throw new RuntimeException("Failed to create Google Drive folder: " + e.getMessage());
        }
    }

    public GoogleDriveFileDTO uploadFile(User user, MultipartFile file, String parentFolderId) {
        String accessToken = getValidAccessToken(user);

        String parent = (parentFolderId != null && !parentFolderId.isBlank())
                ? parentFolderId
                : user.getDriveRootFolderId();

        String originalFilename = file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank()
                ? file.getOriginalFilename()
                : "snaply_" + System.currentTimeMillis();

        String contentType = file.getContentType() != null && !file.getContentType().isBlank()
                ? file.getContentType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        try {
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("name", originalFilename);
            if (parent != null && !parent.isBlank()) {
                metadata.put("parents", List.of(parent));
            }
            String metadataJson = objectMapper.writeValueAsString(metadata);

            String boundary = "-------SnaplyBoundary" + UUID.randomUUID().toString().replace("-", "");
            byte[] fileBytes = file.getBytes();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            baos.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
            baos.write("Content-Type: application/json; charset=UTF-8\r\n\r\n".getBytes(StandardCharsets.UTF_8));
            baos.write(metadataJson.getBytes(StandardCharsets.UTF_8));
            baos.write("\r\n".getBytes(StandardCharsets.UTF_8));

            baos.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
            baos.write(("Content-Type: " + contentType + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
            baos.write(fileBytes);
            baos.write(("\r\n--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));

            JsonNode response = googleRestClient.post()
                    .uri("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .header(HttpHeaders.CONTENT_TYPE, "multipart/related; boundary=" + boundary)
                    .body(baos.toByteArray())
                    .retrieve()
                    .body(JsonNode.class);

            if (response == null || !response.has("id")) {
                throw new RuntimeException("Google Drive file upload failed - no ID returned");
            }

            return new GoogleDriveFileDTO(
                    response.path("id").asText(),
                    response.path("name").asText(originalFilename),
                    response.path("mimeType").asText(contentType),
                    response.has("size") ? new BigInteger(response.path("size").asText()) : BigInteger.valueOf(fileBytes.length),
                    response.path("webViewLink").asText(null),
                    response.path("webContentLink").asText(null)
            );
        } catch (IOException e) {
            log.error("Failed to read upload file bytes: {}", e.getMessage());
            throw new RuntimeException("Failed to read file data: " + e.getMessage());
        } catch (Exception e) {
            log.error("Failed to upload file '{}' to Google Drive: {}", originalFilename, e.getMessage());
            throw new RuntimeException("Failed to upload file to Google Drive: " + e.getMessage());
        }
    }

    public byte[] downloadFile(User user, String driveFileId) {
        String accessToken = getValidAccessToken(user);

        try {
            return googleRestClient.get()
                    .uri("https://www.googleapis.com/drive/v3/files/{id}?alt=media", driveFileId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .body(byte[].class);
        } catch (Exception e) {
            log.error("Failed to download file '{}' from Google Drive: {}", driveFileId, e.getMessage());
            throw new RuntimeException("Failed to download file from Google Drive: " + e.getMessage());
        }
    }

    public void deleteFileOrFolder(User user, String driveId) {
        if (driveId == null || driveId.isBlank()) {
            return;
        }

        try {
            String accessToken = getValidAccessToken(user);
            googleRestClient.delete()
                    .uri("https://www.googleapis.com/drive/v3/files/{id}", driveId)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Deleted Google Drive item '{}' for user {}", driveId, user.getEmail());
        } catch (Exception e) {
            log.warn("Could not delete item '{}' from Google Drive: {}", driveId, e.getMessage());
        }
    }

    @Transactional
    public void disconnectDrive(User user) {
        user.setRefreshToken(null);
        user.setDriveConnected(false);
        user.setGoogleEmail(null);

        redisTemplate.delete(CacheConstants.GOOGLE_DRIVE_ACCESS_TOKEN + user.getId());
        userRepository.save(user);
        userService.evictUserCache(user.getEmail());
        log.info("Disconnected Google Drive for user: {}", user.getEmail());
    }

    public GoogleDriveStatusDTO getStatus(User user) {
        return new GoogleDriveStatusDTO(
                user.isDriveConnected(),
                user.getGoogleEmail(),
                user.getGoogleId(),
                user.getDriveRootFolderId()
        );
    }

    private String ensureSnaplyRootFolder(String accessToken, String existingFolderId) {
        if (existingFolderId != null && !existingFolderId.isBlank()) {
            try {
                JsonNode existing = googleRestClient.get()
                        .uri("https://www.googleapis.com/drive/v3/files/{id}?fields=id,trashed", existingFolderId)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                        .retrieve()
                        .body(JsonNode.class);

                if (existing != null && !existing.path("trashed").asBoolean(false)) {
                    return existingFolderId;
                }
            } catch (Exception ignored) {
                // Folder may not exist or was deleted, recreate
            }
        }

        try {
            JsonNode searchNode = googleRestClient.get()
                    .uri("https://www.googleapis.com/drive/v3/files?q={q}&fields=files(id,name)",
                            "name = 'Snaply' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .body(JsonNode.class);

            if (searchNode != null && searchNode.has("files") && !searchNode.get("files").isEmpty()) {
                return searchNode.get("files").get(0).get("id").asText();
            }
        } catch (Exception ignored) {}

        try {
            Map<String, Object> folderMeta = Map.of(
                    "name", "Snaply",
                    "mimeType", "application/vnd.google-apps.folder"
            );

            JsonNode created = googleRestClient.post()
                    .uri("https://www.googleapis.com/drive/v3/files?fields=id,name")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(folderMeta)
                    .retrieve()
                    .body(JsonNode.class);

            if (created != null && created.has("id")) {
                return created.get("id").asText();
            }
        } catch (Exception e) {
            log.error("Failed to create root 'Snaply' folder in Google Drive: {}", e.getMessage());
        }

        return null;
    }

    private void cacheAccessToken(Long userId, String accessToken, int expiresIn) {
        long ttlSeconds = Math.max(expiresIn - 60, 60);
        redisTemplate.opsForValue().set(
                CacheConstants.GOOGLE_DRIVE_ACCESS_TOKEN + userId,
                accessToken,
                Duration.ofSeconds(ttlSeconds)
        );
    }
}
