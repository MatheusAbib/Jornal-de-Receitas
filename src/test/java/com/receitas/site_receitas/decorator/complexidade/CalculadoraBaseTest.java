package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CalculadoraBaseTest {

    @Test
    @DisplayName("Deve retornar complexidade zero para qualquer receita")
    void deveRetornarComplexidadeZero() {
        Receita receita = new Receita();
        receita.setTitulo("Bolo de Chocolate");
        receita.setIngredientes("200g de farinha||3 ovos");
        receita.setModoPreparo("Misture tudo||Asse por 35 minutos");

        CalculadoraBase calculadora = new CalculadoraBase();

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
        assertThat(resultado.getPontuacao()).isZero();
    }

    @Test
    @DisplayName("Deve retornar complexidade zero mesmo com receita nula")
    void deveRetornarComplexidadeZeroComReceitaNula() {
        CalculadoraBase calculadora = new CalculadoraBase();

        Complexidade resultado = calculadora.calcular(null);

        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
        assertThat(resultado.getPontuacao()).isZero();
    }
}