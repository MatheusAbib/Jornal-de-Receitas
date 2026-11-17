package com.receitas.site_receitas.service;

import com.receitas.site_receitas.command.CommandInvoker;
import com.receitas.site_receitas.dao.favorito.IFavoritoDAO;
import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class FavoritoServiceTest {

    private IFavoritoDAO favoritoDAO;
    private ReceitaService receitaService;
    private NotificacaoService notificacaoService;
    private EstatisticasService estatisticasService;
    private CommandInvoker commandInvoker;
    private FavoritoService favoritoService;

    @BeforeEach
    void setUp() {
        favoritoDAO = mock(IFavoritoDAO.class);
        receitaService = mock(ReceitaService.class);
        notificacaoService = mock(NotificacaoService.class);
        estatisticasService = mock(EstatisticasService.class);
        commandInvoker = mock(CommandInvoker.class);

        favoritoService = new FavoritoService();
        ReflectionTestUtils.setField(favoritoService, "favoritoDAO", favoritoDAO);
        ReflectionTestUtils.setField(favoritoService, "receitaService", receitaService);
        ReflectionTestUtils.setField(favoritoService, "notificacaoService", notificacaoService);
        ReflectionTestUtils.setField(favoritoService, "estatisticasService", estatisticasService);
        ReflectionTestUtils.setField(favoritoService, "commandInvoker", commandInvoker);
    }

    @Test
    @DisplayName("Deve retornar IDs dos favoritos do usuario")
    void deveRetornarIdsDosFavoritos() {
        Receita receita1 = new Receita();
        receita1.setId(1L);
        Receita receita2 = new Receita();
        receita2.setId(2L);
        Favorito favorito1 = new Favorito();
        favorito1.setReceita(receita1);
        Favorito favorito2 = new Favorito();
        favorito2.setReceita(receita2);

        Usuario usuario = new Usuario();
        when(favoritoDAO.listarPorUsuario(usuario)).thenReturn(List.of(favorito1, favorito2));

        List<Long> ids = favoritoService.getFavoritosIds(usuario);

        assertThat(ids).containsExactly(1L, 2L);
    }

    @SuppressWarnings("unchecked")
    @Test
    @DisplayName("Deve calcular resumo com total de favoritos e ingredientes")
    void deveCalcularResumo() {
        Receita receita1 = new Receita();
        receita1.setId(1L);
        receita1.setIngredientes("Farinha||Ovos");
        Receita receita2 = new Receita();
        receita2.setId(2L);
        receita2.setIngredientes("Farinha||Leite");
        Favorito favorito1 = new Favorito();
        favorito1.setReceita(receita1);
        Favorito favorito2 = new Favorito();
        favorito2.setReceita(receita2);

        Usuario usuario = new Usuario();
        when(favoritoDAO.listarPorUsuario(usuario)).thenReturn(List.of(favorito1, favorito2));

        Map<String, Object> resumo = favoritoService.calcularResumo(usuario);

        assertThat(resumo.get("totalFavoritos")).isEqualTo(2);
        assertThat((List<String>) resumo.get("ingredientesDisponiveis")).containsExactly("Farinha", "Leite", "Ovos");
        assertThat((List<String>) resumo.get("ingredientesRepetidos")).containsExactly("Farinha");
    }

    @SuppressWarnings("unchecked")
    @Test
    @DisplayName("Deve calcular resumo por ingrediente")
    void deveCalcularResumoPorIngrediente() {
        Receita receita1 = new Receita();
        receita1.setId(1L);
        receita1.setTitulo("Bolo");
        receita1.setIngredientes("Farinha||Ovos");
        Receita receita2 = new Receita();
        receita2.setId(2L);
        receita2.setTitulo("Pao");
        receita2.setIngredientes("Farinha||Leite");
        Favorito favorito1 = new Favorito();
        favorito1.setReceita(receita1);
        Favorito favorito2 = new Favorito();
        favorito2.setReceita(receita2);

        Usuario usuario = new Usuario();
        when(favoritoDAO.listarPorUsuario(usuario)).thenReturn(List.of(favorito1, favorito2));

        Map<String, Object> resumo = favoritoService.calcularResumoPorIngrediente(usuario, "Farinha");

        assertThat(resumo.get("ingrediente")).isEqualTo("Farinha");
        assertThat(resumo.get("quantidade")).isEqualTo(2);
        assertThat((List<String>) resumo.get("receitas")).containsExactly("Bolo", "Pao");
    }

    @Test
    @DisplayName("Deve contar curtidas de uma receita")
    void deveContarCurtidas() {
        Receita receita = new Receita();
        when(favoritoDAO.contarPorReceita(receita)).thenReturn(5L);

        long curtidas = favoritoService.contarCurtidas(receita);

        assertThat(curtidas).isEqualTo(5L);
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando usuario nao tem favoritos")
    void deveRetornarListaVaziaSemFavoritos() {
        Usuario usuario = new Usuario();
        when(favoritoDAO.listarPorUsuario(usuario)).thenReturn(List.of());

        List<Long> ids = favoritoService.getFavoritosIds(usuario);

        assertThat(ids).isEmpty();
    }
}
