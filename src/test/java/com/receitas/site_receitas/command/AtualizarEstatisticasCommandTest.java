package com.receitas.site_receitas.command;

import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AtualizarEstatisticasCommandTest {

    private ReceitaService receitaService;
    private FavoritoService favoritoService;
    private EstatisticasService estatisticasService;
    private NotificacaoService notificacaoService;
    private AtualizarEstatisticasCommand command;

    @BeforeEach
    void setUp() {
        receitaService = mock(ReceitaService.class);
        favoritoService = mock(FavoritoService.class);
        estatisticasService = mock(EstatisticasService.class);
        notificacaoService = mock(NotificacaoService.class);
    }

    @Test
    @DisplayName("Deve retornar null quando usuario eh nulo")
    void deveRetornarNullQuandoUsuarioNulo() {
        command = new AtualizarEstatisticasCommand(receitaService, favoritoService, estatisticasService, notificacaoService, null);
        command.executar();

        assertThat(command.getResultado()).isNull();
        verify(estatisticasService, never()).atualizar(any());
    }

    @Test
    @DisplayName("Deve criar estatisticas novas quando nao existem")
    void deveCriarEstatisticasNovas() {
        Usuario usuario = new Usuario();
        usuario.setId(1);

        when(estatisticasService.buscarPorUsuario(usuario)).thenReturn(Optional.empty());
        when(receitaService.contarPorUsuarioEStatus(1, StatusReceita.PENDENTE)).thenReturn(2L);
        when(receitaService.contarPorUsuarioEStatus(1, StatusReceita.APROVADA)).thenReturn(3L);
        when(receitaService.contarPorUsuarioEStatus(1, StatusReceita.REJEITADA)).thenReturn(1L);
        when(favoritoService.listarPorUsuario(usuario)).thenReturn(new ArrayList<>());
        when(notificacaoService.contarPorUsuario(usuario)).thenReturn(5L);
        when(estatisticasService.atualizar(any())).thenAnswer(inv -> inv.getArgument(0));

        command = new AtualizarEstatisticasCommand(receitaService, favoritoService, estatisticasService, notificacaoService, usuario);
        command.executar();

        Estatisticas resultado = (Estatisticas) command.getResultado();
        assertThat(resultado).isNotNull();
        assertThat(resultado.getTotalReceitas()).isEqualTo(6);
        assertThat(resultado.getReceitasAprovadas()).isEqualTo(3);
        assertThat(resultado.getReceitasRejeitadas()).isEqualTo(1);
        assertThat(resultado.getReceitasPendentes()).isEqualTo(2);
        verify(estatisticasService).atualizar(any());
    }

    @Test
    @DisplayName("Deve atualizar estatisticas existentes")
    void deveAtualizarEstatisticasExistentes() {
        Usuario usuario = new Usuario();
        usuario.setId(1);
        Estatisticas existente = new Estatisticas();
        existente.setUsuario(usuario);

        when(estatisticasService.buscarPorUsuario(usuario)).thenReturn(Optional.of(existente));
        when(receitaService.contarPorUsuarioEStatus(1, StatusReceita.PENDENTE)).thenReturn(1L);
        when(receitaService.contarPorUsuarioEStatus(1, StatusReceita.APROVADA)).thenReturn(2L);
        when(receitaService.contarPorUsuarioEStatus(1, StatusReceita.REJEITADA)).thenReturn(0L);
        when(favoritoService.listarPorUsuario(usuario)).thenReturn(new ArrayList<>());
        when(notificacaoService.contarPorUsuario(usuario)).thenReturn(3L);
        when(estatisticasService.atualizar(any())).thenAnswer(inv -> inv.getArgument(0));

        command = new AtualizarEstatisticasCommand(receitaService, favoritoService, estatisticasService, notificacaoService, usuario);
        command.executar();

        Estatisticas resultado = (Estatisticas) command.getResultado();
        assertThat(resultado.getTotalReceitas()).isEqualTo(3);
        assertThat(resultado.getTotalNotificacoes()).isEqualTo(3);
    }
}