package com.danny.snaply_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class GoogleDriveConfig {

    @Value("${google.drive.client-id:${GOOGLE_CLIENT_ID:}}")
    private String clientId;

    @Value("${google.drive.client-secret:${GOOGLE_CLIENT_SECRET:}}")
    private String clientSecret;

    @Value("${google.drive.redirect-uri:${GOOGLE_DRIVE_REDIRECT_URI:http://localhost:8080/api/drive/callback}}")
    private String redirectUri;

    @Value("${google.drive.scope:https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid}")
    private String scope;

    @Bean
    public RestClient googleRestClient() {
        return RestClient.builder().build();
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public String getScope() {
        return scope;
    }
}
