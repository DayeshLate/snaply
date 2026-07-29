package com.danny.snaply_backend.controller;

import com.danny.snaply_backend.dto.LoginResponse;
import com.danny.snaply_backend.dto.MagicLinkRequest;
import com.danny.snaply_backend.entity.User;
import com.danny.snaply_backend.service.JwtService;
import com.danny.snaply_backend.service.MagicLinkService;
import com.danny.snaply_backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.time.Duration;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private static final String ACCESS_TOKEN_COOKIE = "snaply_access_token";

	private final JwtService jwtService;
	private final UserService userService;
	private final MagicLinkService magicLinkService;

	@Value("${app.auth.dev-login-enabled:false}")
	private boolean devLoginEnabled;

	// ── Magic Link endpoints ──────────────────────────────────────────

	@PostMapping("/magic-link")
	public ResponseEntity<Map<String, String>> sendMagicLink(
			@Valid @RequestBody MagicLinkRequest request
	) {
		magicLinkService.sendMagicLink(request.getEmail());
		return ResponseEntity.ok(Map.of("message", "Magic link sent to " + request.getEmail()));
	}

	@GetMapping("/verify")
	public ResponseEntity<?> verifyMagicLink(
			@RequestParam String token,
			HttpServletResponse response
	) {
		String email = magicLinkService.verifyToken(token);

		if (email == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message", "Invalid or expired magic link"));
		}

		User user = userService.createOrGetMagicLinkUser(email);
		return issueAuthResponse(user, response);
	}

	// ── Existing endpoints ────────────────────────────────────────────

	@GetMapping("/me")
	public ResponseEntity<LoginResponse> me(Authentication authentication) {
		User user = (User) authentication.getPrincipal();
		return ResponseEntity.ok(toLoginResponse(user, null));
	}

	@PostMapping("/dev-login")
	public ResponseEntity<?> devLogin(
			@RequestParam String email,
			@RequestParam(required = false) String name,
			HttpServletResponse response
	) {
		if (!devLoginEnabled) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "Dev login is disabled"));
		}

		String safeName = StringUtils.hasText(name) ? name : "Dev User";
		User user = userService.createOrGetDevUser(safeName, email);
		return issueAuthResponse(user, response);
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

	// ── Helpers ───────────────────────────────────────────────────────

	private ResponseEntity<LoginResponse> issueAuthResponse(User user, HttpServletResponse response) {
		String token = jwtService.generateToken(user.getEmail());
		Cookie cookie = new Cookie(ACCESS_TOKEN_COOKIE, token);
		cookie.setHttpOnly(true);
		cookie.setPath("/");
		cookie.setMaxAge((int) Duration.ofMillis(86_400_000L).getSeconds());
		response.addCookie(cookie);

		return ResponseEntity.ok(toLoginResponse(user, token));
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
