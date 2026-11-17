package com.receitas.site_receitas.service;

import com.receitas.site_receitas.dao.carrossel.ICarrosselDAO;
import com.receitas.site_receitas.model.CarrosselItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class CarrosselServiceTest {

    private ICarrosselDAO carrosselDAO;
    private CarrosselService carrosselService;

    @BeforeEach
    void setUp() {
        carrosselDAO = mock(ICarrosselDAO.class);
        carrosselService = new CarrosselService();
        ReflectionTestUtils.setField(carrosselService, "carrosselDAO", carrosselDAO);
    }

    @Test
    @DisplayName("Deve alternar ativo do item do carrossel")
    void deveAlternarAtivo() {
        CarrosselItem item = new CarrosselItem();
        item.setAtivo(true);
        when(carrosselDAO.buscarPorId(1L)).thenReturn(Optional.of(item));
        when(carrosselDAO.salvar(item)).thenReturn(item);

        CarrosselItem resultado = carrosselService.alternarAtivo(1L);

        assertThat(resultado.isAtivo()).isFalse();
        verify(carrosselDAO).salvar(item);
    }

    @Test
    @DisplayName("Deve lancar excecao ao alternar item inexistente")
    void deveLancarExcecaoAoAlternarInexistente() {
        when(carrosselDAO.buscarPorId(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> carrosselService.alternarAtivo(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Item do carrossel não encontrado");
    }

    @Test
    @DisplayName("Deve lancar excecao ao excluir item inexistente")
    void deveLancarExcecaoAoExcluirInexistente() {
        when(carrosselDAO.existe(999L)).thenReturn(false);

        assertThatThrownBy(() -> carrosselService.excluir(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Item do carrossel não encontrado");

        verify(carrosselDAO, never()).deletar(any());
    }

    @Test
    @DisplayName("Deve salvar item sem ordem definindo proxima ordem")
    void deveSalvarItemSemOrdem() {
        CarrosselItem item = new CarrosselItem();
        item.setTitulo("Novo");
        item.setImagemUrl("img.jpg");
        item.setOrdemExibicao(null);

        when(carrosselDAO.contarAtivos()).thenReturn(3L);
        when(carrosselDAO.salvar(any())).thenAnswer(inv -> inv.getArgument(0));

        CarrosselItem salvo = carrosselService.salvar(item);

        assertThat(salvo.getOrdemExibicao()).isEqualTo(4);
        assertThat(salvo.isAtivo()).isTrue();
    }

    @Test
    @DisplayName("Deve fazer swap de ordem ao atualizar com ordem conflitante")
    void deveFazerSwapDeOrdem() {
        CarrosselItem existente = new CarrosselItem();
        existente.setId(1L);
        existente.setTitulo("Item 1");
        existente.setOrdemExibicao(1);

        CarrosselItem conflitante = new CarrosselItem();
        conflitante.setId(2L);
        conflitante.setTitulo("Item 2");
        conflitante.setOrdemExibicao(2);

        CarrosselItem dados = new CarrosselItem();
        dados.setTitulo("Item 1 atualizado");
        dados.setOrdemExibicao(2);

        when(carrosselDAO.buscarPorId(1L)).thenReturn(Optional.of(existente));
        when(carrosselDAO.listarTodos()).thenReturn(List.of(existente, conflitante));
        when(carrosselDAO.salvar(any())).thenAnswer(inv -> inv.getArgument(0));

        carrosselService.atualizar(1L, dados);

        assertThat(conflitante.getOrdemExibicao()).isEqualTo(1);
    }
}
