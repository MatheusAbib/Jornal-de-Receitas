package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.service.RedefinicaoSenhaService;
import com.receitas.site_receitas.service.RedefinicaoSenhaService.LinkInvalidoException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.TaskExecutor;
import org.springframework.core.task.TaskRejectedException;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class RedefinicaoSenhaController {

    private static final Logger LOGGER =
            LoggerFactory.getLogger(RedefinicaoSenhaController.class);

    private final RedefinicaoSenhaService redefinicaoSenhaService;
    private final TaskExecutor executor;

    public RedefinicaoSenhaController(
            RedefinicaoSenhaService redefinicaoSenhaService,
            @Qualifier("executorRedefinicaoSenha") TaskExecutor executor
    ) {
        this.redefinicaoSenhaService = redefinicaoSenhaService;
        this.executor = executor;
    }

    @PostMapping(value = "/esqueci-senha", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> solicitar(
            @Valid @RequestBody SolicitarRedefinicaoRequest dados
    ) {
        try {
            executor.execute(() -> processarSolicitacao(dados.email()));
        } catch (TaskRejectedException e) {
            return responder(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    false,
                    "O serviço está ocupado. Tente novamente em instantes."
            );
        }

        return responder(
                HttpStatus.ACCEPTED,
                true,
                "Se houver uma conta apta à recuperação com esse e-mail, você receberá um link."
        );
    }

    @PostMapping(value = "/redefinir-senha", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> redefinir(
            @RequestBody RedefinirSenhaRequest dados
    ) {
        try {
            redefinicaoSenhaService.redefinir(
                    dados.token(),
                    dados.novaSenha(),
                    dados.confirmarSenha()
            );

            return responder(HttpStatus.OK, true, "Senha redefinida com sucesso.");
        } catch (LinkInvalidoException | IllegalArgumentException e) {
            return responder(HttpStatus.BAD_REQUEST, false, e.getMessage());
        }
    }

    private void processarSolicitacao(String email) {
        try {
            redefinicaoSenhaService.solicitar(email);
        } catch (RuntimeException e) {
            LOGGER.warn("Falha ao processar recuperação de senha: {}",
                    e.getClass().getSimpleName());
        }
    }

    private ResponseEntity<Map<String, Object>> responder(
            HttpStatus status,
            boolean sucesso,
            String mensagem
    ) {
        return ResponseEntity.status(status)
                .cacheControl(CacheControl.noStore())
                .body(Map.of("success", sucesso, "message", mensagem));
    }

    public record SolicitarRedefinicaoRequest(
            @NotBlank @Email @Size(max = 255) String email
    ) {
    }

    public record RedefinirSenhaRequest(
            String token,
            String novaSenha,
            String confirmarSenha
    ) {
    }
}