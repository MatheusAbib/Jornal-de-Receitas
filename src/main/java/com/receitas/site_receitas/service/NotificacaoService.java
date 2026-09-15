package com.receitas.site_receitas.service;

import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Notificacao.TipoNotificacao;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificacaoService {

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Transactional
    public void criarNotificacao(
            Usuario usuario,
            String mensagem,
            TipoNotificacao tipo
    ) {
        if (usuario == null) {
            return;
        }

        Notificacao notificacao = new Notificacao(
                usuario,
                mensagem,
                tipo
        );

        notificacaoRepository.save(notificacao);
    }

    @Transactional(readOnly = true)
    public List<Notificacao> buscarNotificacoes(Usuario usuario) {
        return notificacaoRepository
                .findByUsuarioOrderByDataHoraDesc(usuario);
    }

    @Transactional(readOnly = true)
    public List<Notificacao> buscarNaoLidas(Usuario usuario) {
        return notificacaoRepository
                .findByUsuarioAndLidaFalseOrderByDataHoraDesc(usuario);
    }

    @Transactional(readOnly = true)
    public long contarNaoLidas(Usuario usuario) {
        return notificacaoRepository
                .countByUsuarioAndLidaFalse(usuario);
    }

    @Transactional
    public void marcarComoLida(Long id) {
        notificacaoRepository.findById(id).ifPresent(notificacao -> {
            notificacao.setLida(true);
            notificacaoRepository.save(notificacao);
        });
    }

    @Transactional
public void excluirTodas(Usuario usuario) {
    List<Notificacao> notificacoes =
            notificacaoRepository.findByUsuarioOrderByDataHoraDesc(usuario);

    notificacaoRepository.deleteAll(notificacoes);
}

    @Transactional
    public void marcarTodasComoLidas(Usuario usuario) {
        List<Notificacao> notificacoes =
                notificacaoRepository.findByUsuarioAndLidaFalseOrderByDataHoraDesc(usuario);

        notificacoes.forEach(notificacao -> notificacao.setLida(true));

        notificacaoRepository.saveAll(notificacoes);
    }
}