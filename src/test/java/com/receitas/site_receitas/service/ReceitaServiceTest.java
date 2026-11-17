package com.receitas.site_receitas.service;

import com.receitas.site_receitas.dao.receita.IReceitaDAO;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class ReceitaServiceTest {

    private IReceitaDAO receitaDAO;
    private ReceitaService receitaService;

    @BeforeEach
    void setUp() {
        receitaDAO = mock(IReceitaDAO.class);
        receitaService = new ReceitaService();
        ReflectionTestUtils.setField(receitaService, "receitaDAO", receitaDAO);
    }

    @Test
    @DisplayName("Deve lancar excecao ao excluir receita inexistente")
    void deveLancarExcecaoAoExcluirInexistente() {
        when(receitaDAO.existe(999L)).thenReturn(false);

        assertThatThrownBy(() -> receitaService.excluir(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Receita não encontrada");

        verify(receitaDAO, never()).deletar(any());
    }

    @Test
    @DisplayName("Deve excluir receita existente")
    void deveExcluirReceitaExistente() {
        when(receitaDAO.existe(1L)).thenReturn(true);

        receitaService.excluir(1L);

        verify(receitaDAO).deletar(1L);
    }

    @Test
    @DisplayName("Deve lancar excecao ao buscarOuFalhar receita inexistente")
    void deveLancarExcecaoAoBuscarOuFalharInexistente() {
        when(receitaDAO.buscarPorId(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> receitaService.buscarOuFalhar(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Receita não encontrada");
    }

    @Test
    @DisplayName("Deve retornar receita ao buscarOuFalhar existente")
    void deveRetornarReceitaAoBuscarOuFalhar() {
        Receita receita = new Receita();
        receita.setStatus(StatusReceita.APROVADA);
        when(receitaDAO.buscarPorId(1L)).thenReturn(Optional.of(receita));

        Receita encontrada = receitaService.buscarOuFalhar(1L);

        assertThat(encontrada).isEqualTo(receita);
    }
}
