package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CalculadoraCompletaTest {

    private CalculadoraDeComplexidade montarCadeiaCompleta() {
        CalculadoraDeComplexidade calculadora = new CalculadoraBase();
        calculadora = new DecoratorPorIngredientes(calculadora);
        calculadora = new DecoratorPorModoPreparo(calculadora);
        calculadora = new DecoratorPorTempoPreparo(calculadora);
        calculadora = new DecoratorPorCategoria(calculadora);
        return calculadora;
    }

    @Test
    @DisplayName("Deve calcular complexidade Difícil para receita máxima")
    void deveCalcularComplexidadeDificilParaReceitaMaxima() {
        Receita receita = new Receita();
        receita.setIngredientes("1||2||3||4||5||6||7||8||9||10||11||12||13||14||15");
        receita.setModoPreparo("1||2||3||4||5||6||7||8||9||10||11||12||13||14||15||16");
        receita.setTempoPreparo("2h 20min"); // 140 min
        receita.setCategoria(Receita.Categoria.DOCE);
        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(7); 
        assertThat(resultado.getDescricao()).isEqualTo("Difícil");
    }

    @Test
    @DisplayName("Deve calcular complexidade Fácil para Brigadeiro")
    void deveCalcularComplexidadeFacilParaBrigadeiro() {
        Receita receita = new Receita();
        receita.setIngredientes("1||2||3||4||5||6"); // 6 = 0
        receita.setModoPreparo("1||2||3||4||5||6||7||8"); // 8 = 0
        receita.setTempoPreparo("40min"); // 40 = 1
        receita.setCategoria(Receita.Categoria.DOCE); // 1
        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil"); // 2 pontos ainda é Fácil
    }

    @Test
    @DisplayName("Deve calcular complexidade Média para Risoto")
    void deveCalcularComplexidadeMediaParaRisoto() {
        Receita receita = new Receita();
        receita.setIngredientes("1||2||3||4||5||6||7||8||9||10||11"); // 11 = 1
        receita.setModoPreparo("1||2||3||4||5||6||7||8||9||10"); // 10 = 1
        receita.setTempoPreparo("40min"); // 40 = 1
        receita.setCategoria(Receita.Categoria.SALGADO); // 0
        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();
        Complexidade resultado = calculadora.calcular(receita);
        assertThat(resultado.getPontuacao()).isEqualTo(3);
        assertThat(resultado.getDescricao()).isEqualTo("Média"); // 3 pontos = Média
    }
}