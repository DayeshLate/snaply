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

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestHeader;

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

	@Value("${app.frontend.url:}")
	private String frontendUrl;

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
			@RequestHeader(value = HttpHeaders.ACCEPT, required = false) String acceptHeader,
			HttpServletResponse response
	) {
		String email = magicLinkService.verifyToken(token);
		boolean isBrowserRequest = acceptHeader != null && acceptHeader.contains("text/html");

		if (email == null) {
			if (isBrowserRequest) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.contentType(MediaType.TEXT_HTML)
						.body(buildErrorHtml("Magic Link Expired or Invalid", 
								"This sign-in link has expired or has already been used. Please request a new magic link from your application."));
			}
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message", "Invalid or expired magic link"));
		}

		User user = userService.createOrGetMagicLinkUser(email);
		String jwtToken = jwtService.generateToken(user.getEmail());

		// Issue Cookie
		Cookie cookie = new Cookie(ACCESS_TOKEN_COOKIE, jwtToken);
		cookie.setHttpOnly(true);
		cookie.setPath("/");
		cookie.setMaxAge((int) Duration.ofMillis(86_400_000L).getSeconds());
		response.addCookie(cookie);

		// If frontend URL is specified, redirect to frontend application
		if (StringUtils.hasText(frontendUrl)) {
			String cleanFrontendUrl = frontendUrl.endsWith("/") 
					? frontendUrl.substring(0, frontendUrl.length() - 1) 
					: frontendUrl;
			String redirectUrl = cleanFrontendUrl + "/auth/success?token=" + jwtToken;
			return ResponseEntity.status(HttpStatus.FOUND)
					.header(HttpHeaders.LOCATION, redirectUrl)
					.build();
		}

		// Direct browser navigation in backend-only mode -> Return styled HTML page instead of blank/raw JSON
		if (isBrowserRequest) {
			return ResponseEntity.ok()
					.contentType(MediaType.TEXT_HTML)
					.body(buildSuccessHtml(user, jwtToken));
		}

		return ResponseEntity.ok(toLoginResponse(user, jwtToken));
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

	private String buildSuccessHtml(User user, String token) {
		return """
				<!DOCTYPE html>
				<html lang="en">
				<head>
				    <meta charset="UTF-8">
				    <meta name="viewport" content="width=device-width, initial-scale=1.0">
				    <title>Snaply - Sign-in Successful</title>
				    <style>
				        * { box-sizing: border-box; margin: 0; padding: 0; }
				        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
				        .card { background: #18181b; border: 1px solid #27272a; border-radius: 16px; width: 100%%; max-width: 520px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); text-align: center; }
				        .icon-circle { width: 64px; height: 64px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 50%%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #22c55e; }
				        h1 { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
				        p.subtitle { color: #a1a1aa; font-size: 15px; margin-bottom: 24px; }
				        .user-box { background: #27272a; border-radius: 10px; padding: 16px; margin-bottom: 20px; text-align: left; }
				        .user-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
				        .user-row:last-child { margin-bottom: 0; }
				        .label { color: #a1a1aa; font-weight: 500; }
				        .value { color: #f4f4f5; font-weight: 600; }
				        .token-title { text-align: left; font-size: 12px; font-weight: 600; color: #a1a1aa; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
				        .token-container { background: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; color: #38bdf8; word-break: break-all; text-align: left; max-height: 80px; overflow-y: auto; margin-bottom: 20px; }
				        .btn { display: inline-block; width: 100%%; padding: 12px; background: #2563eb; color: #ffffff; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; text-decoration: none; transition: background 0.2s; }
				        .btn:hover { background: #1d4ed8; }
				        .badge { display: inline-block; padding: 4px 10px; background: rgba(37, 99, 235, 0.15); color: #60a5fa; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
				    </style>
				</head>
				<body>
				    <div class="card">
				        <div class="icon-circle">
				            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
				        </div>
				        <span class="badge">Snaply Authentication</span>
				        <h1>Signed in successfully!</h1>
				        <p class="subtitle">You have successfully authenticated via Magic Link.</p>
				        <div class="user-box">
				            <div class="user-row"><span class="label">Email</span><span class="value">%s</span></div>
				            <div class="user-row"><span class="label">User ID</span><span class="value">%s</span></div>
				            <div class="user-row"><span class="label">Role</span><span class="value">%s</span></div>
				        </div>
				        <div class="token-title">JWT Access Token</div>
				        <div class="token-container" id="tokenText">%s</div>
				        <button class="btn" onclick="navigator.clipboard.writeText(document.getElementById('tokenText').innerText); this.innerText='Copied to Clipboard!'; setTimeout(()=>this.innerText='Copy JWT Token', 2000)">Copy JWT Token</button>
				    </div>
				</body>
				</html>
				""".formatted(
				user.getEmail(),
				user.getId() != null ? user.getId().toString() : "N/A",
				user.getRole() != null ? user.getRole().name() : "USER",
				token
		);
	}

	private String buildErrorHtml(String title, String message) {
		return """
				<!DOCTYPE html>
				<html lang="en">
				<head>
				    <meta charset="UTF-8">
				    <meta name="viewport" content="width=device-width, initial-scale=1.0">
				    <title>Snaply - Authentication Error</title>
				    <style>
				        * { box-sizing: border-box; margin: 0; padding: 0; }
				        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
				        .card { background: #18181b; border: 1px solid #27272a; border-radius: 16px; width: 100%%; max-width: 480px; padding: 40px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); text-align: center; }
				        .icon-circle { width: 64px; height: 64px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 50%%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #ef4444; }
				        h1 { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
				        p { color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-bottom: 24px; }
				        .badge { display: inline-block; padding: 4px 10px; background: rgba(239, 68, 68, 0.15); color: #f87171; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
				    </style>
				</head>
				<body>
				    <div class="card">
				        <div class="icon-circle">
				            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
				        </div>
				        <span class="badge">Authentication Failed</span>
				        <h1>%s</h1>
				        <p>%s</p>
				    </div>
				</body>
				</html>
				""".formatted(title, message);
	}
}

