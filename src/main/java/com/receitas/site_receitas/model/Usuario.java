package com.receitas.site_receitas.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "usuario")
@Getter
@Setter
@Schema(description = "Representa um usuário do sistema")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único do usuário", example = "1")
    private Integer id;

    @Column(nullable = false)
    @Schema(description = "Nome completo do usuário", example = "João Silva")
    private String nome;

    @Column(nullable = false, unique = true)
    @Schema(description = "Email único do usuário", example = "joao.silva@email.com")
    private String email;

    @Column(nullable = false, unique = true, length = 14)
    @Schema(description = "CPF do usuário (somente números)", example = "12345678901")
    private String cpf;

    @Schema(description = "Telefone de contato", example = "11987654321")
    private String telefone;

    @Schema(description = "Gênero do usuário", example = "MASCULINO", allowableValues = {"MASCULINO", "FEMININO", "OUTRO"})
    private String genero;

    @Column(nullable = false)
    @Schema(description = "Senha do usuário (armazenada como hash BCrypt)", example = "$2a$10$...", accessMode = Schema.AccessMode.WRITE_ONLY)
    private String senha;

    @Column(name = "data_cadastro", nullable = false)
    @Schema(description = "Data em que o usuário se cadastrou", example = "2025-09-23")
    private LocalDate dataCadastro;

    @Column(nullable = false)
    @Schema(description = "Indica se o usuário está ativo", example = "true")
    private boolean ativo = true;

    @Column(nullable = false)
    @Schema(description = "Papel do usuário no sistema", example = "USER", allowableValues = {"USER", "ADMIN"})
    private String role = "USER";

    @JsonIgnore
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Estatisticas estatisticas;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Favorito> favoritos = new ArrayList<>();

    public List<String> listarIngredientesDisponiveis() {
        return favoritos.stream()
                .map(Favorito::getReceita)
                .filter(r -> r.getIngredientes() != null)
                .flatMap(r -> Arrays.stream(r.getIngredientes().split("\\|\\|")))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> listarReceitasComIngrediente(String termo) {
        if (termo == null || termo.isBlank()) return new ArrayList<>();

        String busca = termo.toLowerCase().trim();

        return favoritos.stream()
                .map(Favorito::getReceita)
                .filter(r -> r.getIngredientes() != null)
                .filter(r -> Arrays.stream(r.getIngredientes().split("\\|\\|"))
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .anyMatch(i -> i.equals(busca)))
                .map(Receita::getTitulo)
                .collect(Collectors.toList());
    }

    public List<String> listarIngredientesRepetidos() {
        return favoritos.stream()
                .map(Favorito::getReceita)
                .filter(r -> r.getIngredientes() != null)
                .flatMap(r -> Arrays.stream(r.getIngredientes().split("\\|\\|")))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.groupingBy(i -> i, Collectors.counting()))
                .entrySet().stream()
                .filter(e -> e.getValue() > 1)
                .map(e -> e.getKey())
                .sorted()
                .collect(Collectors.toList());
    }

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
