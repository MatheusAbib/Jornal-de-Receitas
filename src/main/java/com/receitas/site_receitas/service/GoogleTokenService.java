package com.receitas.site_receitas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoogleTokenService {

    private static final String GOOGLE_JWK_SET_URI = "https://www.googleapis.com/oauth2/v3/certs";
    private static final List<String> GOOGLE_EMISSORES = List.of(
            "accounts.google.com",
            "https://accounts.google.com"
    );

    private final String clientId;
    private final NimbusJwtDecoder decoder;

    public GoogleTokenService(@Value("${app.auth.google.client-id:}") String clientId) {
        this.clientId = clientId;
        this.decoder = NimbusJwtDecoder.withJwkSetUri(GOOGLE_JWK_SET_URI)
                .jwsAlgorithm(SignatureAlgorithm.RS256)
                .build();
        this.decoder.setJwtValidator(JwtValidators.createDefault());
    }

    public ContaGoogle validar(String credencial, String nonceEsperado) {
        if (clientId.isBlank()) {
            throw new IllegalStateException("Client ID do Google não configurado");
        }

        if (credencial == null || credencial.isBlank()
                || nonceEsperado == null || nonceEsperado.isBlank()) {
            throw new JwtException("Credencial do Google inválida");
        }

        Jwt token = decoder.decode(credencial);
        String emissor = token.getClaimAsString("iss");
        List<String> destinatarios = token.getAudience();

        if (emissor == null || !GOOGLE_EMISSORES.contains(emissor)
                || destinatarios == null || !destinatarios.contains(clientId)
                || token.getExpiresAt() == null
                || !nonceEsperado.equals(token.getClaimAsString("nonce"))) {
            throw new JwtException("Credencial do Google inválida");
        }

        String identificador = token.getSubject();
        String email = token.getClaimAsString("email");

        if (identificador == null || identificador.isBlank()
                || email == null || email.isBlank()
                || !Boolean.TRUE.equals(token.getClaimAsBoolean("email_verified"))) {
            throw new JwtException("Conta do Google sem identificação ou e-mail verificado");
        }

        String nome = token.getClaimAsString("name");
        return new ContaGoogle(identificador, email, nome);
    }

    public record ContaGoogle(String sub, String email, String nome) {
    }
}