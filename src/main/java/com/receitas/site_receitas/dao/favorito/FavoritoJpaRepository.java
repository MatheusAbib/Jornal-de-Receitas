package com.receitas.site_receitas.dao.favorito;

import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoJpaRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuario(Usuario usuario);

    Optional<Favorito> findByUsuarioAndReceita(Usuario usuario, Receita receita);

    void deleteByUsuarioAndReceita(Usuario usuario, Receita receita);

    boolean existsByUsuarioAndReceita(Usuario usuario, Receita receita);

    void deleteByReceita(Receita receita);

    long countByReceita(Receita receita);

    long countByReceita_Usuario_Id(Integer usuarioId);
}