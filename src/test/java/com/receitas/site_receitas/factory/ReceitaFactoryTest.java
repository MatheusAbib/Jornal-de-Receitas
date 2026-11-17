package com.receitas.site_receitas.factory;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.Categoria;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ReceitaFactoryTest {

    @Test
    @DisplayName("Deve criar receita pendente com autor")
    void deveCriarReceitaPendenteComAutor() {
        Usuario autor = new Usuario();
        autor.setNome("Joao");

        Receita receita = ReceitaFactory.criarPendente("Bolo", autor);

        assertThat(receita.getTitulo()).isEqualTo("Bolo");
        assertThat(receita.getStatus()).isEqualTo(StatusReceita.PENDENTE);
        assertThat(receita.getUsuario()).isEqualTo(autor);
        assertThat(receita.getChefe()).isEqualTo("Joao");
    }

    @Test
    @DisplayName("Deve criar receita salgada")
    void deveCriarReceitaSalgada() {
        Usuario autor = new Usuario();
        autor.setNome("Chef");

        Receita receita = ReceitaFactory.criarSalgada("Coxinha", "Frango||Massa", "Misture||Frite", autor);

        assertThat(receita.getCategoria()).isEqualTo(Categoria.SALGADO);
        assertThat(receita.getStatus()).isEqualTo(StatusReceita.PENDENTE);
    }

    @Test
    @DisplayName("Deve criar receita doce")
    void deveCriarReceitaDoce() {
        Usuario autor = new Usuario();
        autor.setNome("Chef");

        Receita receita = ReceitaFactory.criarDoce("Bolo", "Farinha||Ovos", "Misture||Asse", autor);

        assertThat(receita.getCategoria()).isEqualTo(Categoria.DOCE);
        assertThat(receita.getStatus()).isEqualTo(StatusReceita.PENDENTE);
    }

    @Test
    @DisplayName("Deve criar receita pendente sem autor")
    void deveCriarReceitaPendenteSemAutor() {
        Receita receita = ReceitaFactory.criarPendente("Bolo", null);

        assertThat(receita.getUsuario()).isNull();
        assertThat(receita.getChefe()).isNull();
        assertThat(receita.getStatus()).isEqualTo(StatusReceita.PENDENTE);
    }
}