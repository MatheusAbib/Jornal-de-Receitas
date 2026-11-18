package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DecoratorPorModoPreparoTest {

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com 8 passos ou menos")
    void deveRetornarZeroPontosComPoucosPassos() {
        Receita receita = new Receita();
        receita.setModoPreparo("1||2||3||4||5||6||7||8");
        CalculadoraDeComplexidade calculadora = new DecoratorPorModoPreparo(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isZero();
    }

    @Test
    @DisplayName("Deve retornar 1 ponto para receita com 9 a 15 passos")
    void deveRetornarUmPontoComPassosMedios() {
        Receita receita = new Receita();
        receita.setModoPreparo("1||2||3||4||5||6||7||8||9");
        CalculadoraDeComplexidade calculadora = new DecoratorPorModoPreparo(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(1);
    }

    @Test
    @DisplayName("Deve retornar 2 pontos para receita com 16 passos ou mais")
    void deveRetornarDoisPontosComMuitosPassos() {
        Receita receita = new Receita();
        receita.setModoPreparo("1||2||3||4||5||6||7||8||9||10||11||12||13||14||15||16");
        CalculadoraDeComplexidade calculadora = new DecoratorPorModoPreparo(new CalculadoraBase());
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(2);
    }
}