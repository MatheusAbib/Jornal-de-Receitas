package com.receitas.site_receitas.dao.estatisticas;

import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Usuario;

import java.util.Optional;

public interface IEstatisticasDAO {

    Estatisticas salvar(Estatisticas estatisticas);

    Optional<Estatisticas> buscarPorId(Long id);

    Optional<Estatisticas> buscarPorUsuario(Usuario usuario);

    Optional<Estatisticas> buscarPorUsuarioId(Integer usuarioId);

    boolean existe(Long id);

    void deletar(Long id);
}
