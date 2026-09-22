package com.receitas.site_receitas.dao.estatisticas;

import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class EstatisticasDAOImpl implements IEstatisticasDAO {

    @Autowired
    private EstatisticasJpaRepository repository;

    @Override
    public Estatisticas salvar(Estatisticas estatisticas) {
        return repository.save(estatisticas);
    }

    @Override
    public Optional<Estatisticas> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Estatisticas> buscarPorUsuario(Usuario usuario) {
        return repository.findByUsuario(usuario);
    }

    @Override
    public Optional<Estatisticas> buscarPorUsuarioId(Integer usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    @Override
    public boolean existe(Long id) {
        return repository.existsById(id);
    }

    @Override
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
