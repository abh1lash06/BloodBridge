package com.bloodbridge.config;

import com.bloodbridge.service.CustomUserDetailsService;
import jakarta.servlet.DispatcherType;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    /**
     * CORS configuration
     *
     * Frontend:
     * http://localhost:3000
     *
     * Backend:
     * http://localhost:8080
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:3000")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CustomUserDetailsService userDetailsService,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) throws Exception {

        http
                // CSRF disabled because this is a stateless JWT API
                .csrf(csrf -> csrf.disable())

                // Enable CORS for the React frontend
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                // Stateless authentication using JWT
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .userDetailsService(userDetailsService)

                // Security headers
                .headers(headers -> headers
                        .frameOptions(frame ->
                                frame.deny()
                        )
                        .httpStrictTransportSecurity(hsts ->
                                hsts
                                        .includeSubDomains(true)
                                        .maxAgeInSeconds(31536000)
                        )
                )

                // Authorization rules
                .authorizeHttpRequests(auth -> auth

                        // Allow Spring error dispatches
                        .dispatcherTypeMatchers(
                                DispatcherType.ERROR
                        ).permitAll()

                        // Public authentication endpoints
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // Public Swagger/OpenAPI documentation
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Public health check
                        .requestMatchers(
                                "/actuator/health"
                        ).permitAll()

                        // Patient test endpoints
                        .requestMatchers(
                                "/api/test/patient/**"
                        ).hasRole("PATIENT")

                        // Donor test endpoints
                        .requestMatchers(
                                "/api/test/donor/**"
                        ).hasRole("DONOR")

                        // Hospital test endpoints
                        .requestMatchers(
                                "/api/test/hospital/**"
                        ).hasRole("HOSPITAL")

                        // Admin test endpoints
                        .requestMatchers(
                                "/api/test/admin/**"
                        ).hasRole("ADMIN")

                        // Admin endpoints
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // Donor profile and matching endpoints
                        .requestMatchers(
                                "/api/donors/**"
                        ).hasAnyRole("PATIENT", "DONOR")

                        // Patient blood request endpoints
                        .requestMatchers(
                                "/api/blood-requests/**"
                        ).hasRole("PATIENT")

                        // Donor workflow endpoints
                        .requestMatchers(
                                "/api/donor/**"
                        ).hasRole("DONOR")

                        // Hospital workflow endpoints
                        .requestMatchers(
                                "/api/hospital/**"
                        ).hasRole("HOSPITAL")

                        // Notifications
                        .requestMatchers(
                                "/api/notifications/**"
                        ).authenticated()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                // JWT authentication filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}