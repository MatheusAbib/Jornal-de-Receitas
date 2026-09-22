package com.receitas.site_receitas.dao.usuario;

import com.receitas.site_receitas.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UsuarioDAOImpl implements IUsuarioDAO {

    @Autowired
    private UsuarioJpaRepository repository;

    @Override
    public Usuario salvar(Usuario usuario) {
        return repository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorId(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    @Override
    public Page<Usuario> listarPaginado(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Override
    public List<Usuario> listarPorRole(String role) {
        return repository.findByRole(role);
    }

    @Override
    public boolean existePorEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public boolean existePorCpf(String cpf) {
        return repository.existsByCpf(cpf);
    }

    @Override
    public void deletar(Integer id) {
        repository.deleteById(id);
    }
}