package com.receitas.site_receitas.dao.siteconfig;

import com.receitas.site_receitas.model.SiteConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class SiteConfigDAOImpl implements ISiteConfigDAO {

    @Autowired
    private SiteConfigJpaRepository repository;

    @Override
    public SiteConfig salvar(SiteConfig config) {
        return repository.save(config);
    }

    @Override
    public Optional<SiteConfig> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public Optional<SiteConfig> buscarPorChave(String chave) {
        return repository.findByChave(chave);
    }

    @Override
    public List<SiteConfig> listarTodas() {
        return repository.findAll();
    }

    @Override
    public boolean existe(Long id) {
        return repository.existsById(id);
    }

    @Override
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}