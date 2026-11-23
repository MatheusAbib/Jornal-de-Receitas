package com.receitas.site_receitas.command;

import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.ReceitaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AtualizarEstatisticasCommandTest {

    private ReceitaService receitaService;
    private FavoritoService favoritoService;
    private EstatisticasService estatisticasService;

    @BeforeEach
    void setUp() {
        receitaService = mock(ReceitaService.class);
        favoritoService = mock(FavoritoService.class);
        estatisticasService = mock(EstatisticasService.class);
    }

    @Test
    void deveRetornarNullQuandoUsuarioNulo() {
        AtualizarEstatisticasCommand command = new AtualizarEstatisticasCommand(
                receitaService, favoritoService, estatisticasService, null
        );
        command.executar();

        assertThat(command.getResultado()).isNull();
        verifyNoInteractions(receitaService, favoritoService, estatisticasService);
    }

    @Test
    void deveRecalcularEstatisticasDoUsuario() {
        Usuario usuario = new Usuario();
        usuario.setId(1);

        when(receitaService.contarPorUsuarioEStatus(eq(1), eq(Receita.StatusReceita.PENDENTE))).thenReturn(2L);
        when(receitaService.contarPorUsuarioEStatus(eq(1), eq(Receita.StatusReceita.APROVADA))).thenReturn(5L);
        when(receitaService.contarPorUsuarioEStatus(eq(1), eq(Receita.StatusReceita.REJEITADA))).thenReturn(1L);
        when(favoritoService.listarPorUsuario(usuario)).thenReturn(List.of());

        Estatisticas est = new Estatisticas();
        when(estatisticasService.recalcular(eq(usuario), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt()))
                .thenReturn(est);

        AtualizarEstatisticasCommand command = new AtualizarEstatisticasCommand(
                receitaService, favoritoService, estatisticasService, usuario
        );
        command.executar();

        assertThat(command.getResultado()).isEqualTo(est);
        verify(estatisticasService).recalcular(usuario, 8, 5, 1, 2, 0, 0);
    }

    @Test
    void deveCriarEstatisticasQuandoNaoExistem() {
        Usuario usuario = new Usuario();
        usuario.setId(2);

        when(receitaService.contarPorUsuarioEStatus(anyInt(), any())).thenReturn(0L);
        when(favoritoService.listarPorUsuario(usuario)).thenReturn(List.of());

        Estatisticas est = new Estatisticas();
        when(estatisticasService.recalcular(eq(usuario), anyInt(), anyInt(), anyInt(), anyInt(), anyInt(), anyInt()))
                .thenReturn(est);

        AtualizarEstatisticasCommand command = new AtualizarEstatisticasCommand(
                receitaService, favoritoService, estatisticasService, usuario
        );
        command.executar();

        assertThat(command.getResultado()).isEqualTo(est);
    }
}