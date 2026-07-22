package com.buynora.common.config;

import com.buynora.common.security.JwtAuthenticationFilter;
import com.buynora.common.security.OAuth2PlaceholderFilter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Enterprise Security Configuration Foundation.
 * Configures CORS, CSRF, Security Headers (XSS, CSP, Frame Options), Stateless Sessions,
 * and attaches JWT / OAuth filter placeholders.
 */
@Configuration
@EnableWebSecurity
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@ConditionalOnClass(SecurityFilterChain.class)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final OAuth2PlaceholderFilter oAuth2PlaceholderFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          OAuth2PlaceholderFilter oAuth2PlaceholderFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2PlaceholderFilter = oAuth2PlaceholderFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. CORS Configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. CSRF Disabled for Stateless REST APIs
            .csrf(AbstractHttpConfigurer::disable)
            
            // 3. Stateless Session Management
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Enterprise Security Headers & Protection (XSS, Frame Options, CSP, HTTPS Placeholder)
            .headers(headers -> headers
                .xssProtection(xss -> xss.headerValue(org.springframework.security.web.header.writers.XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                .frameOptions(frame -> frame.deny())
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; script-src 'self'; object-src 'none'; frame-ancestors 'none';"))
                // HTTPS / HSTS Placeholder Configuration:
                // .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000))
            )
            
            // 5. Authorization Request Rules (Permit All for infrastructure phase)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            
            // 6. Attach JWT & OAuth2 Filter Placeholders
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(oAuth2PlaceholderFilter, JwtAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "X-Trace-Id"));
        configuration.setExposedHeaders(List.of("Authorization", "X-Trace-Id"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
