package com.receitas.site_receitas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class BrevoEmailService {

    private final RestClient cliente;
    private final String chaveApi;
    private final String emailRemetente;

    public BrevoEmailService(
            RestClient.Builder builder,
            @Value("${app.email.brevo.api-key:}") String chaveApi,
            @Value("${app.email.brevo.sender-email:}") String emailRemetente
    ) {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(10));

        this.cliente = builder
                .baseUrl("https://api.brevo.com")
                .requestFactory(requestFactory)
                .build();
        this.chaveApi = chaveApi;
        this.emailRemetente = emailRemetente;
    }

    public void enviarRedefinicaoSenha(String destinatario, String link) {
        if (chaveApi.isBlank() || emailRemetente.isBlank()) {
            throw new IllegalStateException("Envio de e-mail pela Brevo não configurado.");
        }

        String mensagem = """
                Olá!

                Recebemos uma solicitação para redefinir sua senha no Jornal de Receitas.
                Para escolher uma nova senha, abra este link:

                %s

                Se você não solicitou a redefinição, pode ignorar este e-mail.
                """.formatted(link);

        cliente.post()
                .uri("/v3/smtp/email")
                .header("api-key", chaveApi)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "sender", Map.of(
                                "name", "Jornal de Receitas",
                                "email", emailRemetente
                        ),
                        "to", List.of(Map.of("email", destinatario)),
                        "subject", "Redefina sua senha no Jornal de Receitas",
                        "textContent", mensagem
                ))
                .retrieve()
                .toBodilessEntity();
    }
}