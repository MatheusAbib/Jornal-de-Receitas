package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Notificacao.TipoNotificacao;
import com.receitas.site_receitas.model.Usuario;

import java.time.LocalDateTime;

public class NotificacaoBuilder {

    private Notificacao notificacao = new Notificacao();

    public NotificacaoBuilder paraUsuario(Usuario usuario) {
        notificacao.setUsuario(usuario);
        return this;
    }

    public NotificacaoBuilder comMensagem(String mensagem) {
        notificacao.setMensagem(mensagem);
        return this;
    }

    public NotificacaoBuilder comTipo(TipoNotificacao tipo) {
        notificacao.setTipo(tipo);
        return this;
    }

    public NotificacaoBuilder comDataHora(LocalDateTime dataHora) {
        notificacao.setDataHora(dataHora);
        return this;
    }

    public NotificacaoBuilder lida(boolean lida) {
        notificacao.setLida(lida);
        return this;
    }

    public NotificacaoBuilder novaReceita() {
        notificacao.setTipo(TipoNotificacao.NOVA_RECEITA);
        return this;
    }

    public NotificacaoBuilder receitaAprovada() {
        notificacao.setTipo(TipoNotificacao.RECEITA_APROVADA);
        return this;
    }

    public NotificacaoBuilder receitaRejeitada() {
        notificacao.setTipo(TipoNotificacao.RECEITA_REJEITADA);
        return this;
    }

    public NotificacaoBuilder receitaExcluida() {
        notificacao.setTipo(TipoNotificacao.RECEITA_EXCLUIDA);
        return this;
    }

    public NotificacaoBuilder favoritou() {
        notificacao.setTipo(TipoNotificacao.FAVORITOU);
        return this;
    }

    public NotificacaoBuilder desfavoritou() {
        notificacao.setTipo(TipoNotificacao.DESFAVORITOU);
        return this;
    }

    public Notificacao build() {
        if (notificacao.getDataHora() == null) {
            notificacao.setDataHora(LocalDateTime.now());
        }
        notificacao.setLida(false);
        return notificacao;
    }
}