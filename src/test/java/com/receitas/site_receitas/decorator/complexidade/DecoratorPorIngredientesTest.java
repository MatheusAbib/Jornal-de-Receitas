package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DecoratorPorIngredientesTest {

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com 5 ingredientes ou menos")
    void deveRetornarZeroPontosComPoucosIngredientes() {
        Receita receita = new Receita();
        receita.setIngredientes("200g de farinha||3 ovos||100g de açúcar||100ml de leite||1 colher de manteiga");

        CalculadoraDeComplexidade calculadora = new DecoratorPorIngredientes(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 1 ponto para receita com 6 a 9 ingredientes")
    void deveRetornarUmPontoComIngredientesMedios() {
        Receita receita = new Receita();
        receita.setIngredientes("200g de farinha||3 ovos||100g de açúcar||100ml de leite||1 colher de manteiga||1 pitada de sal||1 colher de fermento");

        CalculadoraDeComplexidade calculadora = new DecoratorPorIngredientes(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(1);
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 2 pontos para receita com 10 ingredientes ou mais")
    void deveRetornarDoisPontosComMuitosIngredientes() {
        Receita receita = new Receita();
        receita.setIngredientes("200g de farinha||3 ovos||100g de açúcar||100ml de leite||1 colher de manteiga||1 pitada de sal||1 colher de fermento||50g de cacau||100g de chocolate||1 colher de essência de baunilha");

        CalculadoraDeComplexidade calculadora = new DecoratorPorIngredientes(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(2);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com ingredientes nulos")
    void deveRetornarZeroPontosComIngredientesNulos() {
        Receita receita = new Receita();

        CalculadoraDeComplexidade calculadora = new DecoratorPorIngredientes(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com ingredientes vazios")
    void deveRetornarZeroPontosComIngredientesVazios() {
        Receita receita = new Receita();
        receita.setIngredientes("");

        CalculadoraDeComplexidade calculadora = new DecoratorPorIngredientes(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }
}