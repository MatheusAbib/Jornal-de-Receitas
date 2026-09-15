package com.receitas.site_receitas.repository;

import com.receitas.site_receitas.model.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByRole(String role);

    Page<Usuario> findAll(Pageable pageable);
}