package com.receitas.site_receitas.service;

import com.receitas.site_receitas.builder.UsuarioBuilder;
import com.receitas.site_receitas.dao.redefinicaosenha.IRedefinicaoSenhaDAO;
import com.receitas.site_receitas.dao.usuario.IUsuarioDAO;
import com.receitas.site_receitas.factory.UsuarioFactory;
import com.receitas.site_receitas.model.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private IUsuarioDAO usuarioDAO;

    @Autowired
    private EstatisticasService estatisticasService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private IRedefinicaoSenhaDAO redefinicaoSenhaDAO;

    @Autowired
    private EntityManager entityManager;

    @Transactional
    public String cadastrarUsuario(Usuario usuario) {
        if (usuarioDAO.existePorEmail(usuario.getEmail())) {
            return "Email já cadastrado!";
        }

        String cpf;
        try {
            cpf = normalizarCpf(usuario.getCpf());
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }

        if (cpf != null && cpfEmUso(cpf)) {
            return "CPF já cadastrado!";
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            return "Senha não pode ser vazia!";
        }

        Usuario novo = UsuarioFactory.criarCliente(
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getSenha(),
                cpf
        );

        salvarNovoUsuarioComSenha(novo);

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
            entityManager.refresh(usuario, LockModeType.PESSIMISTIC_WRITE);

            String emailAnterior = usuario.getEmail();
            String senhaAnterior = usuario.getSenha();

            usuario.editarPerfil(
                    dadosAtualizados.getNome(),
                    dadosAtualizados.getEmail(),
                    null,
                    dadosAtualizados.getTelefone(),
                    dadosAtualizados.getGenero()
            );

            if (dadosAtualizados.getCpf() != null) {
                atualizarCpf(usuario, dadosAtualizados.getCpf());
            }

            if (dadosAtualizados.getSenha() != null && !dadosAtualizados.getSenha().isEmpty()) {
                usuario.alterarSenha(passwordEncoder.encode(dadosAtualizados.getSenha()));
            }

            invalidarRedefinicaoSeCredenciaisMudaram(usuario, emailAnterior, senhaAnterior);
            usuarioDAO.salvar(usuario);
        }
    }

    @Transactional
    public void salvarUsuario(Usuario usuario) {
        usuarioDAO.salvar(usuario);
    }

    // Lista todos os usuários pro Command fazer o loop de notificação
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

        entityManager.refresh(usuario, LockModeType.PESSIMISTIC_WRITE);

        String emailAnterior = usuario.getEmail();
        String senhaAnterior = usuario.getSenha();

        if (!emailAnterior.equalsIgnoreCase(emailAtual)) {
            throw new RuntimeException("O e-mail do perfil foi alterado. Entre novamente.");
        }

        String novoEmail = dados.get("email");
        if (novoEmail != null && !novoEmail.equals(emailAnterior)) {
            Optional<Usuario> existente = usuarioDAO.buscarPorEmail(novoEmail);
            if (existente.isPresent() && !Objects.equals(existente.get().getId(), usuario.getId())) {
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

        if (dados.containsKey("cpf")) {
            atualizarCpf(usuario, dados.get("cpf"));
        }

        String novaSenha = dados.get("senha");
        if (novaSenha != null && !novaSenha.isEmpty()) {
            String confirmarSenha = dados.get("confirmarSenha");
            if (!novaSenha.equals(confirmarSenha)) {
                throw new RuntimeException("Senhas não coincidem");
            }
            usuario.alterarSenha(passwordEncoder.encode(novaSenha));
        }

        invalidarRedefinicaoSeCredenciaisMudaram(usuario, emailAnterior, senhaAnterior);
        return usuarioDAO.salvar(usuario);
    }

    public Map<String, Object> criarMapaUsuario(Usuario usuario) {
        Map<String, Object> mapa = new HashMap<>();
        mapa.put("id", usuario.getId());
        mapa.put("nome", usuario.getNome() != null ? usuario.getNome() : "");
        mapa.put("email", usuario.getEmail() != null ? usuario.getEmail() : "");
        mapa.put("cpf", usuario.getCpf() != null ? usuario.getCpf() : "");
        mapa.put("telefone", usuario.getTelefone() != null ? usuario.getTelefone() : "");
        mapa.put("genero", usuario.getGenero() != null ? usuario.getGenero() : "");
        mapa.put("dataCadastro", usuario.getDataCadastro() != null ? usuario.getDataCadastro().toString() : "");
        mapa.put("role", usuario.getRole() != null ? usuario.getRole() : "");
        mapa.put("googleVinculado", usuario.getGoogleSub() != null);
        return mapa;
    }

    @Transactional
    public Usuario cadastrarUsuarioComRetorno(Usuario usuario) {
        if (usuarioDAO.existePorEmail(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        String cpf = normalizarCpf(usuario.getCpf());
        if (cpf != null && cpfEmUso(cpf)) {
            throw new RuntimeException("CPF já cadastrado");
        }

        if (usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            throw new IllegalArgumentException("Senha não pode ser vazia");
        }

        usuario.setCpf(cpf);
        return salvarNovoUsuarioComSenha(usuario);
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

    private void invalidarRedefinicaoSeCredenciaisMudaram(
            Usuario usuario,
            String emailAnterior,
            String senhaAnterior
    ) {
        if (Objects.equals(emailAnterior, usuario.getEmail())
                && Objects.equals(senhaAnterior, usuario.getSenha())) {
            return;
        }

        LocalDateTime agora = LocalDateTime.now(ZoneOffset.UTC);

        redefinicaoSenhaDAO.buscarParaAtualizacao(usuario.getId())
                .filter(pedido -> pedido.estaDisponivel(agora))
                .ifPresent(pedido -> pedido.marcarComoUsado(agora));
    }

    private Usuario salvarNovoUsuarioComSenha(Usuario usuario) {
        usuario.alterarSenha(passwordEncoder.encode(usuario.getSenha()));
        Usuario salvo = usuarioDAO.salvar(usuario);
        estatisticasService.criarParaUsuario(salvo);
        return salvo;
    }

    private void atualizarCpf(Usuario usuario, String valor) {
        String cpf = normalizarCpf(valor);
        if (cpf == null) {
            usuario.setCpf(null);
            return;
        }

        String cpfAtual = usuario.getCpf();
        if (cpf.equals(cpfAtual) || formatarCpf(cpf).equals(cpfAtual)) {
            return;
        }

        if (cpfEmUso(cpf)) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        usuario.setCpf(cpf);
    }

    private boolean cpfEmUso(String cpf) {
        return usuarioDAO.existePorCpf(cpf) || usuarioDAO.existePorCpf(formatarCpf(cpf));
    }

    private String normalizarCpf(String cpf) {
        if (cpf == null || cpf.isBlank()) {
            return null;
        }

        String valor = cpf.trim();
        if (valor.matches("[0-9]{11}")) {
            return valor;
        }

        if (valor.matches("[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}")) {
            return valor.replace(".", "").replace("-", "");
        }

        throw new IllegalArgumentException("Informe um CPF com 11 dígitos");
    }

    private String formatarCpf(String cpf) {
        return cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "."
                + cpf.substring(6, 9) + "-" + cpf.substring(9);
    }
}