package com.receitas.site_receitas.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("API - Jornal de Receitas")
                        .description("API REST do site Jornal de Receitas. " +
                                "Documentação completa dos endpoints de usuários, " +
                                "favoritos, notificações e receitas.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Equipe Jornal de Receitas")
                                .email("contato@jornalreceitas.com"))
                        .license(new License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081")
                                .description("Servidor de desenvolvimento")
                ))
                .tags(List.of(
                        new Tag().name("Usuários").description("Autenticação e gerenciamento de usuários"),
                        new Tag().name("Favoritos").description("Endpoints de favoritos"),
                        new Tag().name("Notificações").description("Endpoints de notificações"),
                        new Tag().name("Receitas").description("Endpoints de receitas")
                ))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Autenticação via token JWT")));
    }
}