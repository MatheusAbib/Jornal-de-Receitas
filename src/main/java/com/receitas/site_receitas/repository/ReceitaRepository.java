package com.receitas.site_receitas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.receitas.site_receitas.model.Receita;

import java.util.List;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {
    List<Receita> findByAprovadaTrue();
    List<Receita> findByAprovadaFalse();
}
