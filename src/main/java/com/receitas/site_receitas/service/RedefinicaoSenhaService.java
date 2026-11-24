package com.receitas.site_receitas.service;

import com.receitas.site_receitas.dao.redefinicaosenha.IRedefinicaoSenhaDAO;
import com.receitas.site_receitas.dao.usuario.IUsuarioDAO;
import com.receitas.site_receitas.model.RedefinicaoSenha;
import com.receitas.site_receitas.model.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.regex.Pattern;

@Service
public class RedefinicaoSenhaService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Pattern FORMATO_TOKEN = Pattern.compile("[A-Za-z0-9_-]{43}");
    private static final int VALIDADE_MINUTOS = 30;
    private static final int INTERVALO_ENTRE_ENVIOS_SEGUNDOS = 60;

    private final IUsuarioDAO usuarioDAO;
    private final IRedefinicaoSenhaDAO redefinicaoSenhaDAO;
    private final BrevoEmailService brevoEmailService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EntityManager entityManager;
    private final TransactionTemplate transacao;
    private final String urlFrontend;

    public RedefinicaoSenhaService(
            IUsuarioDAO usuarioDAO,
            IRedefinicaoSenhaDAO redefinicaoSenhaDAO,
            BrevoEmailService brevoEmailService,
            BCryptPasswordEncoder passwordEncoder,
            EntityManager entityManager,
            PlatformTransactionManager transactionManager,
            @Value("${app.auth.reset-password.frontend-url}") String urlFrontend
    ) {
        this.usuarioDAO = usuarioDAO;
        this.redefinicaoSenhaDAO = redefinicaoSenhaDAO;
        this.brevoEmailService = brevoEmailService;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
        this.transacao = new TransactionTemplate(transactionManager);
        this.urlFrontend = urlFrontend;
    }

    public void solicitar(String email) {
        if (email == null || email.isBlank()) {
            return;
        }

        String emailSolicitado = email.trim();
        Envio envio = transacao.execute(status -> prepararEnvio(emailSolicitado));

        if (envio != null) {
            brevoEmailService.enviarRedefinicaoSenha(envio.destinatario(), envio.link());
        }
    }

    public void redefinir(String token, String novaSenha, String confirmarSenha) {
        validarSenha(novaSenha, confirmarSenha);

        if (token == null || !FORMATO_TOKEN.matcher(token).matches()) {
            throw new LinkInvalidoException();
        }

        String tokenHash = gerarHash(token);

        transacao.executeWithoutResult(status -> {
            Integer usuarioId = redefinicaoSenhaDAO.buscarUsuarioIdPorTokenHash(tokenHash)
                    .orElseThrow(LinkInvalidoException::new);

            Usuario usuario = entityManager.find(Usuario.class, usuarioId, LockModeType.PESSIMISTIC_WRITE);
            if (!podeRedefinirSenha(usuario)) {
                throw new LinkInvalidoException();
            }

            RedefinicaoSenha pedido = redefinicaoSenhaDAO.buscarParaAtualizacao(usuarioId)
                    .orElseThrow(LinkInvalidoException::new);

            LocalDateTime agora = agoraUtc();
            if (!tokenHash.equals(pedido.getTokenHash()) || !pedido.estaDisponivel(agora)) {
                throw new LinkInvalidoException();
            }

            usuario.alterarSenha(passwordEncoder.encode(novaSenha));
            usuarioDAO.salvar(usuario);
            pedido.marcarComoUsado(agora);
        });
    }

    private Envio prepararEnvio(String email) {
        Usuario usuario = usuarioDAO.buscarPorEmail(email).orElse(null);
        if (usuario == null) {
            return null;
        }

        entityManager.refresh(usuario, LockModeType.PESSIMISTIC_WRITE);
        if (!podeRedefinirSenha(usuario) || !usuario.getEmail().equalsIgnoreCase(email)) {
            return null;
        }

        LocalDateTime agora = agoraUtc();
        RedefinicaoSenha pedido = redefinicaoSenhaDAO.buscarParaAtualizacao(usuario.getId())
                .orElse(null);

        if (pedido != null
                && pedido.getCriadoEm().plusSeconds(INTERVALO_ENTRE_ENVIOS_SEGUNDOS).isAfter(agora)) {
            return null;
        }

        String token = gerarToken();
        String tokenHash = gerarHash(token);
        LocalDateTime expiraEm = agora.plusMinutes(VALIDADE_MINUTOS);

        if (pedido == null) {
            redefinicaoSenhaDAO.salvar(
                    new RedefinicaoSenha(usuario.getId(), tokenHash, agora, expiraEm)
            );
        } else {
            pedido.renovar(tokenHash, agora, expiraEm);
        }

String link = UriComponentsBuilder.fromUriString(urlFrontend)
        .replacePath("/")
        .fragment("redefinir-senha=" + token)
        .build()
        .toUriString();

        return new Envio(usuario.getEmail(), link);
    }

    private boolean podeRedefinirSenha(Usuario usuario) {
        return usuario != null && usuario.isAtivo() && usuario.getSenha() != null;
    }

    private void validarSenha(String senha, String confirmacao) {
        if (senha == null || senha.trim().length() < 6) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 6 caracteres.");
        }

        if (!senha.equals(confirmacao)) {
            throw new IllegalArgumentException("As senhas não coincidem.");
        }

        if (senha.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new IllegalArgumentException("A senha deve ter no máximo 72 bytes.");
        }
    }

    private String gerarToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String gerarHash(String valor) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(valor.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 indisponível.", e);
        }
    }

    private LocalDateTime agoraUtc() {
        return LocalDateTime.now(ZoneOffset.UTC).truncatedTo(ChronoUnit.SECONDS);
    }

    private record Envio(String destinatario, String link) {
    }

    public static class LinkInvalidoException extends RuntimeException {

        public LinkInvalidoException() {
            super("Link inválido ou expirado. Solicite uma nova redefinição de senha.");
        }
    }
}