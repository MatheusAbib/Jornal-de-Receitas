package com.receitas.site_receitas.service;

import com.receitas.site_receitas.decorator.complexidade.CalculadoraBase;
import com.receitas.site_receitas.decorator.complexidade.CalculadoraDeComplexidade;
import com.receitas.site_receitas.decorator.complexidade.DecoratorPorCategoria;
import com.receitas.site_receitas.decorator.complexidade.DecoratorPorIngredientes;
import com.receitas.site_receitas.decorator.complexidade.DecoratorPorModoPreparo;
import com.receitas.site_receitas.decorator.complexidade.DecoratorPorTempoPreparo;
import com.receitas.site_receitas.model.Complexidade;
import com.receitas.site_receitas.model.Receita;
import org.springframework.stereotype.Service;

@Service
public class ComplexidadeService {

// É quem organiza o cálculo e devolve o resultado para o Controller
// Ponto de entrada: monta a fila empilhada de calculadoras e calcula a complexidade de uma receita
public Complexidade calcular(Receita receita) {
    CalculadoraDeComplexidade calculadora = new CalculadoraBase(); // começa com a calculadora base (pontuação inicial = 0)
    calculadora = new DecoratorPorIngredientes(calculadora);       // adiciona o critério de quantidade de ingredientes
    calculadora = new DecoratorPorModoPreparo(calculadora);        // adiciona o critério de número de passos do modo de preparo
    calculadora = new DecoratorPorTempoPreparo(calculadora);       // adiciona o critério de tempo de preparo
    calculadora = new DecoratorPorCategoria(calculadora);          // adiciona o critério de categoria (doce/salgado)

    return calculadora.calcular(receita);
    // executa a cadeia inteira de decorators e devolve o objeto Complexidade final para o controller
    // O resultado desse 'calcular' é um objeto 'complexidade' pronto com nivel, descrição e pontuação. 
}

}
