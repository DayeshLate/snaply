package com.danny.snaply_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.danny.snaply_backend.config.CacheConstants;
import com.danny.snaply_backend.entity.Group;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConstants.USERS_BY_EMAIL, key = "#email")    
    public Optional<User> findByEmail(String email) {
        System.out.println("Fetching user from Database...");
        return userRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = CacheConstants.USERS_BY_GOOGLE_ID,key = "#googleId"
)    public Optional<User> findByGoogleId(String googleId) {
        System.out.println("Fetching user from Database...");
        return userRepository.findByGoogleId(googleId);
    }

    @CachePut(value = CacheConstants.USERS_BY_EMAIL, key = "#user.email")    
    public User save(User user) {
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean existsByGoogleId(String googleId) {
        return userRepository.existsByGoogleId(googleId);
    }

    @CachePut(value = CacheConstants.USERS_BY_EMAIL, key = "#email")    
    public User createGoogleUser(
            String googleId,
            String name,
            String email,
            String profilePicture
    ) {

        User user = User.builder()
                .googleId(googleId)
                .name(name)
                .email(email)
                .profilePicture(profilePicture)
                .role(User.Role.USER)
                .enabled(true)
                .build();

        return userRepository.save(user);
    }

    public User createOrGetDevUser(String name, String email) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> save(User.builder()
                        .googleId("dev:" + email)
                        .name(name)
                        .email(email)
                        .profilePicture(null)
                        .role(User.Role.USER)
                        .enabled(true)
                        .build()));
    }

    @CachePut(value = CacheConstants.USERS_BY_EMAIL, key = "#email")
    public User createOrGetMagicLinkUser(String email) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    String nameFromEmail = email.contains("@")
                            ? email.substring(0, email.indexOf("@"))
                            : email;

                    return userRepository.save(User.builder()
                            .name(nameFromEmail)
                            .email(email)
                            .role(User.Role.USER)
                            .enabled(true)
                            .build());
                });
    }


@Transactional(readOnly = true)
public User getCurrentUser() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null || !authentication.isAuthenticated()
            || "anonymousUser".equals(authentication.getPrincipal())) {
        throw new RuntimeException("No authenticated user found");
    }

    String email = authentication.getName(); // Assuming email is the username

    return findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
}

    @CacheEvict(value = CacheConstants.USERS_BY_EMAIL, key = "#email")    
    public void evictUserCache(String email) {
    }
}