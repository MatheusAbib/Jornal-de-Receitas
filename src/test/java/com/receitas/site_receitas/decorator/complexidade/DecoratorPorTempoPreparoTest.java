package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DecoratorPorTempoPreparoTest {

    @Test
    @DisplayName("Deve retornar 0 pontos para tempo menor que 30 minutos")
    void deveRetornarZeroPontosComTempoCurto() {
        Receita receita = new Receita();
        receita.setTempoPreparo("15 Minutos");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 1 ponto para tempo entre 30 e 59 minutos")
    void deveRetornarUmPontoComTempoMedio() {
        Receita receita = new Receita();
        receita.setTempoPreparo("40 Minutos");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(1);
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 2 pontos para tempo de 60 minutos ou mais")
    void deveRetornarDoisPontosComTempoLongo() {
        Receita receita = new Receita();
        receita.setTempoPreparo("1h 10 Minutos");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(2);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve retornar 2 pontos para tempo em horas exatas")
    void deveRetornarDoisPontosComTempoEmHoras() {
        Receita receita = new Receita();
        receita.setTempoPreparo("2h");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(2);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve retornar 1 ponto para tempo em minutos abreviados")
    void deveRetornarUmPontoComMinutosAbreviados() {
        Receita receita = new Receita();
        receita.setTempoPreparo("45min");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(1);
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 2 pontos para tempo com 1h e 30 minutos")
    void deveRetornarDoisPontosComHoraEMinutos() {
        Receita receita = new Receita();
        receita.setTempoPreparo("1h 30 Minutos");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(2);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para tempo de 30 minutos exatos")
    void deveRetornarUmPontoComTrintaMinutos() {
        Receita receita = new Receita();
        receita.setTempoPreparo("30 Minutos");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(1);
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para tempo de 60 minutos exatos")
    void deveRetornarDoisPontosComSessentaMinutos() {
        Receita receita = new Receita();
        receita.setTempoPreparo("60min");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(2);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para tempo nulo")
    void deveRetornarZeroPontosComTempoNulo() {
        Receita receita = new Receita();

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para tempo vazio")
    void deveRetornarZeroPontosComTempoVazio() {
        Receita receita = new Receita();
        receita.setTempoPreparo("");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para tempo não parseável")
    void deveRetornarZeroPontosComTempoInvalido() {
        Receita receita = new Receita();
        receita.setTempoPreparo("rápido");

        CalculadoraDeComplexidade calculadora = new DecoratorPorTempoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }
}