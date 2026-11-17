package com.receitas.site_receitas.model;

public class Complexidade {

    private int nivel;
    private String descricao;
    private int pontuacao;

    public Complexidade() {
    }

    public Complexidade(int nivel, String descricao, int pontuacao) {
        this.nivel = nivel;
        this.descricao = descricao;
        this.pontuacao = pontuacao;
    }

    public int getNivel() {
        return nivel;
    }

    public void setNivel(int nivel) {
        this.nivel = nivel;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public int getPontuacao() {
        return pontuacao;
    }

    public void setPontuacao(int pontuacao) {
        this.pontuacao = pontuacao;
    }

    @Override
    public String toString() {
        return "Complexidade{" +
                "nivel=" + nivel +
                ", descricao='" + descricao + '\'' +
                ", pontuacao=" + pontuacao +
                '}';
    }
}