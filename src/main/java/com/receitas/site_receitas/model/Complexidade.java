package com.receitas.site_receitas.model;

public class Complexidade {
    private int nivel;        // nível numérico da receita (1 = fácil, 2 = média, 3 = difícil)
    private String descricao; // texto correspondente ao nível ("Fácil", "Média", "Difícil")
    private int pontuacao;    // pontuação bruta somada pelos decorators

    public Complexidade() {   // construtor vazio (permite criar o objeto em branco, se precisar)
    }

    public Complexidade(int nivel, String descricao, int pontuacao) { // construtor usado pelos decorators (cria o objeto já preenchido)
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
