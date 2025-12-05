package com.receitas.site_receitas.repository;

import com.receitas.site_receitas.model.CarrosselItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarrosselRepository extends JpaRepository<CarrosselItem, Long> {
    
    // Encontrar itens ativos ordenados por ordem de exibição
    List<CarrosselItem> findByAtivoTrueOrderByOrdemExibicaoAsc();
    
    // Contar itens ativos
    long countByAtivoTrue();
    
    // Encontrar por status de ativo
    List<CarrosselItem> findByAtivo(boolean ativo);
}