package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/{receitaId}")
    public ResponseEntity<?> adicionarFavorito(@PathVariable Long receitaId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário não autenticado"));
        }

        String email = authentication.getName();
        Usuario usuario = usuarioService.findByEmail(email).orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Usuário não encontrado"));
        }

        favoritoService.adicionarFavorito(usuario, receitaId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Receita favoritada"));
    }

 @DeleteMapping("/{receitaId}")
public ResponseEntity<?> removerFavorito(@PathVariable Long receitaId, Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(401).body(Map.of("error", "Usuário não autenticado"));
    }

    String email = authentication.getName();
    Usuario usuario = usuarioService.findByEmail(email).orElse(null);

    if (usuario == null) {
        return ResponseEntity.status(404).body(Map.of("error", "Usuário não encontrado"));
    }

    try {
        favoritoService.removerFavorito(usuario, receitaId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Receita desfavoritada"));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(Map.of("error", "Erro ao remover favorito: " + e.getMessage()));
    }
}

    @GetMapping
    public ResponseEntity<?> getFavoritos(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuário não autenticado"));
        }

        String email = authentication.getName();
        Usuario usuario = usuarioService.findByEmail(email).orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Usuário não encontrado"));
        }

        List<Long> favoritos = favoritoService.getFavoritosIds(usuario);
        return ResponseEntity.ok(Map.of("favoritos", favoritos));
    }
}