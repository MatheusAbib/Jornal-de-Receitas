package com.receitas.site_receitas.command;

public abstract class BaseCommand implements Command {
//.O BaseCommand entra como classe abstrata pra guardar o campo resultado e evitar repetir código

    protected Object resultado; // guarda o resultado da execução do command

    @Override
    public Object getResultado() {
        return resultado;  // CommandInvoker lê daqui depois de executar()
    }
}
