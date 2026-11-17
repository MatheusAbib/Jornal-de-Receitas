package com.receitas.site_receitas.service;

import com.receitas.site_receitas.decorator.complexidade.CalculadoraBase;
import com.receitas.site_receitas.decorator.complexidade.CalculadoraDeComplexidade;
import com.receitas.site_receitas.decorator.complexidade.DecoratorPorCategoria;
import com.receitas.site_receitas.decorator.complexidade.DecoratorPorIngredientes;
import com.receitas.site_receitas.decorator.complexidade.DecoratorPorModoPreparo;
import com.receitas.site_receitas.decorator.complexidade.DecoratorPorTempoPreparo;
import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.springframework.stereotype.Service;

@Service
public class ComplexidadeService {

    public Complexidade calcular(Receita receita) {
        CalculadoraDeComplexidade calculadora = new CalculadoraBase();
        calculadora = new DecoratorPorIngredientes(calculadora);
        calculadora = new DecoratorPorModoPreparo(calculadora);
        calculadora = new DecoratorPorTempoPreparo(calculadora);
        calculadora = new DecoratorPorCategoria(calculadora);

        return calculadora.calcular(receita);
    }
}