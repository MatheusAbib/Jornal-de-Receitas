package com.receitas.site_receitas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "usuario")
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    private String telefone;

    private String genero;

    @Column(nullable = false)
    private String senha;

    @Column(name = "data_cadastro", nullable = false)
    private LocalDate dataCadastro;

    @Column(nullable = false)
    private boolean ativo = true;

    @Column(nullable = false)
    private String role = "USER";

    @JsonIgnore
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Estatisticas estatisticas;

    public void alternarAtivo() {
    this.ativo = !this.ativo;
    }

    public void alterarSenha(String senhaCriptografada) {
        if (senhaCriptografada == null || senhaCriptografada.isBlank()) {
            throw new IllegalArgumentException("Senha não pode ser vazia");
        }
        this.senha = senhaCriptografada;
    }

    public void editarPerfil(String nome, String email, String cpf, String telefone, String genero) {
        if (nome != null && !nome.isBlank()) this.nome = nome;
        if (email != null && !email.isBlank()) this.email = email;
        if (cpf != null && !cpf.isBlank()) this.cpf = cpf;
        if (telefone != null) this.telefone = telefone;
        if (genero != null) this.genero = genero;
    }
}