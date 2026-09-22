package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
        @ApiResponse(responseCode = "200", description = "Receita favoritada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado ou não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping("/{receitaId}")
    public ResponseEntity<?> adicionarFavorito(@PathVariable Long receitaId, Authentication authentication) {
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
        @ApiResponse(responseCode = "200", description = "Receita desfavoritada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado ou não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @DeleteMapping("/{receitaId}")
    public ResponseEntity<?> removerFavorito(@PathVariable Long receitaId, Authentication authentication) {
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
        @ApiResponse(responseCode = "200", description = "Lista de favoritos retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado ou não encontrado")
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