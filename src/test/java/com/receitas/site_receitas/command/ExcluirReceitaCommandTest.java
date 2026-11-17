package com.receitas.site_receitas.command;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import com.receitas.site_receitas.service.UploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ExcluirReceitaCommandTest {

    private ReceitaService receitaService;
    private NotificacaoService notificacaoService;
    private FavoritoService favoritoService;
    private EstatisticasService estatisticasService;
    private UploadService uploadService;
    private ExcluirReceitaCommand command;

    @BeforeEach
    void setUp() {
        receitaService = mock(ReceitaService.class);
        notificacaoService = mock(NotificacaoService.class);
        favoritoService = mock(FavoritoService.class);
        estatisticasService = mock(EstatisticasService.class);
        uploadService = mock(UploadService.class);
    }

    @Test
    @DisplayName("Deve excluir receita e remover imagem")
    void deveExcluirReceitaERemoverImagem() {
        Usuario autor = new Usuario();
        autor.setId(1);
        Receita receita = new Receita();
        receita.setId(100L);
        receita.setTitulo("Bolo");
        receita.setImagem("bolo.jpg");
        receita.setStatus(StatusReceita.APROVADA);
        receita.setUsuario(autor);

        when(receitaService.buscarPorId(100L)).thenReturn(Optional.of(receita));

        command = new ExcluirReceitaCommand(receitaService, notificacaoService, favoritoService, estatisticasService, uploadService, 100L);
        command.executar();

        verify(uploadService).excluirImagem("bolo.jpg");
        verify(receitaService).excluir(100L);
        verify(notificacaoService, atLeastOnce()).salvar(any());
    }

    @Test
    @DisplayName("Deve retornar null quando receita nao existe")
    void deveRetornarNullQuandoReceitaNaoExiste() {
        when(receitaService.buscarPorId(999L)).thenReturn(Optional.empty());

        command = new ExcluirReceitaCommand(receitaService, notificacaoService, favoritoService, estatisticasService, uploadService, 999L);
        command.executar();

        assertThat(command.getResultado()).isNull();
        verify(receitaService, never()).excluir(any());
        verify(uploadService, never()).excluirImagem(any());
    }
}
