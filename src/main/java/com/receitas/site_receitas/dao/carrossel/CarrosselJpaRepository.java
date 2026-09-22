package com.receitas.site_receitas.dao.carrossel;

import com.receitas.site_receitas.model.CarrosselItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarrosselJpaRepository extends JpaRepository<CarrosselItem, Long> {
    
    List<CarrosselItem> findByAtivoTrueOrderByOrdemExibicaoAsc();
    
    long countByAtivoTrue();
    
    List<CarrosselItem> findByAtivo(boolean ativo);
}