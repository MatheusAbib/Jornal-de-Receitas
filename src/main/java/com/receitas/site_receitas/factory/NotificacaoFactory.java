package com.receitas.site_receitas.factory;

import com.receitas.site_receitas.builder.NotificacaoBuilder;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Usuario;

public class NotificacaoFactory {

    private NotificacaoFactory() {
    }

    public static Notificacao novaReceitaParaAdmin(Usuario admin, String tituloReceita) {
        return new NotificacaoBuilder()
                .paraUsuario(admin)
                .comMensagem("Nova receita enviada para aprovação: \"" + tituloReceita + "\".")
                .novaReceita()
                .build();
    }

    public static Notificacao receitaEnviadaParaAutor(Usuario autor, String tituloReceita) {
        return new NotificacaoBuilder()
                .paraUsuario(autor)
                .comMensagem("Sua receita \"" + tituloReceita + "\" foi enviada para aprovação.")
                .novaReceita()
                .build();
    }

    public static Notificacao receitaAprovada(Usuario autor, String tituloReceita) {
        return new NotificacaoBuilder()
                .paraUsuario(autor)
                .comMensagem("Sua receita \"" + tituloReceita + "\" foi aprovada pelo administrador.")
                .receitaAprovada()
                .build();
    }

    public static Notificacao receitaRejeitada(Usuario autor, String tituloReceita, String motivo) {
        return new NotificacaoBuilder()
                .paraUsuario(autor)
                .comMensagem("Sua receita \"" + tituloReceita + "\" foi rejeitada. Motivo: " + motivo)
                .receitaRejeitada()
                .build();
    }

    public static Notificacao receitaExcluida(Usuario autor, String tituloReceita) {
        return new NotificacaoBuilder()
                .paraUsuario(autor)
                .comMensagem("Sua receita \"" + tituloReceita + "\" foi excluída.")
                .receitaExcluida()
                .build();
    }

    public static Notificacao novaReceitaPublicada(Usuario usuario, String tituloReceita) {
        return new NotificacaoBuilder()
                .paraUsuario(usuario)
                .comMensagem("Nova receita publicada: \"" + tituloReceita + "\".")
                .novaReceita()
                .build();
    }

    public static Notificacao favoritou(Usuario usuario, String tituloReceita) {
        return new NotificacaoBuilder()
                .paraUsuario(usuario)
                .comMensagem("Você adicionou \"" + tituloReceita + "\" aos favoritos.")
                .favoritou()
                .build();
    }

    public static Notificacao desfavoritou(Usuario usuario, String tituloReceita) {
        return new NotificacaoBuilder()
                .paraUsuario(usuario)
                .comMensagem("Você removeu \"" + tituloReceita + "\" dos favoritos.")
                .desfavoritou()
                .build();
    }
}
