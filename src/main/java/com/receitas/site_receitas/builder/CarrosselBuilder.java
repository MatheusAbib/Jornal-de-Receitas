package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.CarrosselItem;

public class CarrosselBuilder {

    private CarrosselItem item = new CarrosselItem();

    public CarrosselBuilder comTitulo(String titulo) {
        item.setTitulo(titulo);
        return this;
    }

    public CarrosselBuilder comDescricao(String descricao) {
        item.setDescricao(descricao);
        return this;
    }

    public CarrosselBuilder comImagemUrl(String imagemUrl) {
        item.setImagemUrl(imagemUrl);
        return this;
    }

    public CarrosselBuilder comOrdem(Integer ordem) {
        item.setOrdemExibicao(ordem);
        return this;
    }

    public CarrosselBuilder comLinkDestino(String linkDestino) {
        item.setLinkDestino(linkDestino);
        return this;
    }

    public CarrosselBuilder ativo(boolean ativo) {
        item.setAtivo(ativo);
        return this;
    }

    public CarrosselItem build() {
        if (item.getOrdemExibicao() == null) {
            item.setOrdemExibicao(1);
        }
        return item;
    }
}