package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private UsuarioService usuarioService;

    private Usuario obterUsuario(Authentication authentication) {

        if (authentication == null ||
            !authentication.isAuthenticated() ||
            "anonymousUser".equals(authentication.getName())) {
            return null;
        }

        return usuarioService
                .findByEmail(authentication.getName())
                .orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> listarNotificacoes(
            Authentication authentication) {

        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Usuário não autenticado"
                    ));
        }

        List<Notificacao> notificacoes =
                notificacaoService.buscarNotificacoes(usuario);

        return ResponseEntity.ok(
                Map.of("notificacoes", notificacoes)
        );
    }

    @GetMapping("/nao-lidas")
    public ResponseEntity<?> listarNaoLidas(
            Authentication authentication) {

        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Usuário não autenticado"
                    ));
        }

        List<Notificacao> notificacoes =
                notificacaoService.buscarNaoLidas(usuario);

        return ResponseEntity.ok(
                Map.of("notificacoes", notificacoes)
        );
    }

    @GetMapping("/contador")
    public ResponseEntity<?> contarNaoLidas(
            Authentication authentication) {

        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Usuário não autenticado"
                    ));
        }

        long quantidade =
                notificacaoService.contarNaoLidas(usuario);

        return ResponseEntity.ok(
                Map.of("quantidade", quantidade)
        );
    }

    @PatchMapping("/{id}/ler")
    public ResponseEntity<?> marcarComoLida(
            @PathVariable Long id,
            Authentication authentication) {

        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Usuário não autenticado"
                    ));
        }

        notificacaoService.marcarComoLida(id);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Notificação marcada como lida"
                )
        );
    }
    @DeleteMapping("/excluir-todas")
public ResponseEntity<?> excluirTodas(
        Authentication authentication) {

    Usuario usuario = obterUsuario(authentication);

    if (usuario == null) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of(
                        "message",
                        "Usuário não autenticado"
                ));
    }

    notificacaoService.excluirTodas(usuario);

    return ResponseEntity.ok(
            Map.of(
                    "success", true,
                    "message", "Todas as notificações foram excluídas"
            )
    );
}

    @PatchMapping("/ler-todas")
    public ResponseEntity<?> marcarTodasComoLidas(
            Authentication authentication) {

        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Usuário não autenticado"
                    ));
        }

        notificacaoService.marcarTodasComoLidas(usuario);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Todas as notificações foram marcadas como lidas"
                )
        );
    }
}