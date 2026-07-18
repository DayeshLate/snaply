package com.danny.snaply_backend.oauth;

import com.danny.snaply_backend.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        CustomOAuth2User oauthUser =
                (CustomOAuth2User) authentication.getPrincipal();

        String jwt = jwtService.generateToken(oauthUser.getUser().getEmail());

        log.info("JWT generated for {}", oauthUser.getEmail());

        String redirectUrl =
                frontendUrl + "/oauth2/success?token=" + jwt;

        response.sendRedirect(redirectUrl);
    }
}