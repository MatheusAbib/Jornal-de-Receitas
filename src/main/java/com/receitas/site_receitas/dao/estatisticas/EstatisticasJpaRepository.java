package com.receitas.site_receitas.dao.estatisticas;

import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstatisticasJpaRepository extends JpaRepository<Estatisticas, Long> {

    Optional<Estatisticas> findByUsuario(Usuario usuario);

    Optional<Estatisticas> findByUsuarioId(Integer usuarioId);
}
