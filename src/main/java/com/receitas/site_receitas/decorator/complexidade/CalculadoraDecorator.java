package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;


//Classe base para todos os seus decorators (Ingredientes, ModoPreparo, Tempo, Categoria).
//Um modelo pronto para os decorators, com coisas que todos eles têm em comum
public abstract class CalculadoraDecorator implements CalculadoraDeComplexidade {

    // Ele guarda quem vem antes na fila
    protected final CalculadoraDeComplexidade calculadoraEnvolvida; 

    protected CalculadoraDecorator(CalculadoraDeComplexidade calculadoraEnvolvida) {
        this.calculadoraEnvolvida = calculadoraEnvolvida;        
    }

    // por padrão, só transfere o cálculo para o próximo da cadeia
    @Override
    public Complexidade calcular(Receita receita) {
        return calculadoraEnvolvida.calcular(receita);               
    }

    protected Complexidade comPontuacao(int pontuacao) {
        // cria o objeto Complexidade já preenchido com nível, descrição e pontuação finais
        return new Complexidade(
                nivelDe(pontuacao),                                  // calcula o nível (1, 2 ou 3) com base na pontuação
                descricaoDe(pontuacao),                              // calcula o texto ("Fácil", "Média", "Difícil") com base na pontuação
                pontuacao
        );
    }

    private int nivelDe(int pontuacao) {
        if (pontuacao >= 6) return 3;
        if (pontuacao >= 3) return 2;
        return 1;
    }

    private String descricaoDe(int pontuacao) {
        if (pontuacao >= 6) return "Difícil";
        if (pontuacao >= 3) return "Média";
        return "Fácil";
    }
}
