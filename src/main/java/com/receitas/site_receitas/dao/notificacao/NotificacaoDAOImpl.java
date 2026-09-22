package com.receitas.site_receitas.dao.notificacao;

import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class NotificacaoDAOImpl implements INotificacaoDAO {

    @Autowired
    private NotificacaoJpaRepository repository;

    @Override
    public Notificacao salvar(Notificacao notificacao) {
        return repository.save(notificacao);
    }

    @Override
    public Optional<Notificacao> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<Notificacao> listarPorUsuarioOrdenado(Usuario usuario) {
        return repository.findByUsuarioOrderByDataHoraDesc(usuario);
    }

    @Override
    public List<Notificacao> listarNaoLidasPorUsuario(Usuario usuario) {
        return repository.findByUsuarioAndLidaFalseOrderByDataHoraDesc(usuario);
    }

    @Override
    public long contarNaoLidasPorUsuario(Usuario usuario) {
        return repository.countByUsuarioAndLidaFalse(usuario);
    }

    @Override
    public void deletarTodas(List<Notificacao> notificacoes) {
        repository.deleteAll(notificacoes);
    }

    @Override
    public void salvarTodas(List<Notificacao> notificacoes) {
        repository.saveAll(notificacoes);
    }

    @Override
    public long contarPorUsuario(Usuario usuario) {
        return repository.countByUsuario(usuario);
    }
}