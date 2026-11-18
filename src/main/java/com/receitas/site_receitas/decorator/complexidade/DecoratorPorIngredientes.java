package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public class DecoratorPorIngredientes extends CalculadoraDecorator {

    public DecoratorPorIngredientes(CalculadoraDeComplexidade calculadoraEnvolvida) {
        super(calculadoraEnvolvida);
    }

    @Override
    public Complexidade calcular(Receita receita) {
        Complexidade complexidade = super.calcular(receita);
        int quantidade = contarIngredientes(receita);
        int pontos = pontuarPorIngredientes(quantidade);
        int novaPontuacao = complexidade.getPontuacao() + pontos;
        return new Complexidade(
                calcularNivel(novaPontuacao),
                calcularDescricao(novaPontuacao),
                novaPontuacao
        );
    }

    private int contarIngredientes(Receita receita) {
        if (receita.getIngredientes() == null || receita.getIngredientes().isBlank()) {
            return 0;
        }
        return (int) java.util.Arrays.stream(receita.getIngredientes().split("\\|\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .count();
    }

    private int pontuarPorIngredientes(int quantidade) {
        if (quantidade >= 15) return 2;
        if (quantidade >= 9) return 1;
        return 0;
    }

    private int calcularNivel(int pontuacao) {
        if (pontuacao >= 6) return 3;
        if (pontuacao >= 3) return 2;
        return 1;
    }

    private String calcularDescricao(int pontuacao) {
        if (pontuacao >= 6) return "Difícil";
        if (pontuacao >= 3) return "Média";
        return "Fácil";
    }
}