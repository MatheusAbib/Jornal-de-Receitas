package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

public class DecoratorPorModoPreparo extends CalculadoraDecorator {

    // construtor: recebe quem veio antes na cadeia (base ou outro decorator)
    public DecoratorPorModoPreparo(CalculadoraDeComplexidade calculadoraEnvolvida) {
        super(calculadoraEnvolvida);
    }

    @Override
    // calcula a complexidade adicionando pontos conforme a quantidade de passos do modo de preparo
    public Complexidade calcular(Receita receita) {
        // primeiro deixa a cadeia anterior calcular a pontuação acumulada
        Complexidade complexidade = super.calcular(receita);
        // conta quantos passos a receita tem e transforma isso em pontos
        int pontos = pontuarPorPassos(contarPassos(receita));
        // soma a pontuação anterior com os pontos deste critério e cria o Complexidade final
        return comPontuacao(complexidade.getPontuacao() + pontos);
    }

    // conta quantos passos válidos existem no modo de preparo
    private int contarPassos(Receita receita) {
        if (receita.getModoPreparo() == null || receita.getModoPreparo().isBlank()) {
            return 0;
        }
        return (int) java.util.Arrays.stream(receita.getModoPreparo().split("\\|\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .count();
    }

    // regra de pontuação baseada na quantidade de passos
    private int pontuarPorPassos(int quantidade) {
        if (quantidade >= 16) return 2; // muitas etapas de preparo: +2 pontos
        if (quantidade >= 9) return 1;  // quantidade intermediária de passos: +1 ponto
        return 0;                       // poucas etapas: não aumenta a complexidade
    }
}
