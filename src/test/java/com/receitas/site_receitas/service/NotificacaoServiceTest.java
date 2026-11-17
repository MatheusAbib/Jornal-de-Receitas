package com.receitas.site_receitas.service;

import com.receitas.site_receitas.dao.notificacao.INotificacaoDAO;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class NotificacaoServiceTest {

    private INotificacaoDAO notificacaoDAO;
    private NotificacaoService notificacaoService;

    @BeforeEach
    void setUp() {
        notificacaoDAO = mock(INotificacaoDAO.class);
        notificacaoService = new NotificacaoService();
        ReflectionTestUtils.setField(notificacaoService, "notificacaoDAO", notificacaoDAO);
    }

    @Test
    @DisplayName("Deve contar notificacoes nao lidas")
    void deveContarNaoLidas() {
        Usuario usuario = new Usuario();
        when(notificacaoDAO.contarNaoLidasPorUsuario(usuario)).thenReturn(3L);

        long total = notificacaoService.contarNaoLidas(usuario);

        assertThat(total).isEqualTo(3L);
    }

    @Test
    @DisplayName("Deve marcar notificacao como lida")
    void deveMarcarComoLida() {
        Notificacao notificacao = new Notificacao();
        notificacao.setId(1L);
        notificacao.setLida(false);
        when(notificacaoDAO.buscarPorId(1L)).thenReturn(Optional.of(notificacao));

        notificacaoService.marcarComoLida(1L);

        assertThat(notificacao.isLida()).isTrue();
        verify(notificacaoDAO).salvar(notificacao);
    }

    @Test
    @DisplayName("Nao deve falhar ao marcar notificacao inexistente")
    void naoDeveFalharAoMarcarInexistente() {
        when(notificacaoDAO.buscarPorId(999L)).thenReturn(Optional.empty());

        notificacaoService.marcarComoLida(999L);

        verify(notificacaoDAO, never()).salvar(any());
    }

    @Test
    @DisplayName("Deve excluir todas as notificacoes do usuario")
    void deveExcluirTodas() {
        Usuario usuario = new Usuario();
        Notificacao notificacao = new Notificacao();
        List<Notificacao> notificacoes = List.of(notificacao);
        when(notificacaoDAO.listarPorUsuarioOrdenado(usuario)).thenReturn(notificacoes);

        notificacaoService.excluirTodas(usuario);

        verify(notificacaoDAO).deletarTodas(notificacoes);
    }

    @Test
    @DisplayName("Deve marcar todas as nao lidas como lidas")
    void deveMarcarTodasComoLidas() {
        Usuario usuario = new Usuario();
        Notificacao n1 = new Notificacao();
        n1.setLida(false);
        Notificacao n2 = new Notificacao();
        n2.setLida(false);
        List<Notificacao> naoLidas = List.of(n1, n2);
        when(notificacaoDAO.listarNaoLidasPorUsuario(usuario)).thenReturn(naoLidas);

        notificacaoService.marcarTodasComoLidas(usuario);

        assertThat(n1.isLida()).isTrue();
        assertThat(n2.isLida()).isTrue();
        verify(notificacaoDAO).salvarTodas(naoLidas);
    }
}
