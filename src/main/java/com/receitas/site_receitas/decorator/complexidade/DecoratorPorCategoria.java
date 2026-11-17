package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public class DecoratorPorCategoria extends CalculadoraDecorator {

    public DecoratorPorCategoria(CalculadoraDeComplexidade calculadoraEnvolvida) {
        super(calculadoraEnvolvida);
    }

    @Override
    public Complexidade calcular(Receita receita) {
        Complexidade complexidade = super.calcular(receita);

        int pontos = pontuarPorCategoria(receita);

        int novaPontuacao = complexidade.getPontuacao() + pontos;
        return new Complexidade(
                calcularNivel(novaPontuacao),
                calcularDescricao(novaPontuacao),
                novaPontuacao
        );
    }

    private int pontuarPorCategoria(Receita receita) {
        if (receita.getCategoria() == null) {
            return 0;
        }
        if (receita.getCategoria() == Receita.Categoria.DOCE) {
            return 1;
        }
        return 0;
    }

    private int calcularNivel(int pontuacao) {
        if (pontuacao >= 5) return 3;
        if (pontuacao >= 2) return 2;
        return 1;
    }

    private String calcularDescricao(int pontuacao) {
        if (pontuacao >= 5) return "Difícil";
        if (pontuacao >= 2) return "Média";
        return "Fácil";
    }
}