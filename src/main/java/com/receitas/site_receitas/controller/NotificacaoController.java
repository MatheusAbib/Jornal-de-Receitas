package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.NotificacaoService;
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
@RequestMapping("/api/notificacoes")
@Tag(name = "Notificações", description = "Endpoints para gerenciar notificações do usuário")
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

    @Operation(
        summary = "Listar todas as notificações",
        description = "Retorna todas as notificações do usuário autenticado, ordenadas por data (mais recentes primeiro)."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de notificações retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @GetMapping
    public ResponseEntity<?> listarNotificacoes(Authentication authentication) {
        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuário não autenticado"));
        }

        List<Notificacao> notificacoes =
                notificacaoService.buscarNotificacoes(usuario);

        return ResponseEntity.ok(Map.of("notificacoes", notificacoes));
    }

    @Operation(
        summary = "Listar notificações não lidas",
        description = "Retorna apenas as notificações que ainda não foram lidas pelo usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de notificações não lidas"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @GetMapping("/nao-lidas")
    public ResponseEntity<?> listarNaoLidas(Authentication authentication) {
        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuário não autenticado"));
        }

        List<Notificacao> notificacoes =
                notificacaoService.buscarNaoLidas(usuario);

        return ResponseEntity.ok(Map.of("notificacoes", notificacoes));
    }

    @Operation(
        summary = "Contar notificações não lidas",
        description = "Retorna a quantidade de notificações não lidas do usuário autenticado. Útil para exibir badge no ícone de notificações."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Contador retornado com sucesso"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @GetMapping("/contador")
    public ResponseEntity<?> contarNaoLidas(Authentication authentication) {
        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuário não autenticado"));
        }

        long quantidade =
                notificacaoService.contarNaoLidas(usuario);

        return ResponseEntity.ok(Map.of("quantidade", quantidade));
    }

    @Operation(
        summary = "Marcar notificação como lida",
        description = "Marca uma notificação específica como lida pelo usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Notificação marcada como lida"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @PatchMapping("/{id}/ler")
    public ResponseEntity<?> marcarComoLida(
            @PathVariable Long id,
            Authentication authentication) {
        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuário não autenticado"));
        }

        notificacaoService.marcarComoLida(id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Notificação marcada como lida"
        ));
    }

    @Operation(
        summary = "Excluir todas as notificações",
        description = "Remove todas as notificações do usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Todas as notificações excluídas"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @DeleteMapping("/excluir-todas")
    public ResponseEntity<?> excluirTodas(Authentication authentication) {
        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuário não autenticado"));
        }

        notificacaoService.excluirTodas(usuario);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Todas as notificações foram excluídas"
        ));
    }

    @Operation(
        summary = "Marcar todas como lidas",
        description = "Marca todas as notificações não lidas do usuário como lidas."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Todas as notificações marcadas como lidas"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado")
    })
    @PatchMapping("/ler-todas")
    public ResponseEntity<?> marcarTodasComoLidas(Authentication authentication) {
        Usuario usuario = obterUsuario(authentication);

        if (usuario == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Usuário não autenticado"));
        }

        notificacaoService.marcarTodasComoLidas(usuario);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Todas as notificações foram marcadas como lidas"
        ));
    }
}