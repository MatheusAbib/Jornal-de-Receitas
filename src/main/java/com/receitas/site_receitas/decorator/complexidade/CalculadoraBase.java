package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public class CalculadoraBase implements CalculadoraDeComplexidade {

    @Override
    public Complexidade calcular(Receita receita) {
        return new Complexidade(1, "Fácil", 0);
    }
}