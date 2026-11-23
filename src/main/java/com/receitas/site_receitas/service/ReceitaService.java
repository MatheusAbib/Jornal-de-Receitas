package com.receitas.site_receitas.service;

import com.receitas.site_receitas.dao.receita.IReceitaDAO;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;

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

    // Repassa pro DAO. @Transactional(readOnly=true) só pra leitura.
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

   // Repassa pro DAO. @Transactional abre transação — se falhar, rollback.
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

    public void validarPermissaoEdicao(Receita receita, Usuario logado) {
    if (logado == null) {
        throw new org.springframework.security.access.AccessDeniedException("Usuário não autenticado");
    }

    boolean ehAutor = receita.getUsuario() != null
            && receita.getUsuario().getId().equals(logado.getId());

    boolean ehAdmin = "ADMIN".equals(logado.getRole());

    if (!ehAutor && !ehAdmin) {
        throw new org.springframework.security.access.AccessDeniedException("Sem permissão para esta receita");
    }
}

public Receita buscarOuFalharAutorizado(Long id, Usuario logado) {
    Receita receita = buscarOuFalhar(id);
    validarPermissaoEdicao(receita, logado);
    return receita;
}
}