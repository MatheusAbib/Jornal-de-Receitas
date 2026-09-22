package com.receitas.site_receitas.command;

public abstract class BaseCommand implements Command {

    protected Object resultado;

    @Override
    public Object getResultado() {
        return resultado;
    }
}
