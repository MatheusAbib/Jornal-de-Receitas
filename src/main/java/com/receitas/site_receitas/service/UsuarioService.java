package com.receitas.site_receitas.service;

import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.repository.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String cadastrarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return "Email já cadastrado!";
        }
        if (usuarioRepository.existsByCpf(usuario.getCpf())) {
            return "CPF já cadastrado!";
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuario.setDataCadastro(LocalDate.now());
        usuarioRepository.save(usuario);

        return "Cadastro realizado com sucesso!";
    }

    public Optional<Usuario> findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> findById(Integer id) {
        return usuarioRepository.findById(id);
    }

    public void deleteById(Integer id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Dentro de UsuarioService
public void excluirUsuario(Integer id) {
    usuarioRepository.deleteById(id);
}

// Para ativar/desativar, precisa de um campo ativo no Usuario
public Usuario ativarDesativarUsuario(Integer id) {
    Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
    if (usuarioOpt.isPresent()) {
        Usuario usuario = usuarioOpt.get();
        // supondo que você adicione um campo 'ativo' no Usuario
        usuario.setAtivo(!usuario.isAtivo());
        return usuarioRepository.save(usuario);
    }
    return null;
}

}
