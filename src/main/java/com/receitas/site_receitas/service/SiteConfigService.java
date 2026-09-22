package com.receitas.site_receitas.service;

import com.receitas.site_receitas.builder.SiteConfigBuilder;
import com.receitas.site_receitas.dao.siteconfig.ISiteConfigDAO;
import com.receitas.site_receitas.model.SiteConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SiteConfigService {

    @Autowired
    private ISiteConfigDAO siteConfigDAO;

    @Transactional(readOnly = true)
    public String getConfigValue(String chave) {
        return siteConfigDAO.buscarPorChave(chave)
                .map(SiteConfig::getValor)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public String getFaviconUrl() {
        return getConfigValue("favicon_url");
    }

    @Transactional(readOnly = true)
    public String getGanacheUrl() {
        return getConfigValue("ganache_url");
    }

    @Transactional(readOnly = true)
    public String getSopaUrl() {
        return getConfigValue("sopa_url");
    }

    @Transactional(readOnly = true)
    public String getPestoUrl() {
        return getConfigValue("pesto_url");
    }

    @Transactional(readOnly = true)
    public String getBolinhoUrl() {
        return getConfigValue("bolinho_url");
    }

    @Transactional
    public SiteConfig criar(String chave, String valor, String descricao) {
        SiteConfig config = new SiteConfigBuilder()
                .comChave(chave)
                .comValor(valor)
                .comDescricao(descricao)
                .ativo(true)
                .build();

        return siteConfigDAO.salvar(config);
    }
}