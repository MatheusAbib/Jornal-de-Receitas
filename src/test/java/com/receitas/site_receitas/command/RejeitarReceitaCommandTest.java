package com.receitas.site_receitas.command;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RejeitarReceitaCommandTest {

    private ReceitaService receitaService;
    private NotificacaoService notificacaoService;
    private FavoritoService favoritoService;
    private EstatisticasService estatisticasService;
    private RejeitarReceitaCommand command;

    @BeforeEach
    void setUp() {
        receitaService = mock(ReceitaService.class);
        notificacaoService = mock(NotificacaoService.class);
        favoritoService = mock(FavoritoService.class);
        estatisticasService = mock(EstatisticasService.class);
    }

    @Test
    @DisplayName("Deve rejeitar receita pendente e notificar autor")
    void deveRejeitarReceitaPendenteENotificarAutor() {
        Usuario autor = new Usuario();
        autor.setId(1);
        Receita receita = new Receita();
        receita.setId(100L);
        receita.setTitulo("Bolo");
        receita.setStatus(StatusReceita.PENDENTE);
        receita.setUsuario(autor);

        when(receitaService.buscarPorId(100L)).thenReturn(Optional.of(receita));

        command = new RejeitarReceitaCommand(receitaService, notificacaoService, favoritoService, estatisticasService, 100L, "Imagem ruim");
        command.executar();

        assertThat(receita.getStatus()).isEqualTo(StatusReceita.REJEITADA);
        assertThat(receita.getMotivoRejeicao()).isEqualTo("Imagem ruim");
        verify(receitaService).salvar(receita);
        verify(notificacaoService, atLeastOnce()).salvar(any());
    }

    @Test
    @DisplayName("Deve retornar null quando receita nao existe")
    void deveRetornarNullQuandoReceitaNaoExiste() {
        when(receitaService.buscarPorId(999L)).thenReturn(Optional.empty());

        command = new RejeitarReceitaCommand(receitaService, notificacaoService, favoritoService, estatisticasService, 999L, "Motivo");
        command.executar();

        assertThat(command.getResultado()).isNull();
        verify(receitaService, never()).salvar(any());
    }
}
