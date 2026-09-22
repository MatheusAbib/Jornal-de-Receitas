package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.Usuario;

import java.time.LocalDate;

public class UsuarioBuilder {

    private Usuario usuario = new Usuario();

    public UsuarioBuilder comNome(String nome) {
        usuario.setNome(nome);
        return this;
    }

    public UsuarioBuilder comEmail(String email) {
        usuario.setEmail(email);
        return this;
    }

    public UsuarioBuilder comSenha(String senha) {
        usuario.setSenha(senha);
        return this;
    }

    public UsuarioBuilder comCpf(String cpf) {
        usuario.setCpf(cpf);
        return this;
    }

    public UsuarioBuilder comTelefone(String telefone) {
        usuario.setTelefone(telefone);
        return this;
    }

    public UsuarioBuilder comGenero(String genero) {
        usuario.setGenero(genero);
        return this;
    }

    public UsuarioBuilder comDataCadastro(LocalDate data) {
        usuario.setDataCadastro(data);
        return this;
    }

    public UsuarioBuilder ativo(boolean ativo) {
        usuario.setAtivo(ativo);
        return this;
    }

    public UsuarioBuilder comoAdmin() {
        usuario.setRole("ADMIN");
        return this;
    }

    public UsuarioBuilder comoCliente() {
        usuario.setRole("USER");
        return this;
    }

    public UsuarioBuilder comRole(String role) {
        usuario.setRole(role);
        return this;
    }

    public Usuario build() {
        if (usuario.getRole() == null || usuario.getRole().isEmpty()) {
            usuario.setRole("USER");
        }
        if (usuario.getDataCadastro() == null) {
            usuario.setDataCadastro(LocalDate.now());
        }
        return usuario;
    }
}