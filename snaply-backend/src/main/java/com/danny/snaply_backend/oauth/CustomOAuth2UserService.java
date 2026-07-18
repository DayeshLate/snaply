package com.danny.snaply_backend.oauth;

import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserService userService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User oauth2User = new DefaultOAuth2UserService()
                .loadUser(userRequest);

        Map<String, Object> attributes = oauth2User.getAttributes();

        String googleId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");

        log.info("Google Login Attempt: {}", email);

        Optional<User> optionalUser = userService.findByEmail(email);

        User user;

        if (optionalUser.isPresent()) {

            user = optionalUser.get();

            log.info("Existing user logged in: {}", email);

        } else {

            user = userService.createGoogleUser(
                    googleId,
                    name,
                    email,
                    picture
            );

            log.info("New user created: {}", email);
        }

        return new CustomOAuth2User(user, attributes);
    }
}