package com.receitas.site_receitas.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UsuarioTest {

    private Receita criarReceitaComIngredientes(String ingredientes) {
        Receita receita = new Receita();
        receita.setTitulo("Receita Teste");
        receita.setIngredientes(ingredientes);
        return receita;
    }

    private Favorito criarFavorito(Receita receita) {
        Favorito favorito = new Favorito();
        favorito.setReceita(receita);
        return favorito;
    }

    @Test
    @DisplayName("Deve alternar usuario ativo para inativo")
    void deveAlternarAtivoParaInativo() {
        Usuario usuario = new Usuario();
        usuario.setAtivo(true);
        usuario.alternarAtivo();
        assertThat(usuario.isAtivo()).isFalse();
    }

    @Test
    @DisplayName("Deve alternar usuario inativo para ativo")
    void deveAlternarInativoParaAtivo() {
        Usuario usuario = new Usuario();
        usuario.setAtivo(false);
        usuario.alternarAtivo();
        assertThat(usuario.isAtivo()).isTrue();
    }

    @Test
    @DisplayName("Deve alterar senha com valor valido")
    void deveAlterarSenhaComValorValido() {
        Usuario usuario = new Usuario();
        usuario.setSenha("senhaAntiga");
        usuario.alterarSenha("novaSenhaHash");
        assertThat(usuario.getSenha()).isEqualTo("novaSenhaHash");
    }

    @Test
    @DisplayName("Deve lancar excecao ao alterar senha para vazio")
    void deveLancarExcecaoAoAlterarSenhaVazia() {
        Usuario usuario = new Usuario();
        assertThatThrownBy(() -> usuario.alterarSenha(""))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Senha não pode ser vazia");
    }

    @Test
    @DisplayName("Deve lancar excecao ao alterar senha para nulo")
    void deveLancarExcecaoAoAlterarSenhaNula() {
        Usuario usuario = new Usuario();
        assertThatThrownBy(() -> usuario.alterarSenha(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Senha não pode ser vazia");
    }

    @Test
    @DisplayName("Deve editar perfil com todos os campos preenchidos")
    void deveEditarPerfilCompleto() {
        Usuario usuario = new Usuario();
        usuario.setNome("Nome Antigo");
        usuario.setEmail("antigo@email.com");
        usuario.setCpf("11111111111");
        usuario.setTelefone("111111111");
        usuario.setGenero("MASCULINO");
        usuario.editarPerfil("Novo Nome", "novo@email.com", "22222222222", "222222222", "FEMININO");
        assertThat(usuario.getNome()).isEqualTo("Novo Nome");
        assertThat(usuario.getEmail()).isEqualTo("novo@email.com");
        assertThat(usuario.getCpf()).isEqualTo("22222222222");
        assertThat(usuario.getTelefone()).isEqualTo("222222222");
        assertThat(usuario.getGenero()).isEqualTo("FEMININO");
    }

    @Test
    @DisplayName("Deve manter campos antigos quando edicao recebe nulos")
    void deveManterCamposAntigosComNulos() {
        Usuario usuario = new Usuario();
        usuario.setNome("Nome Original");
        usuario.setEmail("original@email.com");
        usuario.setCpf("11111111111");
        usuario.editarPerfil(null, null, null, null, null);
        assertThat(usuario.getNome()).isEqualTo("Nome Original");
        assertThat(usuario.getEmail()).isEqualTo("original@email.com");
        assertThat(usuario.getCpf()).isEqualTo("11111111111");
    }

    @Test
    @DisplayName("Deve manter nome antigo quando edicao recebe string vazia")
    void deveManterNomeAntigoComStringVazia() {
        Usuario usuario = new Usuario();
        usuario.setNome("Nome Original");
        usuario.editarPerfil("", null, null, null, null);
        assertThat(usuario.getNome()).isEqualTo("Nome Original");
    }

    @Test
    @DisplayName("Deve listar ingredientes disponiveis dos favoritos")
    void deveListarIngredientesDisponiveis() {
        Receita receita = criarReceitaComIngredientes("Farinha||Ovos||Acucar");
        Usuario usuario = new Usuario();
        usuario.setFavoritos(List.of(criarFavorito(receita)));
        List<String> ingredientes = usuario.listarIngredientesDisponiveis();
        assertThat(ingredientes).containsExactly("Acucar", "Farinha", "Ovos");
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando nao ha favoritos")
    void deveRetornarListaVaziaSemFavoritos() {
        Usuario usuario = new Usuario();
        usuario.setFavoritos(new ArrayList<>());
        List<String> ingredientes = usuario.listarIngredientesDisponiveis();
        assertThat(ingredientes).isEmpty();
    }

    @Test
    @DisplayName("Deve remover ingredientes duplicados entre favoritos")
    void deveRemoverIngredientesDuplicados() {
        Receita receita1 = criarReceitaComIngredientes("Farinha||Ovos");
        Receita receita2 = criarReceitaComIngredientes("Farinha||Leite");
        Usuario usuario = new Usuario();
        usuario.setFavoritos(List.of(criarFavorito(receita1), criarFavorito(receita2)));
        List<String> ingredientes = usuario.listarIngredientesDisponiveis();
        assertThat(ingredientes).containsExactly("Farinha", "Leite", "Ovos");
    }

    @Test
    @DisplayName("Deve listar ingredientes repetidos entre favoritos")
    void deveListarIngredientesRepetidos() {
        Receita receita1 = criarReceitaComIngredientes("Farinha||Ovos");
        Receita receita2 = criarReceitaComIngredientes("Farinha||Leite");
        Usuario usuario = new Usuario();
        usuario.setFavoritos(List.of(criarFavorito(receita1), criarFavorito(receita2)));
        List<String> repetidos = usuario.listarIngredientesRepetidos();
        assertThat(repetidos).containsExactly("Farinha");
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando nao ha ingredientes repetidos")
    void deveRetornarListaVaziaSemRepetidos() {
        Receita receita = criarReceitaComIngredientes("Farinha||Ovos");
        Usuario usuario = new Usuario();
        usuario.setFavoritos(List.of(criarFavorito(receita)));
        List<String> repetidos = usuario.listarIngredientesRepetidos();
        assertThat(repetidos).isEmpty();
    }

    @Test
    @DisplayName("Deve listar receitas que contem um ingrediente")
    void deveListarReceitasComIngrediente() {
        Receita receita1 = criarReceitaComIngredientes("Farinha||Ovos");
        receita1.setTitulo("Bolo");
        Receita receita2 = criarReceitaComIngredientes("Leite||Acucar");
        receita2.setTitulo("Pudim");
        Usuario usuario = new Usuario();
        usuario.setFavoritos(List.of(criarFavorito(receita1), criarFavorito(receita2)));
        List<String> receitas = usuario.listarReceitasComIngrediente("Farinha");
        assertThat(receitas).containsExactly("Bolo");
    }

    @Test
    @DisplayName("Deve ser case-insensitive ao buscar ingrediente")
    void deveBuscarIngredienteCaseInsensitive() {
        Receita receita = criarReceitaComIngredientes("Farinha||Ovos");
        receita.setTitulo("Bolo");
        Usuario usuario = new Usuario();
        usuario.setFavoritos(List.of(criarFavorito(receita)));
        List<String> receitas = usuario.listarReceitasComIngrediente("farinha");
        assertThat(receitas).containsExactly("Bolo");
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando termo de busca e nulo")
    void deveRetornarVazioComTermoNulo() {
        Usuario usuario = new Usuario();
        usuario.setFavoritos(new ArrayList<>());
        List<String> receitas = usuario.listarReceitasComIngrediente(null);
        assertThat(receitas).isEmpty();
    }

    @Test
    @DisplayName("Deve inicializar usuario com role USER por padrao")
    void deveInicializarComRoleUser() {
        Usuario usuario = new Usuario();
        assertThat(usuario.getRole()).isEqualTo("USER");
    }

    @Test
    @DisplayName("Deve inicializar usuario como ativo por padrao")
    void deveInicializarComoAtivo() {
        Usuario usuario = new Usuario();
        assertThat(usuario.isAtivo()).isTrue();
    }
}
