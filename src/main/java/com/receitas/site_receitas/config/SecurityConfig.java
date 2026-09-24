package com.receitas.site_receitas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${cors.allowed.origins:http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/css/**", "/js/**", "/uploads/**", "/static/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html",
                                 "/v3/api-docs/**", "/swagger-resources/**",
                                 "/webjars/**").permitAll()

                .requestMatchers("/api/cadastro", "/api/login").permitAll()
                .requestMatchers("/api/perfil/usuario-logado").permitAll()
                .requestMatchers("/api/logout", "/api/perfil/**").authenticated()

                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                .requestMatchers("/api/receitas/pendentes", "/api/receitas/rejeitadas", "/api/receitas/aprovadas").hasRole("ADMIN")
                .requestMatchers("/api/receitas/minhas").authenticated()
                .requestMatchers("/api/receitas/*/aprovar", "/api/receitas/*/rejeitar").hasRole("ADMIN")

                .requestMatchers("/api/receitas", "/api/receitas/*").permitAll()
                .requestMatchers("/api/receitas/**").authenticated()

                .requestMatchers("/api/carrossel/admin", "/api/carrossel/adicionar",
                                 "/api/carrossel/editar/**", "/api/carrossel/toggle/**",
                                 "/api/carrossel/excluir/**").hasRole("ADMIN")
                .requestMatchers("/api/carrossel").permitAll()

                .requestMatchers("/api/favoritos/**").authenticated()
                .requestMatchers("/api/notificacoes/**").authenticated()

                .anyRequest().permitAll()
            )
            .formLogin(form -> form.disable())
            .httpBasic(httpBasic -> httpBasic.disable())
            .logout(logout -> logout
                .logoutUrl("/api/logout")
                .logoutSuccessUrl("/")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Set-Cookie"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
