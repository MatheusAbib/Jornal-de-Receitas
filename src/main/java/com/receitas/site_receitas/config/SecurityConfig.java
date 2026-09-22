package com.receitas.site_receitas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/cadastro", "/css/**", "/js/**", "/uploads/**",
                                 "/detalhe/**", "/login", "/logout", "/sobre").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html",
                                 "/v3/api-docs/**", "/swagger-resources/**",
                                 "/webjars/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/**").authenticated()
                                .requestMatchers("/pendentes", "/usuarios", "/usuarios/**", "/receitas-aprovadas/**", "/admin/dashboard", "/carrossel/admin", "/carrossel/adicionar", "/carrossel/editar/**", "/carrossel/toggle/**", "/carrossel/excluir/**").hasRole("ADMIN")
                .requestMatchers("/nova", "/salvar", "/receitas/excluir/**", "/minhas-receitas/**").authenticated()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .httpBasic(httpBasic -> httpBasic.disable())
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}