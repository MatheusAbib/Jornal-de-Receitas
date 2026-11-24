package com.receitas.site_receitas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Table(name = "redefinicao_senha")
@Getter
public class RedefinicaoSenha {

    @Id
    @Column(name = "usuario_id")
    private Integer usuarioId;

    @Column(name = "token_hash", nullable = false, columnDefinition = "CHAR(64)")
    private String tokenHash;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "expira_em", nullable = false)
    private LocalDateTime expiraEm;

    @Column(name = "usado_em")
    private LocalDateTime usadoEm;

    protected RedefinicaoSenha() {
    }

    public RedefinicaoSenha(
            Integer usuarioId,
            String tokenHash,
            LocalDateTime criadoEm,
            LocalDateTime expiraEm
    ) {
        this.usuarioId = usuarioId;
        renovar(tokenHash, criadoEm, expiraEm);
    }

    public void renovar(
            String tokenHash,
            LocalDateTime criadoEm,
            LocalDateTime expiraEm
    ) {
        this.tokenHash = tokenHash;
        this.criadoEm = criadoEm;
        this.expiraEm = expiraEm;
        this.usadoEm = null;
    }

    public boolean estaDisponivel(LocalDateTime agora) {
        return usadoEm == null && expiraEm.isAfter(agora);
    }

    public void marcarComoUsado(LocalDateTime agora) {
        this.usadoEm = agora;
    }
}