package com.receitas.site_receitas.command;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import com.receitas.site_receitas.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AprovarReceitaCommandTest {

    private ReceitaService receitaService;
    private UsuarioService usuarioService;
    private NotificacaoService notificacaoService;
    private FavoritoService favoritoService;
    private EstatisticasService estatisticasService;
    private AprovarReceitaCommand command;

    @BeforeEach
    void setUp() {
        receitaService = mock(ReceitaService.class);
        usuarioService = mock(UsuarioService.class);
        notificacaoService = mock(NotificacaoService.class);
        favoritoService = mock(FavoritoService.class);
        estatisticasService = mock(EstatisticasService.class);
    }

    @Test
    @DisplayName("Deve aprovar receita pendente e notificar autor")
    void deveAprovarReceitaPendenteENotificarAutor() {
        Usuario autor = new Usuario();
        autor.setId(1);
        autor.setRole("USER");
        Receita receita = new Receita();
        receita.setId(100L);
        receita.setTitulo("Bolo");
        receita.setStatus(StatusReceita.PENDENTE);
        receita.setUsuario(autor);

        when(receitaService.buscarPorId(100L)).thenReturn(Optional.of(receita));
        when(usuarioService.listarTodos()).thenReturn(List.of(autor));

        command = new AprovarReceitaCommand(receitaService, usuarioService, notificacaoService, favoritoService, estatisticasService, 100L);
        command.executar();

        assertThat(receita.getStatus()).isEqualTo(StatusReceita.APROVADA);
        verify(receitaService).salvar(receita);
        verify(notificacaoService, atLeastOnce()).salvar(any());
    }

    @Test
    @DisplayName("Deve retornar null quando receita nao existe")
    void deveRetornarNullQuandoReceitaNaoExiste() {
        when(receitaService.buscarPorId(999L)).thenReturn(Optional.empty());

        command = new AprovarReceitaCommand(receitaService, usuarioService, notificacaoService, favoritoService, estatisticasService, 999L);
        command.executar();

        assertThat(command.getResultado()).isNull();
        verify(receitaService, never()).salvar(any());
        verify(notificacaoService, never()).salvar(any());
    }

    @Test
    @DisplayName("Deve guardar receita aprovada como resultado")
    void deveGuardarReceitaComoResultado() {
        Usuario autor = new Usuario();
        autor.setId(1);
        autor.setRole("ADMIN");
        Receita receita = new Receita();
        receita.setId(100L);
        receita.setTitulo("Bolo");
        receita.setStatus(StatusReceita.PENDENTE);
        receita.setUsuario(autor);

        when(receitaService.buscarPorId(100L)).thenReturn(Optional.of(receita));
        when(usuarioService.listarTodos()).thenReturn(List.of(autor));

        command = new AprovarReceitaCommand(receitaService, usuarioService, notificacaoService, favoritoService, estatisticasService, 100L);
        command.executar();

        assertThat(command.getResultado()).isEqualTo(receita);
    }
}
