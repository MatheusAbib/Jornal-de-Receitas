package com.receitas.site_receitas.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;

import java.util.List;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {

    List<Receita> findByStatus(StatusReceita status);

    Page<Receita> findByStatus(StatusReceita status, Pageable pageable);

    Page<Receita> findByStatusAndTituloContainingIgnoreCase(StatusReceita status, String titulo, Pageable pageable);

    List<Receita> findByUsuarioIdOrderByIdDesc(Integer usuarioId);

    Page<Receita> findByUsuarioIdAndStatus(Integer usuarioId, StatusReceita status, Pageable pageable);

    long countByStatus(StatusReceita status);

}