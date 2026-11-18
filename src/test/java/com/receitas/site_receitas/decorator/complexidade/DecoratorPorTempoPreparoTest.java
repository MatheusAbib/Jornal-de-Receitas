package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DecoratorPorTempoPreparoTest {

    @Test
    @DisplayName("Deve retornar 0 pontos para tempo menor que 40 minutos")
    void deveRetornarZeroPontosComTempoCurto() {
        Receita receita = new Receita();
        receita.setTempoPreparo("39min");
        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isZero();
    }

    @Test
    @DisplayName("Deve retornar 1 ponto para tempo entre 40 e 139 minutos")
    void deveRetornarUmPontoComTempoMedio() {
        Receita receita = new Receita();
        receita.setTempoPreparo("40min"); // O Risoto cai aqui
        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve retornar 2 pontos para tempo de 140 minutos ou mais")
    void deveRetornarDoisPontosComTempoLongo() {
        Receita receita = new Receita();
        receita.setTempoPreparo("2h 20min"); // 140 min
        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(2);
    }
}