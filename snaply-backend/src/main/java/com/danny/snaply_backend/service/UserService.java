package com.danny.snaply_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.danny.snaply_backend.config.CacheConstants;
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

    @CachePut(value = CacheConstants.USERS_BY_EMAIL, key = "#user.email")    
    public User updateRefreshToken(User user, String refreshToken) {
        user.setRefreshToken(refreshToken);
        return userRepository.save(user);
    }

    @CacheEvict(value = CacheConstants.USERS_BY_EMAIL, key = "#email")    
    public void evictUserCache(String email) {
    }
}