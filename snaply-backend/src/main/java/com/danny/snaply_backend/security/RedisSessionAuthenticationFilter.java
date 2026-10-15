package com.danny.snaply_backend.security;

import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
@Component
public class RedisSessionAuthenticationFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, String> redisTemplate;
    private final UserService userService;

    public RedisSessionAuthenticationFilter(
            RedisTemplate<String, String> redisTemplate,
            UserService userService
    ) {
        this.redisTemplate = redisTemplate;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            resolveToken(request)
                    .flatMap(this::resolveUser)
                    .ifPresent(user -> setAuthentication(user, request));
        }

        filterChain.doFilter(request, response);
    }

    private Optional<String> resolveToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return Optional.of(authorization.substring(7));
        }

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (CacheConstants.AUTH_COOKIE.equals(cookie.getName())) {
                    return Optional.of(cookie.getValue());
                }
            }
        }

        String queryToken = request.getParameter("token");
        if (queryToken != null && !queryToken.isBlank()) {
            return Optional.of(queryToken.trim());
        }

        return Optional.empty();
    }

    private Optional<User> resolveUser(String token) {
        try {
            String emailValue = redisTemplate.opsForValue().get(CacheConstants.AUTH_SESSION + token);
            if (emailValue == null) {
                return Optional.empty();
            }

            return userService.findByEmailDirect(emailValue);
        } catch (Exception e) {
            log.warn("Failed to resolve user session from Redis: {}", e.getMessage());
            return Optional.empty();
        }
    }

    private void setAuthentication(User user, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                );

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}