package com.receitas.site_receitas.service;

import com.receitas.site_receitas.model.SiteConfig;
import com.receitas.site_receitas.repository.SiteConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SiteConfigService {
    
    @Autowired
    private SiteConfigRepository siteConfigRepository;
    
    public String getFaviconUrl() {
        return siteConfigRepository.findByChave("favicon_url")
                .map(SiteConfig::getValor)
                .orElse(null); 
    }
    
    public String getGanacheUrl() {
        return siteConfigRepository.findByChave("ganache_url")
                .map(SiteConfig::getValor)
                .orElse(null); 
    }
    
    // NOVOS MÉTODOS SEM FALLBACK:
    public String getSopaUrl() {
        return siteConfigRepository.findByChave("sopa_url")
                .map(SiteConfig::getValor)
                .orElse(null); 
    }
    
    public String getPestoUrl() {
        return siteConfigRepository.findByChave("pesto_url")
                .map(SiteConfig::getValor)
                .orElse(null); 
    }
    
    public String getBolinhoUrl() {
        return siteConfigRepository.findByChave("bolinho_url")
                .map(SiteConfig::getValor)
                .orElse(null); 
    }
    
    // Método genérico SEM FALLBACK
    public String getConfigValue(String chave) {
        return siteConfigRepository.findByChave(chave)
                .map(SiteConfig::getValor)
                .orElse(null);
    }
}