package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DecoratorPorModoPreparoTest {

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com 3 passos ou menos")
    void deveRetornarZeroPontosComPoucosPassos() {
        Receita receita = new Receita();
        receita.setModoPreparo("Misture tudo||Asse por 35 minutos||Sirva");

        CalculadoraDeComplexidade calculadora = new DecoratorPorModoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 1 ponto para receita com 4 a 6 passos")
    void deveRetornarUmPontoComPassosMedios() {
        Receita receita = new Receita();
        receita.setModoPreparo("Misture os secos||Bata os ovos||Acrescente o leite||Misture tudo||Asse por 35 minutos");

        CalculadoraDeComplexidade calculadora = new DecoratorPorModoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(1);
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 2 pontos para receita com 7 passos ou mais")
    void deveRetornarDoisPontosComMuitosPassos() {
        Receita receita = new Receita();
        receita.setModoPreparo("Misture farinha e cacau||Bata ovos e açúcar||Acrescente leite||Misture os secos||Coloque na forma||Asse por 35 minutos||Deixe esfriar||Desenforme");

        CalculadoraDeComplexidade calculadora = new DecoratorPorModoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(2);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com modo de preparo nulo")
    void deveRetornarZeroPontosComModoPreparoNulo() {
        Receita receita = new Receita();

        CalculadoraDeComplexidade calculadora = new DecoratorPorModoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve retornar 0 pontos para receita com modo de preparo vazio")
    void deveRetornarZeroPontosComModoPreparoVazio() {
        Receita receita = new Receita();
        receita.setModoPreparo("");

        CalculadoraDeComplexidade calculadora = new DecoratorPorModoPreparo(new CalculadoraBase());

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }
}