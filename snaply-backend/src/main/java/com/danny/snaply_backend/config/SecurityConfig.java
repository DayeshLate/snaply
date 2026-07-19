package com.danny.snaply_backend.config;

import com.danny.snaply_backend.oauth.CustomOAuth2UserService;
import com.danny.snaply_backend.oauth.OAuth2SuccessHandler;
import com.danny.snaply_backend.security.JwtAuthenticationEntryPoint;
import com.danny.snaply_backend.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${app.frontend.url:}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	http
		.csrf(csrf -> csrf.disable())
		.cors(cors -> cors.configurationSource(corsConfigurationSource()))
		.sessionManagement(session -> session
			.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
		.exceptionHandling(ex -> ex
			.authenticationEntryPoint(jwtAuthenticationEntryPoint))
		.authorizeHttpRequests(auth -> auth
			.requestMatchers(
				"/",
				"/error",
				"/favicon.ico",
				"/oauth2/**",
				"/login/**",
				"/api/auth/oauth2/**"
			).permitAll()
			.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
			.anyRequest().authenticated())
		.oauth2Login(oauth2 -> oauth2
			.userInfoEndpoint(userInfo -> userInfo
				.userService(customOAuth2UserService))
			.successHandler(oAuth2SuccessHandler))
		.logout(logout -> logout
			.logoutUrl("/api/auth/logout")
			.invalidateHttpSession(true)
			.clearAuthentication(true)
			.deleteCookies("JSESSIONID"))
		.httpBasic(Customizer.withDefaults());

	http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

	return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
	CorsConfiguration configuration = new CorsConfiguration();
	configuration.setAllowCredentials(false);
	configuration.setAllowedOriginPatterns(List.of(
		frontendUrl == null || frontendUrl.isBlank() ? "*" : frontendUrl
	));
	configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
	configuration.setAllowedHeaders(List.of("*"));

	UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	source.registerCorsConfiguration("/**", configuration);
	return source;
    }
}
