package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.Categoria;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;

public class ReceitaBuilder {

    private Receita receita = new Receita();

    public ReceitaBuilder comTitulo(String titulo) {
        receita.setTitulo(titulo);
        return this;
    }

    public ReceitaBuilder comTempoPreparo(String tempoPreparo) {
        receita.setTempoPreparo(tempoPreparo);
        return this;
    }

    public ReceitaBuilder comIngredientes(String ingredientes) {
        receita.setIngredientes(ingredientes);
        return this;
    }

    public ReceitaBuilder comModoPreparo(String modoPreparo) {
        receita.setModoPreparo(modoPreparo);
        return this;
    }

    public ReceitaBuilder comImagem(String imagem) {
        receita.setImagem(imagem);
        return this;
    }

    public ReceitaBuilder comPorcoes(int porcoes) {
        receita.setPorcoes(porcoes);
        return this;
    }

    public ReceitaBuilder comChefe(String chefe) {
        receita.setChefe(chefe);
        return this;
    }

    public ReceitaBuilder comUsuario(Usuario usuario) {
        receita.setUsuario(usuario);
        return this;
    }

    public ReceitaBuilder comCategoria(Categoria categoria) {
        receita.setCategoria(categoria);
        return this;
    }

    public ReceitaBuilder comoSalgada() {
        receita.setCategoria(Categoria.SALGADO);
        return this;
    }

    public ReceitaBuilder comoDoce() {
        receita.setCategoria(Categoria.DOCE);
        return this;
    }

    public ReceitaBuilder comStatus(StatusReceita status) {
        receita.setStatus(status);
        return this;
    }

    public ReceitaBuilder pendente() {
        receita.setStatus(StatusReceita.PENDENTE);
        return this;
    }

    public ReceitaBuilder aprovada() {
        receita.setStatus(StatusReceita.APROVADA);
        return this;
    }

    public ReceitaBuilder rejeitada(String motivo) {
        receita.setStatus(StatusReceita.REJEITADA);
        receita.setMotivoRejeicao(motivo);
        return this;
    }

    public ReceitaBuilder comMotivoRejeicao(String motivo) {
        receita.setMotivoRejeicao(motivo);
        return this;
    }

    public Receita build() {
        if (receita.getStatus() == null) {
            receita.setStatus(StatusReceita.PENDENTE);
        }
        if (receita.getCategoria() == null) {
            receita.setCategoria(Categoria.SALGADO);
        }
        if (receita.getPorcoes() <= 0) {
            receita.setPorcoes(1);
        }
        return receita;
    }
}