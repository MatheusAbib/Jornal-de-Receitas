package com.receitas.site_receitas.dao.usuario;

import com.receitas.site_receitas.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IUsuarioDAO {

    Usuario salvar(Usuario usuario);

    Optional<Usuario> buscarPorId(Integer id);

    Optional<Usuario> buscarPorEmail(String email);

    List<Usuario> listarTodos();

    Page<Usuario> listarPaginado(Pageable pageable);

    List<Usuario> listarPorRole(String role);

    boolean existePorEmail(String email);

    boolean existePorCpf(String cpf);

    void deletar(Integer id);
}