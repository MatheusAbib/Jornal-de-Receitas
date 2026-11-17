package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public abstract class CalculadoraDecorator implements CalculadoraDeComplexidade {

    protected final CalculadoraDeComplexidade calculadoraEnvolvida;

    protected CalculadoraDecorator(CalculadoraDeComplexidade calculadoraEnvolvida) {
        this.calculadoraEnvolvida = calculadoraEnvolvida;
    }

    @Override
    public Complexidade calcular(Receita receita) {
        return calculadoraEnvolvida.calcular(receita);
    }
}