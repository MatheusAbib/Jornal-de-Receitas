package com.receitas.site_receitas.dao.favorito;

import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class FavoritoDAOImpl implements IFavoritoDAO {

    @Autowired
    private FavoritoJpaRepository repository;

    @Override
    public Favorito salvar(Favorito favorito) {
        return repository.save(favorito);
    }

    @Override
    public List<Favorito> listarPorUsuario(Usuario usuario) {
        return repository.findByUsuario(usuario);
    }

    @Override
    public Optional<Favorito> buscarPorUsuarioEReceita(Usuario usuario, Receita receita) {
        return repository.findByUsuarioAndReceita(usuario, receita);
    }

    @Override
    public boolean existePorUsuarioEReceita(Usuario usuario, Receita receita) {
        return repository.existsByUsuarioAndReceita(usuario, receita);
    }

    @Override
    public void deletarPorUsuarioEReceita(Usuario usuario, Receita receita) {
        repository.deleteByUsuarioAndReceita(usuario, receita);
    }

    @Override
    public void deletarPorReceita(Receita receita) {
        repository.deleteByReceita(receita);
    }

    @Override
    public long contarPorReceita(Receita receita) {
        return repository.countByReceita(receita);
    }

    @Override
    public long contarCurtidasPorUsuario(Integer usuarioId) {
        return repository.countByReceita_Usuario_Id(usuarioId);
    }
}