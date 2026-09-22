package com.receitas.site_receitas.service;

import com.receitas.site_receitas.dao.receita.IReceitaDAO;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReceitaService {

    @Autowired
    private IReceitaDAO receitaDAO;

    @Transactional(readOnly = true)
    public List<Receita> listarAprovadas() {
        return receitaDAO.listarPorStatus(StatusReceita.APROVADA);
    }

    @Transactional(readOnly = true)
    public Page<Receita> listarPorStatus(StatusReceita status, Pageable pageable) {
        return receitaDAO.listarPaginadoPorStatus(status, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Receita> listarPorStatusEBusca(StatusReceita status, String busca, Pageable pageable) {
        return receitaDAO.listarPaginadoPorStatusEBusca(status, busca, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Receita> listarPorUsuarioEStatus(Integer usuarioId, StatusReceita status, Pageable pageable) {
        return receitaDAO.listarPorUsuarioEStatus(usuarioId, status, pageable);
    }

    @Transactional(readOnly = true)
    public long contarPorStatus(StatusReceita status) {
        return receitaDAO.contarPorStatus(status);
    }

    @Transactional(readOnly = true)
    public Optional<Receita> buscarPorId(Long id) {
        return receitaDAO.buscarPorId(id);
    }

    @Transactional(readOnly = true)
    public Receita buscarOuFalhar(Long id) {
        return receitaDAO.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Receita não encontrada"));
    }

    @Transactional(readOnly = true)
    public boolean existe(Long id) {
        return receitaDAO.existe(id);
    }

    @Transactional
    public Receita salvar(Receita receita) {
        return receitaDAO.salvar(receita);
    }

    @Transactional
    public void excluir(Long id) {
        if (!receitaDAO.existe(id)) {
            throw new RuntimeException("Receita não encontrada");
        }
        receitaDAO.deletar(id);
    }

    @Transactional(readOnly = true)
    public long contarPorUsuarioEStatus(Integer usuarioId, StatusReceita status) {
        return receitaDAO.contarPorUsuarioEStatus(usuarioId, status);
    }
}