package com.receitas.site_receitas.service;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ComplexidadeServiceTest {

    @Test
    @DisplayName("Deve calcular complexidade de receita completa")
    void deveCalcularComplexidadeDeReceitaCompleta() {
        Receita receita = new Receita();
        receita.setIngredientes("1||2||3||4||5||6||7||8||9||10||11||12||13||14||15");
        receita.setModoPreparo("1||2||3||4||5||6||7||8||9||10||11||12||13||14||15||16");
        receita.setTempoPreparo("2h 30min");
        receita.setCategoria(Receita.Categoria.DOCE);

        ComplexidadeService service = new ComplexidadeService();
        Complexidade resultado = service.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(7);
        assertThat(resultado.getNivel()).isEqualTo(3);
        assertThat(resultado.getDescricao()).isEqualTo("Difícil");
    }

    @Test
    @DisplayName("Deve calcular complexidade de receita simples")
    void deveCalcularComplexidadeDeReceitaSimples() {
        Receita receita = new Receita();
        receita.setIngredientes("1");
        receita.setModoPreparo("1");
        receita.setTempoPreparo("5min");
        receita.setCategoria(Receita.Categoria.SALGADO);

        ComplexidadeService service = new ComplexidadeService();
        Complexidade resultado = service.calcular(receita);

        assertThat(resultado.getPontuacao()).isZero();
        assertThat(resultado.getNivel()).isEqualTo(1);
        assertThat(resultado.getDescricao()).isEqualTo("Fácil");
    }

    @Test
    @DisplayName("Deve calcular complexidade media")
    void deveCalcularComplexidadeMedia() {
        Receita receita = new Receita();
        receita.setIngredientes("1||2||3||4||5||6||7||8||9");
        receita.setModoPreparo("1||2||3||4||5||6||7||8||9");
        receita.setTempoPreparo("40min");
        receita.setCategoria(Receita.Categoria.DOCE);

        ComplexidadeService service = new ComplexidadeService();
        Complexidade resultado = service.calcular(receita);

        assertThat(resultado.getPontuacao()).isEqualTo(4);
        assertThat(resultado.getNivel()).isEqualTo(2);
        assertThat(resultado.getDescricao()).isEqualTo("Média");
    }
}