package com.receitas.site_receitas.service;

import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UsuarioService usuarioService;
    private BCryptPasswordEncoder passwordEncoder;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        usuarioService = mock(UsuarioService.class);
        passwordEncoder = Mockito.mock(BCryptPasswordEncoder.class);
        authService = new AuthService(usuarioService, passwordEncoder);
    }

    @Test
    @DisplayName("Deve lancar excecao quando usuario nao existe")
    void deveLancarExcecaoQuandoUsuarioNaoExiste() {
        when(usuarioService.findByEmail("naoexiste@email.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.autenticar("naoexiste@email.com", "senha"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Usuário não encontrado");
    }

    @Test
    @DisplayName("Deve lancar excecao quando senha incorreta")
    void deveLancarExcecaoQuandoSenhaIncorreta() {
        Usuario usuario = new Usuario();
        usuario.setEmail("joao@email.com");
        usuario.setSenha("hashCorreto");

        when(usuarioService.findByEmail("joao@email.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senhaErrada", "hashCorreto")).thenReturn(false);

        assertThatThrownBy(() -> authService.autenticar("joao@email.com", "senhaErrada"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Senha incorreta");
    }

    @Test
    @DisplayName("Deve autenticar com sucesso")
    void deveAutenticarComSucesso() {
        Usuario usuario = new Usuario();
        usuario.setEmail("joao@email.com");
        usuario.setSenha("hashCorreto");

        when(usuarioService.findByEmail("joao@email.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha123", "hashCorreto")).thenReturn(true);

        Usuario resultado = authService.autenticar("joao@email.com", "senha123");

        assertThat(resultado).isEqualTo(usuario);
    }

    @Test
    @DisplayName("Deve limpar contexto no logout")
    void deveLimparContextoNoLogout() {
        jakarta.servlet.http.HttpSession session = mock(jakarta.servlet.http.HttpSession.class);

        authService.logout(session);

        verify(session).invalidate();
    }
}