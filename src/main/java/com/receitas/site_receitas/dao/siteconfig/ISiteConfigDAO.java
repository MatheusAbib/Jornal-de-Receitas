package com.receitas.site_receitas.dao.siteconfig;

import com.receitas.site_receitas.model.SiteConfig;

import java.util.List;
import java.util.Optional;

public interface ISiteConfigDAO {

    SiteConfig salvar(SiteConfig config);

    Optional<SiteConfig> buscarPorId(Long id);

    Optional<SiteConfig> buscarPorChave(String chave);

    List<SiteConfig> listarTodas();

    boolean existe(Long id);

    void deletar(Long id);
}