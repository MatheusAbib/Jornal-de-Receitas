package com.receitas.site_receitas.factory;

import com.receitas.site_receitas.builder.UsuarioBuilder;
import com.receitas.site_receitas.model.Usuario;

import java.time.LocalDate;

public class UsuarioFactory {

    private UsuarioFactory() {
    }

    public static Usuario criarCliente(String nome, String email, String senha, String cpf) {
        return new UsuarioBuilder()
                .comNome(nome)
                .comEmail(email)
                .comSenha(senha)
                .comCpf(cpf)
                .comDataCadastro(LocalDate.now())
                .ativo(true)
                .comoCliente()
                .build();
    }

    public static Usuario criarAdmin(String nome, String email, String senha, String cpf) {
        return new UsuarioBuilder()
                .comNome(nome)
                .comEmail(email)
                .comSenha(senha)
                .comCpf(cpf)
                .comDataCadastro(LocalDate.now())
                .ativo(true)
                .comoAdmin()
                .build();
    }

    public static Usuario criarClienteCompleto(String nome, String email, String senha, String cpf,
                                                String telefone, String genero) {
        return new UsuarioBuilder()
                .comNome(nome)
                .comEmail(email)
                .comSenha(senha)
                .comCpf(cpf)
                .comTelefone(telefone)
                .comGenero(genero)
                .comDataCadastro(LocalDate.now())
                .ativo(true)
                .comoCliente()
                .build();
    }
}
