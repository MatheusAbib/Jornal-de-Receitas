package com.receitas.site_receitas.dao.favorito;

import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface IFavoritoDAO {

    Favorito salvar(Favorito favorito);

    List<Favorito> listarPorUsuario(Usuario usuario);

    Optional<Favorito> buscarPorUsuarioEReceita(Usuario usuario, Receita receita);

    boolean existePorUsuarioEReceita(Usuario usuario, Receita receita);

    void deletarPorUsuarioEReceita(Usuario usuario, Receita receita);

    void deletarPorReceita(Receita receita);

    long contarPorReceita(Receita receita);

    long contarCurtidasPorUsuario(Integer usuarioId);
}