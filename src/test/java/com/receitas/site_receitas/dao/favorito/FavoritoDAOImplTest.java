package com.receitas.site_receitas.dao.favorito;

import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class FavoritoDAOImplTest {

    private FavoritoJpaRepository repository;
    private FavoritoDAOImpl favoritoDAO;

    @BeforeEach
    void setUp() {
        repository = mock(FavoritoJpaRepository.class);
        favoritoDAO = new FavoritoDAOImpl();
        ReflectionTestUtils.setField(favoritoDAO, "repository", repository);
    }

    @Test
    @DisplayName("Deve salvar favorito")
    void deveSalvarFavorito() {
        Usuario usuario = new Usuario();
        Receita receita = new Receita();
        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setReceita(receita);

        when(repository.save(favorito)).thenReturn(favorito);

        Favorito salvo = favoritoDAO.salvar(favorito);

        assertThat(salvo).isEqualTo(favorito);
        verify(repository).save(favorito);
    }

    @Test
    @DisplayName("Deve verificar existencia de favorito por usuario e receita")
    void deveVerificarExistenciaPorUsuarioEReceita() {
        Usuario usuario = new Usuario();
        Receita receita = new Receita();

        when(repository.existsByUsuarioAndReceita(usuario, receita)).thenReturn(true);

        boolean existe = favoritoDAO.existePorUsuarioEReceita(usuario, receita);

        assertThat(existe).isTrue();
    }

    @Test
    @DisplayName("Deve retornar false quando favorito nao existe")
    void deveRetornarFalseQuandoNaoExiste() {
        Usuario usuario = new Usuario();
        Receita receita = new Receita();

        when(repository.existsByUsuarioAndReceita(usuario, receita)).thenReturn(false);

        boolean existe = favoritoDAO.existePorUsuarioEReceita(usuario, receita);

        assertThat(existe).isFalse();
    }

    @Test
    @DisplayName("Deve deletar favorito por usuario e receita")
    void deveDeletarPorUsuarioEReceita() {
        Usuario usuario = new Usuario();
        Receita receita = new Receita();

        favoritoDAO.deletarPorUsuarioEReceita(usuario, receita);

        verify(repository).deleteByUsuarioAndReceita(usuario, receita);
    }

    @Test
    @DisplayName("Deve contar favoritos de uma receita")
    void deveContarPorReceita() {
        Receita receita = new Receita();
        when(repository.countByReceita(receita)).thenReturn(3L);

        long total = favoritoDAO.contarPorReceita(receita);

        assertThat(total).isEqualTo(3L);
    }
}
