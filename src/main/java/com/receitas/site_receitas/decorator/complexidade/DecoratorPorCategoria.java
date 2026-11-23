package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public class DecoratorPorCategoria extends CalculadoraDecorator {

    // construtor: recebe quem veio antes na cadeia (base ou outro decorator)
    public DecoratorPorCategoria(CalculadoraDeComplexidade calculadoraEnvolvida) {
        super(calculadoraEnvolvida);
    }

    @Override
    // calcula a complexidade considerando a categoria da receita
    public Complexidade calcular(Receita receita) {
        // primeiro deixa a cadeia anterior calcular a pontuação acumulada
        Complexidade complexidade = super.calcular(receita);
        // depois calcula quantos pontos essa categoria adiciona
        int pontos = pontuarPorCategoria(receita);
        // soma a pontuação anterior com os pontos da categoria e cria o Complexidade final
        return comPontuacao(complexidade.getPontuacao() + pontos);
    }

    // regra de pontuação específica da categoria
    private int pontuarPorCategoria(Receita receita) {
        // se não tiver categoria, não soma nada
        if (receita.getCategoria() == null) {
            return 0;
        }
        // se a categoria for DOCE, adiciona 1 ponto de complexidade
        if (receita.getCategoria() == Receita.Categoria.DOCE) {
            return 1;
        }
        // para outras categorias (ex.: SALGADO), não adiciona ponto
        return 0;
    }
}
