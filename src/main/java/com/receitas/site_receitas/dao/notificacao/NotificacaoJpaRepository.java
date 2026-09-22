package com.receitas.site_receitas.dao.notificacao;

import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoJpaRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByUsuarioOrderByDataHoraDesc(Usuario usuario);

    List<Notificacao> findByUsuarioAndLidaFalseOrderByDataHoraDesc(Usuario usuario);

    long countByUsuarioAndLidaFalse(Usuario usuario);

    long countByUsuario(Usuario usuario);
}