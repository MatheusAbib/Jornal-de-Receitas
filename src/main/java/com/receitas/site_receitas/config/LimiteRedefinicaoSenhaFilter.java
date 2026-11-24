package com.receitas.site_receitas.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

@Component
@Order(Ordered.LOWEST_PRECEDENCE)
public class LimiteRedefinicaoSenhaFilter extends OncePerRequestFilter {

    private static final int LIMITE = 30;
    private static final long JANELA_NANOS = Duration.ofMinutes(1).toNanos();

    private final Deque<Long> solicitacoes = new ArrayDeque<>();
    private final ObjectMapper objectMapper;

    public LimiteRedefinicaoSenhaFilter(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !"POST".equals(request.getMethod())
                || !"/api/auth/esqueci-senha".equals(request.getServletPath());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (aceitarSolicitacao()) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(429);
        response.setHeader("Retry-After", "60");
        response.setHeader("Cache-Control", "no-store");
        response.setContentType("application/json");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        objectMapper.writeValue(response.getWriter(), Map.of(
                "success", false,
                "message", "Muitas solicitações de recuperação. Tente novamente em um minuto."
        ));
    }

    private synchronized boolean aceitarSolicitacao() {
        long agora = System.nanoTime();

        while (!solicitacoes.isEmpty() && agora - solicitacoes.peekFirst() >= JANELA_NANOS) {
            solicitacoes.removeFirst();
        }

        if (solicitacoes.size() >= LIMITE) {
            return false;
        }

        solicitacoes.addLast(agora);
        return true;
    }
}