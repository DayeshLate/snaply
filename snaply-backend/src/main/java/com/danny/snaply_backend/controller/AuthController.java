package com.danny.snaply_backend.controller;

import com.danny.snaply_backend.dto.LoginResponse;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.oauth.CustomOAuth2User;
import com.danny.snaply_backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final JwtService jwtService;

	@GetMapping("/me")
	public ResponseEntity<LoginResponse> me(Authentication authentication) {
		return ResponseEntity.ok(buildLoginResponse(authentication.getPrincipal()));
	}

	@PostMapping("/logout")
	public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
		String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			jwtService.invalidateToken(authHeader.substring(7));
		}

		SecurityContextHolder.clearContext();
		return ResponseEntity.ok(Map.of("message", "Logged out"));
	}

	private LoginResponse buildLoginResponse(Object principal) {
		if (principal instanceof CustomOAuth2User customOAuth2User) {
			return toLoginResponse(customOAuth2User.getUser(), null);
		}

		if (principal instanceof User user) {
			return toLoginResponse(user, null);
		}

		if (principal instanceof OAuth2User oauth2User) {
			return LoginResponse.builder()
					.user(LoginResponse.UserInfo.builder()
							.email(oauth2User.getName())
							.build())
					.build();
		}

		throw new IllegalStateException("Unsupported principal type: " + principal.getClass().getName());
	}

	private LoginResponse toLoginResponse(User user, String token) {
		return LoginResponse.builder()
				.token(token)
				.user(LoginResponse.UserInfo.builder()
						.id(user.getId())
						.googleId(user.getGoogleId())
						.name(user.getName())
						.email(user.getEmail())
						.profilePicture(user.getProfilePicture())
						.role(user.getRole().name())
						.build())
				.build();
	}
}
