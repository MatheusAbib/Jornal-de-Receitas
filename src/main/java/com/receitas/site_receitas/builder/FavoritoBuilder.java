package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;

public class FavoritoBuilder {

    private Usuario usuario;
    private Receita receita;

    public FavoritoBuilder doUsuario(Usuario usuario) {
        this.usuario = usuario;
        return this;
    }

    public FavoritoBuilder daReceita(Receita receita) {
        this.receita = receita;
        return this;
    }

    public Favorito build() {
        if (usuario == null) {
            throw new IllegalStateException("Usuário é obrigatório para criar um favorito");
        }
        if (receita == null) {
            throw new IllegalStateException("Receita é obrigatória para criar um favorito");
        }
        return new Favorito(usuario, receita);
    }
}