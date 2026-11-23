package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public interface CalculadoraDeComplexidade {

// Interface: todo objeto que implementa CalculadoraDeComplexidade é obrigado a ter um método calcular que retorna um Complexidade.
// 'Complexidade' aqui é o tipo de retorno, ou seja, o objeto do model que será criado pelos decorators.
Complexidade calcular(Receita receita);
}