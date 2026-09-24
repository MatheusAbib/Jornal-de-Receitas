package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.service.SiteConfigService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
