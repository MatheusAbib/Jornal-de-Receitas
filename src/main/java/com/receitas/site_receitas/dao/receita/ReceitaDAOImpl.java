package com.receitas.site_receitas.dao.receita;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ReceitaDAOImpl implements IReceitaDAO {

    @Autowired
    private ReceitaJpaRepository repository;

    @Override
    public Receita salvar(Receita receita) {
        return repository.save(receita);
    }

    @Override
    public Optional<Receita> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public boolean existe(Long id) {
        return repository.existsById(id);
    }

    @Override
    public void deletar(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<Receita> listarPorStatus(StatusReceita status) {
        return repository.findByStatus(status);
    }

    @Override
    public Page<Receita> listarPaginadoPorStatus(StatusReceita status, Pageable pageable) {
        return repository.findByStatus(status, pageable);
    }

    @Override
    public Page<Receita> listarPaginadoPorStatusEBusca(StatusReceita status, String busca, Pageable pageable) {
        if (busca == null || busca.isBlank()) {
            return repository.findByStatus(status, pageable);
        }
        return repository.findByStatusAndTituloContainingIgnoreCase(status, busca, pageable);
    }

    @Override
    public Page<Receita> listarPorUsuarioEStatus(Integer usuarioId, StatusReceita status, Pageable pageable) {
        return repository.findByUsuarioIdAndStatus(usuarioId, status, pageable);
    }

    @Override
    public long contarPorStatus(StatusReceita status) {
        return repository.countByStatus(status);
    }

    @Override
        public long contarPorUsuarioEStatus(Integer usuarioId, StatusReceita status) {
            return repository.countByUsuarioIdAndStatus(usuarioId, status);
        }
}