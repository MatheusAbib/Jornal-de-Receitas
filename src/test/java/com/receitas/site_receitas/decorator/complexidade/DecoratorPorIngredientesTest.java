package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DecoratorPorIngredientesTest {

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com 8 ingredientes ou menos")
    void deveRetornarZeroPontosComPoucosIngredientes() {
        Receita receita = new Receita();
        receita.setIngredientes("A||B||C||D||E||F||G||H");
        CalculadoraDeComplexidade calculadora = new DecoratorPorIngredientes(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isZero();
    }

    @Test
    @DisplayName("Deve retornar 1 ponto para receita com 9 a 14 ingredientes")
    void deveRetornarUmPontoComIngredientesMedios() {
        Receita receita = new Receita();
        receita.setIngredientes("A||B||C||D||E||F||G||H||I");
        CalculadoraDeComplexidade calculadora = new DecoratorPorIngredientes(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve retornar 2 pontos para receita com 15 ingredientes ou mais")
    void deveRetornarDoisPontosComMuitosIngredientes() {
        Receita receita = new Receita();
        receita.setIngredientes("A||B||C||D||E||F||G||H||I||J||K||L||M||N||O");
        CalculadoraDeComplexidade calculadora = new DecoratorPorIngredientes(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(2);
    }
}