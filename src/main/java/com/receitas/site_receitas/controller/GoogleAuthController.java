package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.AuthService;
import com.receitas.site_receitas.service.GoogleAuthService;
import com.receitas.site_receitas.service.GoogleTokenService;
import com.receitas.site_receitas.service.GoogleTokenService.ContaGoogle;
import com.receitas.site_receitas.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.WebUtils;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class GoogleAuthController {

    private static final String NONCE_SESSION_KEY =
            GoogleAuthController.class.getName() + ".nonce";
    private static final Duration NONCE_VALIDITY = Duration.ofMinutes(5);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final GoogleTokenService googleTokenService;
    private final GoogleAuthService googleAuthService;
    private final AuthService authService;
    private final UsuarioService usuarioService;

    public GoogleAuthController(
            GoogleTokenService googleTokenService,
            GoogleAuthService googleAuthService,
            AuthService authService,
            UsuarioService usuarioService
    ) {
        this.googleTokenService = googleTokenService;
        this.googleAuthService = googleAuthService;
        this.authService = authService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login/google/nonce")
    public ResponseEntity<?> gerarNonce(HttpSession session) {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        String valor = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        synchronized (WebUtils.getSessionMutex(session)) {
            session.setAttribute(
                    NONCE_SESSION_KEY,
                    new NonceGoogle(valor, Instant.now().plus(NONCE_VALIDITY))
            );
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of("nonce", valor));
    }

    @PostMapping(value = "/login/google", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(
            @RequestBody GoogleLoginRequest dados,
            HttpServletRequest request
    ) {
        HttpSession session = request.getSession(false);
        Usuario usuario;

        try {
            ContaGoogle conta = validarCredencial(dados.credential(), session);
            usuario = googleAuthService.autenticarOuCadastrar(conta);
        } catch (JwtException e) {
            return erro(HttpStatus.UNAUTHORIZED, "Credencial do Google inválida ou expirada.");
        } catch (ResponseStatusException e) {
            return erro(e);
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.CONFLICT, "Não foi possível concluir o cadastro. Tente novamente.");
        }

        request.changeSessionId();
        authService.registrarSessao(usuario, session, request);

        String redirectUrl = "ADMIN".equals(usuario.getRole()) ? "/admin/dashboard" : "/";

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of(
                        "success", true,
                        "redirectUrl", redirectUrl,
                        "role", usuario.getRole(),
                        "usuario", usuarioService.criarMapaUsuario(usuario)
                ));
    }

    @PostMapping(value = "/perfil/google/vincular", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> vincular(
            @RequestBody GoogleVinculoRequest dados,
            Authentication authentication,
            HttpServletRequest request
    ) {
        if (authentication == null) {
            return erro(HttpStatus.UNAUTHORIZED, "Entre na sua conta para vincular o Google.");
        }

        try {
            ContaGoogle conta = validarCredencial(dados.credential(), request.getSession(false));
            googleAuthService.vincular(authentication.getName(), dados.senhaAtual(), conta);
        } catch (JwtException e) {
            return erro(HttpStatus.UNAUTHORIZED, "Credencial do Google inválida ou expirada.");
        } catch (ResponseStatusException e) {
            return erro(e);
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.CONFLICT, "Não foi possível concluir o vínculo. Tente novamente.");
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of(
                        "success", true,
                        "message", "Conta Google vinculada com sucesso."
                ));
    }

    private ContaGoogle validarCredencial(String credencial, HttpSession session) {
        NonceGoogle nonce = consumirNonce(session);

        if (nonce == null || !nonce.expiraEm().isAfter(Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Inicie novamente a confirmação com o Google."
            );
        }

        return googleTokenService.validar(credencial, nonce.valor());
    }

    private NonceGoogle consumirNonce(HttpSession session) {
        if (session == null) {
            return null;
        }

        synchronized (WebUtils.getSessionMutex(session)) {
            NonceGoogle nonce = (NonceGoogle) session.getAttribute(NONCE_SESSION_KEY);
            session.removeAttribute(NONCE_SESSION_KEY);
            return nonce;
        }
    }

    private ResponseEntity<?> erro(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode())
                .cacheControl(CacheControl.noStore())
                .body(Map.of("success", false, "message", exception.getReason()));
    }

    private ResponseEntity<?> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status)
                .cacheControl(CacheControl.noStore())
                .body(Map.of("success", false, "message", mensagem));
    }

    public record GoogleLoginRequest(String credential) {
    }

    public record GoogleVinculoRequest(String credential, String senhaAtual) {
    }

    private record NonceGoogle(String valor, Instant expiraEm) {
    }
}