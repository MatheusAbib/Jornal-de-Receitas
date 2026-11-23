package com.receitas.site_receitas.decorator.complexidade;

import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DecoratorPorTempoPreparo extends CalculadoraDecorator {

    // padrões para encontrar horas e minutos em textos como "1h 10min", "2 horas", "45 minutos"
    private static final Pattern PATTERN_HORAS = Pattern.compile("(\\d+)\\s*(h|hora|horas)", Pattern.CASE_INSENSITIVE);
    private static final Pattern PATTERN_MINUTOS = Pattern.compile("(\\d+)\\s*(min|minuto|minutos)", Pattern.CASE_INSENSITIVE);

    // construtor: recebe quem veio antes na cadeia (base ou outro decorator)
    public DecoratorPorTempoPreparo(CalculadoraDeComplexidade calculadoraEnvolvida) {
        super(calculadoraEnvolvida);
    }

    @Override
    // calcula a complexidade adicionando pontos conforme o tempo total de preparo
    public Complexidade calcular(Receita receita) {
        // primeiro deixa a cadeia anterior calcular a pontuação acumulada
        Complexidade complexidade = super.calcular(receita);
        // converte o texto do tempo de preparo em minutos e transforma isso em pontos
        int pontos = pontuarPorTempo(parsearMinutos(receita.getTempoPreparo()));
        // soma a pontuação anterior com os pontos deste critério e cria o Complexidade final
        return comPontuacao(complexidade.getPontuacao() + pontos);
    }

    // lê uma String como "1h 10min" e calcula o total em minutos (ex.: 70)
    private int parsearMinutos(String tempoPreparo) {
        if (tempoPreparo == null || tempoPreparo.isBlank()) {
            return 0;
        }
        int total = 0;
        boolean encontrouAlgo = false;

        // procura por horas (1h, 2 horas, etc.) e converte para minutos
        Matcher matcherHoras = PATTERN_HORAS.matcher(tempoPreparo);
        if (matcherHoras.find()) {
            total += Integer.parseInt(matcherHoras.group(1)) * 60;
            encontrouAlgo = true;
        }

        // procura por minutos (10min, 30 minutos, etc.) e soma ao total
        Matcher matcherMinutos = PATTERN_MINUTOS.matcher(tempoPreparo);
        if (matcherMinutos.find()) {
            total += Integer.parseInt(matcherMinutos.group(1));
            encontrouAlgo = true;
        }

        // se não encontrou nada que pareça tempo, retorna 0
        return encontrouAlgo ? total : 0;
    }

    // regra de pontuação baseada no tempo total em minutos
    private int pontuarPorTempo(int minutos) {
        if (minutos >= 140) return 2; // receitas muito demoradas: +2 pontos
        if (minutos >= 40) return 1;  // receitas com tempo intermediário: +1 ponto
        return 0;                     // receitas rápidas: não aumentam a complexidade
    }
}
