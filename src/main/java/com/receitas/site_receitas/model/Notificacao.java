package com.receitas.site_receitas.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificacao")
@Getter
@Setter
@Schema(description = "Representa uma notificação enviada a um usuário do sistema")
public class Notificacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único da notificação", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @Schema(description = "Usuário destinatário da notificação")
    private Usuario usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    @Schema(description = "Mensagem descritiva da notificação", example = "Sua receita \"Bolo de Chocolate\" foi aprovada pelo administrador.")
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Schema(
        description = "Tipo da notificação",
        example = "RECEITA_APROVADA",
        allowableValues = {"NOVA_RECEITA", "FAVORITOU", "DESFAVORITOU", "RECEITA_APROVADA", "RECEITA_REJEITADA", "RECEITA_EXCLUIDA"}
    )
    private TipoNotificacao tipo;

    @Column(name = "data_hora", nullable = false)
    @Schema(description = "Data e hora em que a notificação foi gerada", example = "2025-09-23T14:30:00")
    private LocalDateTime dataHora;

    @Column(nullable = false)
    @Schema(description = "Indica se a notificação já foi lida pelo usuário", example = "false")
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
