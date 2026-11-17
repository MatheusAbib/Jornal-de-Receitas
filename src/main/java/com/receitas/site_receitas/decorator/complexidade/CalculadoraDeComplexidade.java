package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public interface CalculadoraDeComplexidade {

    Complexidade calcular(Receita receita);
}