package com.receitas.site_receitas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "receita")
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(name = "tempo_preparo") 
    private String tempoPreparo;

    @Column(columnDefinition = "TEXT")
    private String ingredientes;

    @Column(name = "modo_preparo", columnDefinition = "TEXT")
    private String modoPreparo;

    @Column(columnDefinition = "TEXT") 
    private String imagem;

    @Column(nullable = false)
    private boolean aprovada = false; // padrão: false, ou seja, pendente


    private int porcoes = 1;


    private String chefe;


    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

     // Getters e Setters

    public int getPorcoes() {
        return porcoes;
    }

    public void setPorcoes(int porcoes) {
        this.porcoes = porcoes;
    }


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

    public String getTempoPreparo() {
        return tempoPreparo;
    }

    public void setTempoPreparo(String tempoPreparo) {
        this.tempoPreparo = tempoPreparo;
    }

    public String getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(String ingredientes) {
        this.ingredientes = ingredientes;
    }

    public String getModoPreparo() {
        return modoPreparo;
    }

    public void setModoPreparo(String modoPreparo) {
        this.modoPreparo = modoPreparo;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

        public Boolean getAprovada() {
        return aprovada;
    }

    public void setAprovada(Boolean aprovada) {
        this.aprovada = aprovada;
    }


    public String getChefe() {
        return chefe;
    }

    public void setChefe(String chefe) {
        this.chefe = chefe;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
    
}
