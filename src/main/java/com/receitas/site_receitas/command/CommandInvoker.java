package com.receitas.site_receitas.command;

import org.springframework.stereotype.Component;

@Component
public class CommandInvoker {

    public Object executar(Command command) {
        command.executar();
        return command.getResultado();
    }
}
