package com.receitas.site_receitas.dao.redefinicaosenha;

import com.receitas.site_receitas.model.RedefinicaoSenha;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RedefinicaoSenhaJpaRepository
        extends JpaRepository<RedefinicaoSenha, Integer> {

    @Query("""
            select pedido.usuarioId
            from RedefinicaoSenha pedido
            where pedido.tokenHash = :tokenHash
            """)
    Optional<Integer> buscarUsuarioIdPorTokenHash(@Param("tokenHash") String tokenHash);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            select pedido
            from RedefinicaoSenha pedido
            where pedido.usuarioId = :usuarioId
            """)
    Optional<RedefinicaoSenha> buscarParaAtualizacao(@Param("usuarioId") Integer usuarioId);
}