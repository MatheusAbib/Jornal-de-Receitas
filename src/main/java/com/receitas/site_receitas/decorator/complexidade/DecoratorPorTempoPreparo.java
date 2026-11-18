package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DecoratorPorTempoPreparo extends CalculadoraDecorator {

    private static final Pattern PATTERN_HORAS = Pattern.compile("(\\d+)\\s*(h|hora|horas)", Pattern.CASE_INSENSITIVE);
    private static final Pattern PATTERN_MINUTOS = Pattern.compile("(\\d+)\\s*(min|minuto|minutos)", Pattern.CASE_INSENSITIVE);

    public DecoratorPorTempoPreparo(CalculadoraDeComplexidade calculadoraEnvolvida) {
        super(calculadoraEnvolvida);
    }

    @Override
    public Complexidade calcular(Receita receita) {
        Complexidade complexidade = super.calcular(receita);
        int minutos = parsearMinutos(receita.getTempoPreparo());
        int pontos = pontuarPorTempo(minutos);
        int novaPontuacao = complexidade.getPontuacao() + pontos;
        return new Complexidade(
                calcularNivel(novaPontuacao),
                calcularDescricao(novaPontuacao),
                novaPontuacao
        );
    }

    private int parsearMinutos(String tempoPreparo) {
        if (tempoPreparo == null || tempoPreparo.isBlank()) {
            return 0;
        }
        int total = 0;
        boolean encontrouAlgo = false;

        Matcher matcherHoras = PATTERN_HORAS.matcher(tempoPreparo);
        if (matcherHoras.find()) {
            total += Integer.parseInt(matcherHoras.group(1)) * 60;
            encontrouAlgo = true;
        }

        Matcher matcherMinutos = PATTERN_MINUTOS.matcher(tempoPreparo);
        if (matcherMinutos.find()) {
            total += Integer.parseInt(matcherMinutos.group(1));
            encontrouAlgo = true;
        }

        return encontrouAlgo ? total : 0;
    }

    private int pontuarPorTempo(int minutos) {
        if (minutos >= 140) return 2;
        if (minutos >= 40) return 1; 
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