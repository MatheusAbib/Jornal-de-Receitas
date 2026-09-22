package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.SiteConfig;

public class SiteConfigBuilder {

    private SiteConfig config = new SiteConfig();

    public SiteConfigBuilder comChave(String chave) {
        config.setChave(chave);
        return this;
    }

    public SiteConfigBuilder comValor(String valor) {
        config.setValor(valor);
        return this;
    }

    public SiteConfigBuilder comDescricao(String descricao) {
        config.setDescricao(descricao);
        return this;
    }

    public SiteConfigBuilder ativo(boolean ativo) {
        config.setAtivo(ativo);
        return this;
    }

    public SiteConfig build() {
        if (config.getChave() == null || config.getChave().isEmpty()) {
            throw new IllegalStateException("Chave é obrigatória para criar um SiteConfig");
        }
        return config;
    }
}