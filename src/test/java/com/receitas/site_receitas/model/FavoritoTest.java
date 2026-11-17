package com.receitas.site_receitas.model;

import com.receitas.site_receitas.builder.FavoritoBuilder;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class FavoritoTest {

    @Test
    @DisplayName("Deve montar favorito com usuario e receita via builder")
    void deveMontarFavoritoViaBuilder() {
        Usuario usuario = new Usuario();
        usuario.setId(1);
        Receita receita = new Receita();
        receita.setId(100L);

        Favorito favorito = new FavoritoBuilder()
                .doUsuario(usuario)
                .daReceita(receita)
                .build();

        assertThat(favorito.getUsuario()).isEqualTo(usuario);
        assertThat(favorito.getReceita()).isEqualTo(receita);
    }

    @Test
    @DisplayName("Deve retornar usuario e receita corretamente")
    void deveRetornarUsuarioEReceita() {
        Usuario usuario = new Usuario();
        Receita receita = new Receita();
        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setReceita(receita);

        assertThat(favorito.getUsuario()).isEqualTo(usuario);
        assertThat(favorito.getReceita()).isEqualTo(receita);
    }

    @Test
    @DisplayName("Deve iniciar favorito com id nulo")
    void deveIniciarComIdNulo() {
        Favorito favorito = new Favorito();

        assertThat(favorito.getId()).isNull();
    }
}
