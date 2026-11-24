package com.receitas.site_receitas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // origens permitidas para o CORS (Vercel, localhost, etc.)
    @Value("${cors.allowed.origins:http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // habilita CORS usando a configuração abaixo
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // CSRF desabilitado para API REST consumida por SPA
            .csrf(csrf -> csrf.disable())
            // define quem pode acessar cada endpoint
            .authorizeHttpRequests(auth -> auth
                // arquivos estáticos e Swagger são públicos
                .requestMatchers("/css/**", "/js/**", "/uploads/**", "/static/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/swagger-ui.html",
                                 "/v3/api-docs/**", "/swagger-resources/**",
                                 "/webjars/**").permitAll()

                // cadastro, login e logout são públicos
                .requestMatchers("/api/cadastro", "/api/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/login/google/nonce", "/api/login/google").permitAll()
                .requestMatchers("/api/perfil/usuario-logado").permitAll()
                .requestMatchers("/api/logout").permitAll()

                // perfil detalhado exige usuário autenticado
                .requestMatchers("/api/perfil/**").authenticated()

                // rotas de usuário são restritas ao ADMIN
                .requestMatchers("/api/usuarios/**").hasRole("ADMIN")

                // consultas administrativas de receitas são restritas ao ADMIN
                .requestMatchers("/api/receitas/pendentes", "/api/receitas/rejeitadas", "/api/receitas/aprovadas").hasRole("ADMIN")
                .requestMatchers("/api/receitas/minhas").authenticated()
                .requestMatchers("/api/receitas/*/aprovar", "/api/receitas/*/rejeitar").hasRole("ADMIN")

                // listagem pública de receitas (home e detalhes)
                .requestMatchers("/api/receitas", "/api/receitas/*").permitAll()
                // demais ações em /api/receitas/** exigem autenticação
                .requestMatchers("/api/receitas/**").authenticated()

                // configurações do site são públicas (favicon, imagens, etc.)
                .requestMatchers("/api/site-config/**").permitAll()

                // gerenciamento do carrossel é restrito ao ADMIN
                .requestMatchers("/api/carrossel/admin", "/api/carrossel/adicionar",
                                 "/api/carrossel/editar/**", "/api/carrossel/toggle/**",
                                 "/api/carrossel/excluir/**").hasRole("ADMIN")
                // carrossel público (home) é aberto
                .requestMatchers("/api/carrossel").permitAll()

                // favoritos e notificações exigem usuário logado
                .requestMatchers("/api/favoritos/**").authenticated()
                .requestMatchers("/api/notificacoes/**").authenticated()

                // qualquer outra rota exige autenticação
                .anyRequest().authenticated()
            )
            // desativa o formulário de login padrão do Spring (login feito via API)
            .formLogin(form -> form.disable())
            // desativa HTTP Basic (não usamos Authorization: Basic)
            .httpBasic(httpBasic -> httpBasic.disable())
            // configura o endpoint de logout da API
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

        // permite apenas as origens configuradas (Vercel + localhost)
        config.setAllowedOriginPatterns(Arrays.asList(allowedOrigins.split(",")));
        // métodos HTTP aceitos na API
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // libera todos os headers de entrada
        config.setAllowedHeaders(List.of("*"));
        // expõe o header Set-Cookie para o frontend
        config.setExposedHeaders(List.of("Set-Cookie"));
        // permite envio de cookies (JSESSIONID) no CORS
        config.setAllowCredentials(true);
        // tempo de cache da configuração de CORS
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // aplica a configuração de CORS para todos os endpoints
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        // encoder usado para hashear e validar senhas de usuário
        return new BCryptPasswordEncoder();
    }
}
