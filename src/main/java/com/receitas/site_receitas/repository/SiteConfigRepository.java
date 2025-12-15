package com.receitas.site_receitas.repository;

import com.receitas.site_receitas.model.SiteConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SiteConfigRepository extends JpaRepository<SiteConfig, Long> {
    Optional<SiteConfig> findByChave(String chave);
}