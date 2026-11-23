package com.receitas.site_receitas.command;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import com.receitas.site_receitas.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AprovarReceitaCommandTest {

    private ReceitaService receitaService;
    private UsuarioService usuarioService;
    private NotificacaoService notificacaoService;
    private FavoritoService favoritoService;
    private EstatisticasService estatisticasService;
    private TransactionTemplate transactionTemplate;

    @BeforeEach
    void setUp() {
        receitaService = mock(ReceitaService.class);
        usuarioService = mock(UsuarioService.class);
        notificacaoService = mock(NotificacaoService.class);
        favoritoService = mock(FavoritoService.class);
        estatisticasService = mock(EstatisticasService.class);
        transactionTemplate = new TransactionTemplate(mock(PlatformTransactionManager.class));
    }

    @Test
    void deveAprovarReceitaPendente() {
        Usuario autor = new Usuario();
        autor.setId(1);
        autor.setRole("USER");

        Receita receita = new Receita();
        receita.setId(10L);
        receita.setTitulo("Bolo");
        receita.setUsuario(autor);
        receita.setStatus(Receita.StatusReceita.PENDENTE);

        when(receitaService.buscarPorId(10L)).thenReturn(Optional.of(receita));
        when(usuarioService.listarTodos()).thenReturn(List.of(autor));

        AprovarReceitaCommand command = new AprovarReceitaCommand(
                receitaService,
                usuarioService,
                notificacaoService,
                favoritoService,
                estatisticasService,
                transactionTemplate,
                10L
        );
        command.executar();

        assertThat(receita.getStatus()).isEqualTo(Receita.StatusReceita.APROVADA);
        verify(receitaService).salvar(receita);
        assertThat(command.getResultado()).isEqualTo(receita);
    }

    @Test
    void deveRetornarNullQuandoReceitaNaoExiste() {
        when(receitaService.buscarPorId(99L)).thenReturn(Optional.empty());

        AprovarReceitaCommand command = new AprovarReceitaCommand(
                receitaService,
                usuarioService,
                notificacaoService,
                favoritoService,
                estatisticasService,
                transactionTemplate,
                99L
        );
        command.executar();

        assertThat(command.getResultado()).isNull();
        verify(receitaService, never()).salvar(any());
    }

    @Test
    void deveLancarExcecaoAoAprovarReceitaJaAprovada() {
        Receita receita = new Receita();
        receita.setId(10L);
        receita.setStatus(Receita.StatusReceita.APROVADA);

        when(receitaService.buscarPorId(10L)).thenReturn(Optional.of(receita));

        AprovarReceitaCommand command = new AprovarReceitaCommand(
                receitaService,
                usuarioService,
                notificacaoService,
                favoritoService,
                estatisticasService,
                transactionTemplate,
                10L
        );

        assertThrows(IllegalStateException.class, command::executar);
    }
}