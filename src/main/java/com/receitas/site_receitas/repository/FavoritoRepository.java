package com.receitas.site_receitas.repository;

import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuario(Usuario usuario);

    Optional<Favorito> findByUsuarioAndReceita(Usuario usuario, Receita receita);

    void deleteByUsuarioAndReceita(Usuario usuario, Receita receita);

    boolean existsByUsuarioAndReceita(Usuario usuario, Receita receita);

    void deleteByReceita(Receita receita);
}