package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public class DecoratorPorModoPreparo extends CalculadoraDecorator {

    public DecoratorPorModoPreparo(CalculadoraDeComplexidade calculadoraEnvolvida) {
        super(calculadoraEnvolvida);
    }

    @Override
    public Complexidade calcular(Receita receita) {
        Complexidade complexidade = super.calcular(receita);

        int quantidade = contarPassos(receita);
        int pontos = pontuarPorPassos(quantidade);

        int novaPontuacao = complexidade.getPontuacao() + pontos;
        return new Complexidade(
                calcularNivel(novaPontuacao),
                calcularDescricao(novaPontuacao),
                novaPontuacao
        );
    }

    private int contarPassos(Receita receita) {
        if (receita.getModoPreparo() == null || receita.getModoPreparo().isBlank()) {
            return 0;
        }
        return (int) java.util.Arrays.stream(receita.getModoPreparo().split("\\|\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .count();
    }

    private int pontuarPorPassos(int quantidade) {
        if (quantidade >= 7) return 2;
        if (quantidade >= 4) return 1;
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