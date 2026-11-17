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
    @DisplayName("Deve calcular complexidade Difícil para Bolo de Chocolate completo")
    void deveCalcularComplexidadeDificilParaBoloDeChocolate() {
        Receita receita = new Receita();
        receita.setTitulo("Bolo de Chocolate");
        receita.setIngredientes("200g de farinha||3 ovos||100g de açúcar||100ml de leite||1 colher de manteiga||1 pitada de sal||1 colher de fermento||50g de cacau||100g de chocolate||1 colher de essência de baunilha");
        receita.setModoPreparo("Misture farinha e cacau||Bata ovos e açúcar||Acrescente leite||Misture os secos||Coloque na forma||Asse por 35 minutos||Deixe esfriar||Desenforme");
        receita.setTempoPreparo("1h 10 Minutos");
        receita.setCategoria(Receita.Categoria.DOCE);

        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(7);
        assertThat(resultado.getNivel()).isEqualTo(3);
        assertThat(resultado.getDescricao()).isEqualTo("Difícil");
    }

    @Test
    @DisplayName("Deve calcular complexidade Média para Salada Caprese")
    void deveCalcularComplexidadeMediaParaSaladaCaprese() {
        Receita receita = new Receita();
        receita.setTitulo("Salada Caprese");
        receita.setIngredientes("2 tomates grandes||200g de mussarela de búfala||Folhas de manjericão fresco||2 colheres de azeite||Sal a gosto||Pimenta a gosto||1 colher de vinagre balsâmico");
        receita.setModoPreparo("Corte tomates e mussarela em fatias||Intercale fatias em prato||Adicione folhas de manjericão||Tempere com sal e pimenta||Regue com azeite||Sirva fresca");
        receita.setTempoPreparo("15 Minutos");
        receita.setCategoria(Receita.Categoria.SALGADO);

        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(2);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve calcular complexidade Fácil para receita simples")
    void deveCalcularComplexidadeFacilParaReceitaSimples() {
        Receita receita = new Receita();
        receita.setTitulo("Coxinha de Frango");
        receita.setIngredientes("1g de frango");
        receita.setModoPreparo("Cozinhe");
        receita.setTempoPreparo("5min");
        receita.setCategoria(Receita.Categoria.SALGADO);

        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve calcular complexidade Fácil para receita com todos os campos vazios")
    void deveCalcularComplexidadeFacilParaReceitaVazia() {
        Receita receita = new Receita();

        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve calcular complexidade Difícil quando todos os fatores somam 7 pontos")
    void deveCalcularComplexidadeMaxima() {
        Receita receita = new Receita();
        receita.setTitulo("Receita Máxima");
        receita.setIngredientes("1||2||3||4||5||6||7||8||9||10");
        receita.setModoPreparo("1||2||3||4||5||6||7");
        receita.setTempoPreparo("2h");
        receita.setCategoria(Receita.Categoria.DOCE);

        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(7);
        assertThat(resultado.getNivel()).isEqualTo(3);
        assertThat(resultado.getDescricao()).isEqualTo("Difícil");
    }

    @Test
    @DisplayName("Deve calcular complexidade Média quando a soma é 4 pontos")
    void deveCalcularComplexidadeMediaComQuatroPontos() {
        Receita receita = new Receita();
        receita.setTitulo("Receita Média");
        receita.setIngredientes("1||2||3||4||5||6||7||8||9||10");
        receita.setModoPreparo("1||2||3");
        receita.setTempoPreparo("15min");
        receita.setCategoria(Receita.Categoria.DOCE);

        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(3);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve calcular complexidade Difícil quando a soma é 5 pontos")
    void deveCalcularComplexidadeDificilComCincoPontos() {
        Receita receita = new Receita();
        receita.setTitulo("Receita Difícil");
        receita.setIngredientes("1||2||3||4||5||6||7||8||9||10");
        receita.setModoPreparo("1||2||3");
        receita.setTempoPreparo("1h");
        receita.setCategoria(Receita.Categoria.SALGADO);

        CalculadoraDeComplexidade calculadora = montarCadeiaCompleta();

        Complexidade resultado = calculadora.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(4);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }

    @Test
    @DisplayName("Deve ser possível trocar a ordem dos decorators sem alterar o resultado")
    void deveSerComutativo() {
        Receita receita = new Receita();
        receita.setIngredientes("1||2||3||4||5||6||7");
        receita.setModoPreparo("1||2||3||4||5");
        receita.setTempoPreparo("40min");
        receita.setCategoria(Receita.Categoria.DOCE);

        CalculadoraDeComplexidade cadeiaNormal = new CalculadoraBase();
        cadeiaNormal = new DecoratorPorIngredientes(cadeiaNormal);
        cadeiaNormal = new DecoratorPorModoPreparo(cadeiaNormal);
        cadeiaNormal = new DecoratorPorTempoPreparo(cadeiaNormal);
        cadeiaNormal = new DecoratorPorCategoria(cadeiaNormal);

        CalculadoraDeComplexidade cadeiaInvertida = new CalculadoraBase();
        cadeiaInvertida = new DecoratorPorCategoria(cadeiaInvertida);
        cadeiaInvertida = new DecoratorPorTempoPreparo(cadeiaInvertida);
        cadeiaInvertida = new DecoratorPorModoPreparo(cadeiaInvertida);
        cadeiaInvertida = new DecoratorPorIngredientes(cadeiaInvertida);

        Complexidade resultadoNormal = cadeiaNormal.calcular(receita);
        Complexidade resultadoInvertido = cadeiaInvertida.calcular(receita);

        assertThat(resultadoNormal.getPontuacao()).isEqualTo(resultadoInvertido.getPontuacao());
        assertThat(resultadoNormal.getNivel()).isEqualTo(resultadoInvertido.getNivel());
        assertThat(resultadoNormal.getDescricao()).isEqualTo(resultadoInvertido.getDescricao());
    }
}