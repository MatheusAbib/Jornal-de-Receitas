package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
@Tag(name = "Favoritos", description = "Endpoints para gerenciar receitas favoritas")
@SecurityRequirement(name = "sessionAuth")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @Autowired
    private UsuarioService usuarioService;

    @Operation(
        summary = "Adicionar receita aos favoritos",
        description = "Adiciona uma receita específica à lista de favoritos do usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Receita favoritada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"success\": true, \"message\": \"Receita favoritada\"}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado ou não encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Usuário não autenticado\"}")
            )
        )
    })
    @PostMapping("/{receitaId}")
    public ResponseEntity<?> adicionarFavorito(
            @Parameter(description = "ID da receita a ser favoritada", required = true, example = "1")
            @PathVariable Long receitaId,
            Authentication authentication) {
        try {
            Usuario usuario = obterUsuarioAutenticado(authentication);
            favoritoService.adicionarFavorito(usuario, receitaId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Receita favoritada"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(
        summary = "Remover receita dos favoritos",
        description = "Remove uma receita específica da lista de favoritos do usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Receita desfavoritada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"success\": true, \"message\": \"Receita desfavoritada\"}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado ou não encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Usuário não autenticado\"}")
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Erro ao remover favorito\"}")
            )
        )
    })
    @DeleteMapping("/{receitaId}")
    public ResponseEntity<?> removerFavorito(
            @Parameter(description = "ID da receita a ser desfavoritada", required = true, example = "1")
            @PathVariable Long receitaId,
            Authentication authentication) {
        try {
            Usuario usuario = obterUsuarioAutenticado(authentication);
            favoritoService.removerFavorito(usuario, receitaId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Receita desfavoritada"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao remover favorito"));
        }
    }

    @Operation(
        summary = "Listar favoritos do usuário",
        description = "Retorna a lista de IDs das receitas favoritadas pelo usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista de favoritos retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"favoritos\": [1, 5, 12, 23]}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado ou não encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Usuário não autenticado\"}")
            )
        )
    })
    @GetMapping
    public ResponseEntity<?> getFavoritos(Authentication authentication) {
        try {
            Usuario usuario = obterUsuarioAutenticado(authentication);
            List<Long> favoritos = favoritoService.getFavoritosIds(usuario);
            return ResponseEntity.ok(Map.of("favoritos", favoritos));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(
        summary = "Resumo dos favoritos do usuário",
        description = "Retorna um resumo estatístico das receitas favoritas do usuário autenticado: total de favoritos, ingredientes disponíveis para consulta e lista de ingredientes que se repetem entre as favoritas."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Resumo retornado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"totalFavoritos\": 8, \"ingredientesDisponiveis\": [\"Açúcar\", \"Chocolate\", \"Farinha\"], \"ingredientesRepetidos\": [\"Farinha\", \"Ovos\"]}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado ou não encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Usuário não autenticado\"}")
            )
        )
    })
    @GetMapping("/resumo")
    public ResponseEntity<?> getResumo(Authentication authentication) {
        try {
            Usuario usuario = obterUsuarioAutenticado(authentication);
            Map<String, Object> resumo = favoritoService.calcularResumo(usuario);
            return ResponseEntity.ok(resumo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @Operation(
        summary = "Resumo dos favoritos por ingrediente",
        description = "Retorna quantas receitas favoritas do usuário contêm um ingrediente específico, junto com a lista de títulos dessas receitas."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Resumo retornado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"ingrediente\": \"Farinha\", \"quantidade\": 4, \"receitas\": [\"Bolo de Chocolate\", \"Pão Caseiro\"]}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado ou não encontrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"error\": \"Usuário não autenticado\"}")
            )
        )
    })
    @GetMapping("/resumo/ingrediente")
    public ResponseEntity<?> getResumoPorIngrediente(
            @Parameter(description = "Nome do ingrediente a ser consultado", required = true, example = "Farinha")
            @RequestParam("nome") String nome,
            Authentication authentication) {
        try {
            Usuario usuario = obterUsuarioAutenticado(authentication);
            Map<String, Object> resumo = favoritoService.calcularResumoPorIngrediente(usuario, nome);
            return ResponseEntity.ok(resumo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private Usuario obterUsuarioAutenticado(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new RuntimeException("Usuário não autenticado");
        }

        return usuarioService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}
