package com.receitas.site_receitas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "carrossel")
public class CarrosselItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "imagem_url", columnDefinition = "TEXT", nullable = false)
    private String imagemUrl;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    @Column(name = "ordem_exibicao")
    private Integer ordemExibicao;

    @Column(name = "link_destino")
    private String linkDestino;

    // Construtores
    public CarrosselItem() {
    }

    public CarrosselItem(String titulo, String descricao, String imagemUrl, Integer ordemExibicao) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.imagemUrl = imagemUrl;
        this.ordemExibicao = ordemExibicao;
        this.ativo = true;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public Integer getOrdemExibicao() {
        return ordemExibicao;
    }

    public void setOrdemExibicao(Integer ordemExibicao) {
        this.ordemExibicao = ordemExibicao;
    }

    public String getLinkDestino() {
        return linkDestino;
    }

    public void setLinkDestino(String linkDestino) {
        this.linkDestino = linkDestino;
    }
}