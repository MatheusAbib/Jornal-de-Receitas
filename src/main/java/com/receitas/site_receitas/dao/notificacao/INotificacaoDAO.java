package com.receitas.site_receitas.dao.notificacao;

import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface INotificacaoDAO {

    Notificacao salvar(Notificacao notificacao);

    Optional<Notificacao> buscarPorId(Long id);

    List<Notificacao> listarPorUsuarioOrdenado(Usuario usuario);

    List<Notificacao> listarNaoLidasPorUsuario(Usuario usuario);

    long contarNaoLidasPorUsuario(Usuario usuario);

    void deletarTodas(List<Notificacao> notificacoes);

    void salvarTodas(List<Notificacao> notificacoes);
    
    long contarPorUsuario(Usuario usuario);
}