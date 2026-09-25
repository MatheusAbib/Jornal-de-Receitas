package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.service.SiteConfigService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/site-config")
@Tag(name = "Site Config", description = "Configurações dinâmicas do site")
public class SiteConfigController {

    @Autowired
    private SiteConfigService siteConfigService;

    @Operation(
        summary = "Buscar URL do favicon",
        description = "Retorna a URL do favicon configurado no banco de dados. Endpoint público."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "URL retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"url\": \"https://cdn-icons-png.flaticon.com/512/7761/7761545.png\"}")
            )
        )
    })
    @GetMapping("/favicon")
    public ResponseEntity<?> getFavicon() {
        String url = siteConfigService.getFaviconUrl();

        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("url", url);

        return ResponseEntity.ok(resposta);
    }

    @Operation(
        summary = "Redirecionar para o favicon configurado",
        description = "Redireciona o navegador para a URL do favicon salva no banco. Usado pela tag <link rel='icon' href='/favicon.ico'> do index.html."
    )
    @GetMapping("/favicon.ico")
    public ResponseEntity<Void> faviconIco() {
        String url = siteConfigService.getFaviconUrl();

        if (url == null || url.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(url))
                .build();
    }

    @Operation(
        summary = "Buscar URLs das receitas rápidas",
        description = "Retorna as URLs das imagens das 4 receitas rápidas exibidas na home. Endpoint público."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "URLs retornadas com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"pesto\": \"...\", \"sopa\": \"...\", \"ganache\": \"...\", \"bolinho\": \"...\"}")
            )
        )
    })
    @GetMapping("/receitas-rapidas")
    public ResponseEntity<?> getReceitasRapidas() {
        Map<String, Object> resposta = new LinkedHashMap<>();
        resposta.put("pesto", siteConfigService.getPestoUrl());
        resposta.put("sopa", siteConfigService.getSopaUrl());
        resposta.put("ganache", siteConfigService.getGanacheUrl());
        resposta.put("bolinho", siteConfigService.getBolinhoUrl());

        return ResponseEntity.ok(resposta);
    }
}
