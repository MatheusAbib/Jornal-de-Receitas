package com.receitas.site_receitas.service;

import com.receitas.site_receitas.builder.UsuarioBuilder;
import com.receitas.site_receitas.dao.usuario.IUsuarioDAO;
import com.receitas.site_receitas.factory.UsuarioFactory;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class UsuarioService {

    @Autowired
    private IUsuarioDAO usuarioDAO;

    @Autowired
    private EstatisticasService estatisticasService;

   @Autowired
    private BCryptPasswordEncoder passwordEncoder;

@Transactional
public String cadastrarUsuario(Usuario usuario) {
    if (usuarioDAO.existePorEmail(usuario.getEmail())) {
        return "Email já cadastrado!";
    }
    if (usuarioDAO.existePorCpf(usuario.getCpf())) {
        return "CPF já cadastrado!";
    }

    Usuario novo = "ADMIN".equals(usuario.getRole())
            ? UsuarioFactory.criarAdmin(usuario.getNome(), usuario.getEmail(), usuario.getSenha(), usuario.getCpf())
            : UsuarioFactory.criarCliente(usuario.getNome(), usuario.getEmail(), usuario.getSenha(), usuario.getCpf());

    novo.alterarSenha(passwordEncoder.encode(novo.getSenha()));
    Usuario salvo = usuarioDAO.salvar(novo);

    estatisticasService.criarParaUsuario(salvo);

    return "Cadastro realizado com sucesso!";
}

    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        return usuarioDAO.buscarPorEmail(email);
    }

    @Transactional(readOnly = true)
    public List<Usuario> findAll() {
        return usuarioDAO.listarTodos();
    }

    @Transactional(readOnly = true)
    public Page<Usuario> findAll(Pageable pageable) {
        return usuarioDAO.listarPaginado(pageable);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> findById(Integer id) {
        return usuarioDAO.buscarPorId(id);
    }

    @Transactional
    public void deleteById(Integer id) {
        usuarioDAO.deletar(id);
    }

    @Transactional
    public Usuario save(Usuario usuario) {
        return usuarioDAO.salvar(usuario);
    }

    @Transactional
    public void excluirUsuario(Integer id) {
        usuarioDAO.deletar(id);
    }

    public Usuario ativarDesativarUsuario(Integer id) {
        Usuario usuario = usuarioDAO.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.alternarAtivo();
        return usuarioDAO.salvar(usuario);
    }

    @Transactional
    public void atualizarUsuario(Integer id, Usuario dadosAtualizados) {
        Optional<Usuario> optional = usuarioDAO.buscarPorId(id);
        if (optional.isPresent()) {
            Usuario usuario = optional.get();

            usuario.editarPerfil(
                dadosAtualizados.getNome(),
                dadosAtualizados.getEmail(),
                dadosAtualizados.getCpf(),
                dadosAtualizados.getTelefone(),
                dadosAtualizados.getGenero()
            );

            if (dadosAtualizados.getSenha() != null && !dadosAtualizados.getSenha().isEmpty()) {
                usuario.alterarSenha(passwordEncoder.encode(dadosAtualizados.getSenha()));
            }

            usuarioDAO.salvar(usuario);
        }
    }

    @Transactional
    public void salvarUsuario(Usuario usuario) {
        usuarioDAO.salvar(usuario);
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioDAO.listarTodos();
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarPorRole(String role) {
        return usuarioDAO.listarPorRole(role);
    }

@Transactional
public Usuario editarPerfil(String emailAtual, Map<String, String> dados) {
    Usuario usuario = usuarioDAO.buscarPorEmail(emailAtual)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    String novoEmail = dados.get("email");
    if (novoEmail != null && !novoEmail.equals(emailAtual)) {
        Optional<Usuario> existente = usuarioDAO.buscarPorEmail(novoEmail);
        if (existente.isPresent()) {
            throw new RuntimeException("Este email já está em uso por outro usuário");
        }
    }

    usuario.editarPerfil(
            dados.get("nome"),
            dados.get("email"),
            null,
            dados.get("telefone"),
            dados.get("genero")
    );

    if (dados.containsKey("senha") && dados.get("senha") != null && !dados.get("senha").isEmpty()) {
        String novaSenha = dados.get("senha");
        String confirmarSenha = dados.get("confirmarSenha");
        if (!novaSenha.equals(confirmarSenha)) {
            throw new RuntimeException("Senhas não coincidem");
        }
        usuario.alterarSenha(passwordEncoder.encode(novaSenha));
    }

    return usuarioDAO.salvar(usuario);
}

public Map<String, Object> criarMapaUsuario(Usuario usuario) {
    Map<String, Object> mapa = new java.util.HashMap<>();
    mapa.put("id", usuario.getId());
    mapa.put("nome", usuario.getNome() != null ? usuario.getNome() : "");
    mapa.put("email", usuario.getEmail() != null ? usuario.getEmail() : "");
    mapa.put("cpf", usuario.getCpf() != null ? usuario.getCpf() : "");
    mapa.put("telefone", usuario.getTelefone() != null ? usuario.getTelefone() : "");
    mapa.put("genero", usuario.getGenero() != null ? usuario.getGenero() : "");
    mapa.put("dataCadastro", usuario.getDataCadastro() != null ? usuario.getDataCadastro().toString() : "");
    mapa.put("role", usuario.getRole() != null ? usuario.getRole() : "");
    return mapa;
}

@Transactional
public Usuario cadastrarUsuarioComRetorno(Usuario usuario) {
    if (usuarioDAO.existePorEmail(usuario.getEmail())) {
        throw new RuntimeException("Email já cadastrado");
    }
    if (usuarioDAO.existePorCpf(usuario.getCpf())) {
        throw new RuntimeException("CPF já cadastrado");
    }

    usuario.alterarSenha(passwordEncoder.encode(usuario.getSenha()));
    Usuario salvo = usuarioDAO.salvar(usuario);
    estatisticasService.criarParaUsuario(salvo);
    return salvo;
}

@Transactional
public Usuario criarUsuario(String nome, String email, String senha, String cpf) {
    Usuario usuario = new UsuarioBuilder()
            .comNome(nome)
            .comEmail(email)
            .comSenha(senha)
            .comCpf(cpf)
            .comDataCadastro(LocalDate.now())
            .ativo(true)
            .comoCliente()
            .build();

    return cadastrarUsuarioComRetorno(usuario);
}
    

}