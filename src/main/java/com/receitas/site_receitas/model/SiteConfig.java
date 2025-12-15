package com.receitas.site_receitas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "site_config")
public class SiteConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String chave;
    
    @Column(columnDefinition = "TEXT")
    private String valor;
    
    private String descricao;
    
    private boolean ativo = true;

    // Construtor padrão
    public SiteConfig() {
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChave() {
        return chave;
    }

    public void setChave(String chave) {
        this.chave = chave;
    }

    public String getValor() {
        return valor;
    }

    public void setValor(String valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    // toString opcional
    @Override
    public String toString() {
        return "SiteConfig{" +
                "id=" + id +
                ", chave='" + chave + '\'' +
                ", valor='" + valor + '\'' +
                ", descricao='" + descricao + '\'' +
                ", ativo=" + ativo +
                '}';
    }
}