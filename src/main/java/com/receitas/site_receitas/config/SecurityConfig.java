package com.receitas.site_receitas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/cadastro", "/css/**", "/js/**", "/uploads/**").permitAll()
                .requestMatchers("/pendentes").hasRole("ADMIN")
                // Permitir rotas de perfil para usuários autenticados
                .requestMatchers("/perfil/**", "/nova", "/salvar").authenticated()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/", true)
                .successHandler(ajaxAwareAuthenticationSuccessHandler())
                .failureHandler(ajaxAwareAuthenticationFailureHandler())
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            );
        
        return http.build();
    }
    
    @Bean
    public AuthenticationSuccessHandler ajaxAwareAuthenticationSuccessHandler() {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(HttpServletRequest request, 
                                                HttpServletResponse response,
                                                Authentication authentication) throws IOException, ServletException {
                
                String ajaxHeader = request.getHeader("X-Requested-With");
                
                if ("XMLHttpRequest".equals(ajaxHeader)) {
                    // Se for AJAX, retorna JSON
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write("{\"success\": true, \"redirectUrl\": \"/\"}");
                } else {
                    response.sendRedirect("/");
                }
            }
        };
    }
    
    @Bean
    public AuthenticationFailureHandler ajaxAwareAuthenticationFailureHandler() {
        return new AuthenticationFailureHandler() {
            @Override
            public void onAuthenticationFailure(HttpServletRequest request,
                                                HttpServletResponse response,
                                                AuthenticationException exception) throws IOException, ServletException {
                
                String ajaxHeader = request.getHeader("X-Requested-With");
                
                if ("XMLHttpRequest".equals(ajaxHeader)) {
                    // Se for AJAX, retorna JSON com erro
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write("{\"success\": false, \"message\": \"Email ou senha incorretos\"}");
                } else {
                    response.sendRedirect("/login?error=true");
                }
            }
        };
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}