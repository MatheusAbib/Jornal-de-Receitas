package com.receitas.site_receitas.factory;

import com.receitas.site_receitas.builder.ReceitaBuilder;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;

public class ReceitaFactory {

    private ReceitaFactory() {
    }

    public static Receita criarSalgada(String titulo, String ingredientes, String modoPreparo, Usuario autor) {
        return new ReceitaBuilder()
                .comTitulo(titulo)
                .comIngredientes(ingredientes)
                .comModoPreparo(modoPreparo)
                .comUsuario(autor)
                .comChefe(autor != null ? autor.getNome() : null)
                .comoSalgada()
                .pendente()
                .build();
    }

    public static Receita criarDoce(String titulo, String ingredientes, String modoPreparo, Usuario autor) {
        return new ReceitaBuilder()
                .comTitulo(titulo)
                .comIngredientes(ingredientes)
                .comModoPreparo(modoPreparo)
                .comUsuario(autor)
                .comChefe(autor != null ? autor.getNome() : null)
                .comoDoce()
                .pendente()
                .build();
    }

    public static Receita criarPendente(String titulo, Usuario autor) {
        return new ReceitaBuilder()
                .comTitulo(titulo)
                .comUsuario(autor)
                .comChefe(autor != null ? autor.getNome() : null)
                .pendente()
                .build();
    }
}
