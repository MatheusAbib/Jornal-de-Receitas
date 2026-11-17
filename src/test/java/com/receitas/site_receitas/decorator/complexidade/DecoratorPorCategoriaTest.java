package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DecoratorPorCategoriaTest {

    @Test
    @DisplayName("Deve retornar 0 pontos para receita SALGADO")
    void deveRetornarZeroPontosParaSalgado() {
        Receita receita = new Receita();
        receita.setCategoria(Receita.Categoria.SALGADO);

        CalculadoraDeComplexidade calculadora = new DecoratorPorCategoria(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 1 ponto para receita DOCE")
    void deveRetornarUmPontoParaDoce() {
        Receita receita = new Receita();
        receita.setCategoria(Receita.Categoria.DOCE);

        CalculadoraDeComplexidade calculadora = new DecoratorPorCategoria(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(1);
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com categoria nula")
    void deveRetornarZeroPontosComCategoriaNula() {
        Receita receita = new Receita();
        receita.setCategoria(null);

        CalculadoraDeComplexidade calculadora = new DecoratorPorCategoria(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }
}