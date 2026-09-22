package com.receitas.site_receitas.dao.receita;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IReceitaDAO {

    Receita salvar(Receita receita);

    Optional<Receita> buscarPorId(Long id);

    boolean existe(Long id);

    void deletar(Long id);

    List<Receita> listarPorStatus(StatusReceita status);

    Page<Receita> listarPaginadoPorStatus(StatusReceita status, Pageable pageable);

    Page<Receita> listarPaginadoPorStatusEBusca(StatusReceita status, String busca, Pageable pageable);

    Page<Receita> listarPorUsuarioEStatus(Integer usuarioId, StatusReceita status, Pageable pageable);

    long contarPorStatus(StatusReceita status);

    long contarPorUsuarioEStatus(Integer usuarioId, StatusReceita status);
}