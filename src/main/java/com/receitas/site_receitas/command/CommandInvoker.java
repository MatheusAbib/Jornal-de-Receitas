package com.receitas.site_receitas.command;

import org.springframework.stereotype.Component;

@Component
public class CommandInvoker {
    // Recebe qualquer Command (AprovarReceita, RejeitarReceita, etc.),
    // chama executar() e devolve o resultado.
    // Não sabe QUAL command está executando — polimorfismo.
    public Object executar(Command command) {
        command.executar();
        return command.getResultado();
    }
}
