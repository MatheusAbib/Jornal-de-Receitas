package com.receitas.site_receitas.dao.redefinicaosenha;

import com.receitas.site_receitas.model.RedefinicaoSenha;

import java.util.Optional;

public interface IRedefinicaoSenhaDAO {

    RedefinicaoSenha salvar(RedefinicaoSenha pedido);

    Optional<Integer> buscarUsuarioIdPorTokenHash(String tokenHash);

    Optional<RedefinicaoSenha> buscarParaAtualizacao(Integer usuarioId);
}