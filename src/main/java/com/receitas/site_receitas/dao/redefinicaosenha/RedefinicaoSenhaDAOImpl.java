package com.receitas.site_receitas.dao.redefinicaosenha;

import com.receitas.site_receitas.model.RedefinicaoSenha;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class RedefinicaoSenhaDAOImpl implements IRedefinicaoSenhaDAO {

    private final RedefinicaoSenhaJpaRepository repository;

    public RedefinicaoSenhaDAOImpl(RedefinicaoSenhaJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public RedefinicaoSenha salvar(RedefinicaoSenha pedido) {
        return repository.save(pedido);
    }

    @Override
    public Optional<Integer> buscarUsuarioIdPorTokenHash(String tokenHash) {
        return repository.buscarUsuarioIdPorTokenHash(tokenHash);
    }

    @Override
    public Optional<RedefinicaoSenha> buscarParaAtualizacao(Integer usuarioId) {
        return repository.buscarParaAtualizacao(usuarioId);
    }
}