package com.receitas.site_receitas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacao")
@Getter
@Setter
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoNotificacao tipo;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private boolean lida = false;

    public enum TipoNotificacao {
        NOVA_RECEITA,
        FAVORITOU,
        DESFAVORITOU,
        RECEITA_APROVADA,
        RECEITA_REJEITADA,
        RECEITA_EXCLUIDA
    }

    public Notificacao() {
    }

    public Notificacao(Usuario usuario, String mensagem, TipoNotificacao tipo) {
        this.usuario = usuario;
        this.mensagem = mensagem;
        this.tipo = tipo;
        this.dataHora = LocalDateTime.now();
        this.lida = false;
    }

    public void marcarComoLida() {
        this.lida = true;
    }

    public void marcarComoNaoLida() {
        this.lida = false;
    }
}
