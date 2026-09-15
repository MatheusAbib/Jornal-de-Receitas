package com.receitas.site_receitas.repository;

import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    List<Notificacao> findByUsuarioOrderByDataHoraDesc(Usuario usuario);

    List<Notificacao> findByUsuarioAndLidaFalseOrderByDataHoraDesc(Usuario usuario);

    long countByUsuarioAndLidaFalse(Usuario usuario);
}