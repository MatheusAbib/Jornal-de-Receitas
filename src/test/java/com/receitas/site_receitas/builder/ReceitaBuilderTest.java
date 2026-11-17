package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.Categoria;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ReceitaBuilderTest {

    @Test
    @DisplayName("Deve aplicar status PENDENTE por padrao")
    void deveAplicarStatusPendentePorPadrao() {
        Receita receita = new ReceitaBuilder().build();

        assertThat(receita.getStatus()).isEqualTo(StatusReceita.PENDENTE);
    }

    @Test
    @DisplayName("Deve aplicar categoria SALGADO por padrao")
    void deveAplicarCategoriaSalgadoPorPadrao() {
        Receita receita = new ReceitaBuilder().build();

        assertThat(receita.getCategoria()).isEqualTo(Categoria.SALGADO);
    }

    @Test
    @DisplayName("Deve aplicar porcoes 1 por padrao")
    void deveAplicarPorcoesUmPorPadrao() {
        Receita receita = new ReceitaBuilder().build();

        assertThat(receita.getPorcoes()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve montar receita completa com todos os campos")
    void deveMontarReceitaCompleta() {
        Usuario autor = new Usuario();
        autor.setId(1);

        Receita receita = new ReceitaBuilder()
                .comTitulo("Bolo")
                .comTempoPreparo("1h")
                .comIngredientes("Farinha||Ovos")
                .comModoPreparo("Misture||Asse")
                .comImagem("bolo.jpg")
                .comPorcoes(8)
                .comChefe("Chef")
                .comUsuario(autor)
                .comoDoce()
                .aprovada()
                .build();

        assertThat(receita.getTitulo()).isEqualTo("Bolo");
        assertThat(receita.getTempoPreparo()).isEqualTo("1h");
        assertThat(receita.getIngredientes()).isEqualTo("Farinha||Ovos");
        assertThat(receita.getModoPreparo()).isEqualTo("Misture||Asse");
        assertThat(receita.getImagem()).isEqualTo("bolo.jpg");
        assertThat(receita.getPorcoes()).isEqualTo(8);
        assertThat(receita.getChefe()).isEqualTo("Chef");
        assertThat(receita.getUsuario()).isEqualTo(autor);
        assertThat(receita.getCategoria()).isEqualTo(Categoria.DOCE);
        assertThat(receita.getStatus()).isEqualTo(StatusReceita.APROVADA);
    }
}