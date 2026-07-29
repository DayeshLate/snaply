package com.danny.snaply_backend.security;

import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.JwtService;
import com.danny.snaply_backend.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String token = resolveToken(authHeader, request.getCookies());

        if (token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {

            String email = jwtService.extractEmail(token);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                Optional<User> optionalUser = userService.findByEmail(email);

                if (optionalUser.isPresent()) {

                    User user = optionalUser.get();

                    if (jwtService.isTokenValid(token, user.getEmail())) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                List.of(
                                    new SimpleGrantedAuthority(
                                        "ROLE_" + user.getRole().name()
                                    )
                                )
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);

                        log.info("Authenticated {}", email);
                    }
                }
            }

        } catch (Exception ex) {

            log.error("JWT Authentication Failed: {}", ex.getMessage());

        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(String authHeader, Cookie[] cookies) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if ("snaply_access_token".equals(cookie.getName()) && cookie.getValue() != null) {
                return cookie.getValue();
            }
        }

        return null;
    }
}