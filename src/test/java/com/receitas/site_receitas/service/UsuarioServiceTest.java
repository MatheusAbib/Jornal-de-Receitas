package com.receitas.site_receitas.service;

import com.receitas.site_receitas.dao.usuario.IUsuarioDAO;
import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UsuarioServiceTest {

    private IUsuarioDAO usuarioDAO;
    private EstatisticasService estatisticasService;
    private BCryptPasswordEncoder passwordEncoder;
    private UsuarioService usuarioService;

    @BeforeEach
    void setUp() {
        usuarioDAO = mock(IUsuarioDAO.class);
        estatisticasService = mock(EstatisticasService.class);
        passwordEncoder = new BCryptPasswordEncoder();
        usuarioService = new UsuarioService();
        ReflectionTestUtils.setField(usuarioService, "usuarioDAO", usuarioDAO);
        ReflectionTestUtils.setField(usuarioService, "estatisticasService", estatisticasService);
        ReflectionTestUtils.setField(usuarioService, "passwordEncoder", passwordEncoder);
    }

    @Test
    @DisplayName("Deve retornar mensagem quando email ja existe")
    void deveRetornarMensagemQuandoEmailJaExiste() {
        Usuario usuario = new Usuario();
        usuario.setNome("Joao");
        usuario.setEmail("joao@email.com");
        usuario.setCpf("11111111111");
        usuario.setSenha("senha123");

        when(usuarioDAO.existePorEmail("joao@email.com")).thenReturn(true);

        String resultado = usuarioService.cadastrarUsuario(usuario);

        assertThat(resultado).isEqualTo("Email já cadastrado!");
        verify(usuarioDAO, never()).salvar(any());
    }

    @Test
    @DisplayName("Deve retornar mensagem quando CPF ja existe")
    void deveRetornarMensagemQuandoCpfJaExiste() {
        Usuario usuario = new Usuario();
        usuario.setNome("Joao");
        usuario.setEmail("joao@email.com");
        usuario.setCpf("11111111111");
        usuario.setSenha("senha123");

        when(usuarioDAO.existePorEmail("joao@email.com")).thenReturn(false);
        when(usuarioDAO.existePorCpf("11111111111")).thenReturn(true);

        String resultado = usuarioService.cadastrarUsuario(usuario);

        assertThat(resultado).isEqualTo("CPF já cadastrado!");
        verify(usuarioDAO, never()).salvar(any());
    }

    @Test
    @DisplayName("Deve cadastrar usuario com sucesso e hashear senha")
    void deveCadastrarUsuarioComSucesso() {
        Usuario usuario = new Usuario();
        usuario.setNome("Joao");
        usuario.setEmail("joao@email.com");
        usuario.setCpf("11111111111");
        usuario.setSenha("senha123");
        usuario.setRole("USER");

        when(usuarioDAO.existePorEmail("joao@email.com")).thenReturn(false);
        when(usuarioDAO.existePorCpf("11111111111")).thenReturn(false);
        when(usuarioDAO.salvar(any())).thenAnswer(inv -> inv.getArgument(0));

        String resultado = usuarioService.cadastrarUsuario(usuario);

        assertThat(resultado).isEqualTo("Cadastro realizado com sucesso!");
        verify(usuarioDAO).salvar(any());
        verify(estatisticasService).criarParaUsuario(any());
    }

    @Test
    @DisplayName("Deve lancar excecao ao editar perfil com email em uso")
    void deveLancarExcecaoAoEditarPerfilComEmailEmUso() {
        Usuario usuario = new Usuario();
        usuario.setEmail("antigo@email.com");
        usuario.setSenha("hashAntigo");

        Usuario outro = new Usuario();
        outro.setEmail("novo@email.com");

        when(usuarioDAO.buscarPorEmail("antigo@email.com")).thenReturn(Optional.of(usuario));
        when(usuarioDAO.buscarPorEmail("novo@email.com")).thenReturn(Optional.of(outro));

        Map<String, String> dados = new HashMap<>();
        dados.put("email", "novo@email.com");

        assertThatThrownBy(() -> usuarioService.editarPerfil("antigo@email.com", dados))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Este email já está em uso por outro usuário");
    }

    @Test
    @DisplayName("Deve lancar excecao quando senhas nao coincidem")
    void deveLancarExcecaoQuandoSenhasNaoCoincidem() {
        Usuario usuario = new Usuario();
        usuario.setEmail("joao@email.com");
        usuario.setSenha("hashAntigo");

        when(usuarioDAO.buscarPorEmail("joao@email.com")).thenReturn(Optional.of(usuario));

        Map<String, String> dados = new HashMap<>();
        dados.put("senha", "novaSenha");
        dados.put("confirmarSenha", "outraSenha");

        assertThatThrownBy(() -> usuarioService.editarPerfil("joao@email.com", dados))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Senhas não coincidem");
    }

    @Test
    @DisplayName("Deve editar perfil com sucesso")
    void deveEditarPerfilComSucesso() {
        Usuario usuario = new Usuario();
        usuario.setId(1);
        usuario.setNome("Antigo");
        usuario.setEmail("joao@email.com");
        usuario.setSenha("hashAntigo");

        when(usuarioDAO.buscarPorEmail("joao@email.com")).thenReturn(Optional.of(usuario));
        when(usuarioDAO.salvar(any())).thenAnswer(inv -> inv.getArgument(0));

        Map<String, String> dados = new HashMap<>();
        dados.put("nome", "Novo Nome");

        usuarioService.editarPerfil("joao@email.com", dados);

        assertThat(usuario.getNome()).isEqualTo("Novo Nome");
        verify(usuarioDAO).salvar(usuario);
    }

    @Test
    @DisplayName("Deve alternar ativo do usuario")
    void deveAlternarAtivoDoUsuario() {
        Usuario usuario = new Usuario();
        usuario.setId(1);
        usuario.setAtivo(true);

        when(usuarioDAO.buscarPorId(1)).thenReturn(Optional.of(usuario));
        when(usuarioDAO.salvar(any())).thenAnswer(inv -> inv.getArgument(0));

        Usuario resultado = usuarioService.ativarDesativarUsuario(1);

        assertThat(resultado.isAtivo()).isFalse();
        verify(usuarioDAO).salvar(usuario);
    }

    @Test
    @DisplayName("Deve lancar excecao ao ativar usuario inexistente")
    void deveLancarExcecaoAoAtivarUsuarioInexistente() {
        when(usuarioDAO.buscarPorId(999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> usuarioService.ativarDesativarUsuario(999))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Usuário não encontrado");
    }
}