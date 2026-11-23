package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public class CalculadoraBase implements CalculadoraDeComplexidade {

    @Override
    public Complexidade calcular(Receita receita) {
        // Implementação da interface: ponto de partida da cadeia, sempre começa com nível 1 (Fácil) e pontuação 0
        return new Complexidade(1, "Fácil", 0); 
    }
}
