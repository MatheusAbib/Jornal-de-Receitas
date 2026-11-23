package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public class DecoratorPorIngredientes extends CalculadoraDecorator {

    // construtor: recebe quem veio antes na cadeia (base ou outro decorator)
    public DecoratorPorIngredientes(CalculadoraDeComplexidade calculadoraEnvolvida) {
        super(calculadoraEnvolvida);
    }

    @Override
    // calcula a complexidade adicionando pontos conforme a quantidade de ingredientes
    public Complexidade calcular(Receita receita) {
        // primeiro deixa a cadeia anterior calcular a pontuação acumulada
        Complexidade complexidade = super.calcular(receita);
        // conta quantos ingredientes a receita tem e transforma em pontos
        int pontos = pontuarPorIngredientes(contarIngredientes(receita));
        // soma a pontuação anterior com os pontos deste critério e cria o Complexidade final
        return comPontuacao(complexidade.getPontuacao() + pontos);
    }

    // conta quantos ingredientes válidos a receita possui
    private int contarIngredientes(Receita receita) {
        if (receita.getIngredientes() == null || receita.getIngredientes().isBlank()) {
            return 0;
        }
        return (int) java.util.Arrays.stream(receita.getIngredientes().split("\\|\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .count();
    }

    // regra de pontuação baseada na quantidade de ingredientes
    private int pontuarPorIngredientes(int quantidade) {
        if (quantidade >= 15) return 2;  // muitas linhas de ingredientes: +2 pontos
        if (quantidade >= 9) return 1;   // quantidade intermediária: +1 ponto
        return 0;                        // poucas linhas: não aumenta a complexidade
    }
}
