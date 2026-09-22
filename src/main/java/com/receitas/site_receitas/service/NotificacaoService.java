package com.receitas.site_receitas.service;

import com.receitas.site_receitas.builder.NotificacaoBuilder;
import com.receitas.site_receitas.dao.notificacao.INotificacaoDAO;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Notificacao.TipoNotificacao;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificacaoService {

    @Autowired
    private INotificacaoDAO notificacaoDAO;

@Transactional
public void criarNotificacao(
        Usuario usuario,
        String mensagem,
        TipoNotificacao tipo
) {
    if (usuario == null) return;

    Notificacao notificacao = new NotificacaoBuilder()
            .paraUsuario(usuario)
            .comMensagem(mensagem)
            .comTipo(tipo)
            .build();

    notificacaoDAO.salvar(notificacao);
}

@Transactional
public void salvar(Notificacao notificacao) {
    if (notificacao == null) return;
    notificacaoDAO.salvar(notificacao);
}

    @Transactional(readOnly = true)
    public List<Notificacao> buscarNotificacoes(Usuario usuario) {
        return notificacaoDAO.listarPorUsuarioOrdenado(usuario);
    }

    @Transactional(readOnly = true)
    public List<Notificacao> buscarNaoLidas(Usuario usuario) {
        return notificacaoDAO.listarNaoLidasPorUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public long contarNaoLidas(Usuario usuario) {
        return notificacaoDAO.contarNaoLidasPorUsuario(usuario);
    }

    @Transactional
    public void marcarComoLida(Long id) {
        notificacaoDAO.buscarPorId(id).ifPresent(notificacao -> {
            notificacao.marcarComoLida();
            notificacaoDAO.salvar(notificacao);
        });
    }

    @Transactional
    public void excluirTodas(Usuario usuario) {
        List<Notificacao> notificacoes = notificacaoDAO.listarPorUsuarioOrdenado(usuario);
        notificacaoDAO.deletarTodas(notificacoes);
    }

    @Transactional
    public void marcarTodasComoLidas(Usuario usuario) {
        List<Notificacao> notificacoes = notificacaoDAO.listarNaoLidasPorUsuario(usuario);
        notificacoes.forEach(Notificacao::marcarComoLida);
        notificacaoDAO.salvarTodas(notificacoes);
    }

    @Transactional(readOnly = true)
    public long contarPorUsuario(Usuario usuario) {
        return notificacaoDAO.contarPorUsuario(usuario);
    }
}