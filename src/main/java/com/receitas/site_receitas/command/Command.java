package com.receitas.site_receitas.command;

//garante que todo comando tenha executar() e getResultado(),sem ele, o CommandInvoker não conseguiria tratar todos os comandos de forma genérica.
public interface Command {

    void executar();

    Object getResultado();
}
