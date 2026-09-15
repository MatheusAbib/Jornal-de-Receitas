package com.receitas.site_receitas.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificacao")
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

    @Column(name = "data_hora", nullable = false, columnDefinition = "DATETIME")
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public TipoNotificacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoNotificacao tipo) {
        this.tipo = tipo;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public boolean isLida() {
        return lida;
    }

    public void setLida(boolean lida) {
        this.lida = lida;
    }
}