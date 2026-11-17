package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UsuarioBuilderTest {

    @Test
    @DisplayName("Deve aplicar role USER por padrao")
    void deveAplicarRoleUserPorPadrao() {
        Usuario usuario = new UsuarioBuilder().build();

        assertThat(usuario.getRole()).isEqualTo("USER");
    }

    @Test
    @DisplayName("Deve aplicar dataCadastro por padrao")
    void deveAplicarDataCadastroPorPadrao() {
        Usuario usuario = new UsuarioBuilder().build();

        assertThat(usuario.getDataCadastro()).isNotNull();
    }

    @Test
    @DisplayName("Deve montar usuario completo")
    void deveMontarUsuarioCompleto() {
        Usuario usuario = new UsuarioBuilder()
                .comNome("Joao")
                .comEmail("joao@email.com")
                .comSenha("hash")
                .comCpf("11111111111")
                .comTelefone("11999999999")
                .comGenero("MASCULINO")
                .ativo(true)
                .comoCliente()
                .build();

        assertThat(usuario.getNome()).isEqualTo("Joao");
        assertThat(usuario.getEmail()).isEqualTo("joao@email.com");
        assertThat(usuario.getSenha()).isEqualTo("hash");
        assertThat(usuario.getCpf()).isEqualTo("11111111111");
        assertThat(usuario.getTelefone()).isEqualTo("11999999999");
        assertThat(usuario.getGenero()).isEqualTo("MASCULINO");
        assertThat(usuario.isAtivo()).isTrue();
        assertThat(usuario.getRole()).isEqualTo("USER");
    }

    @Test
    @DisplayName("Deve montar usuario admin")
    void deveMontarUsuarioAdmin() {
        Usuario usuario = new UsuarioBuilder()
                .comNome("Admin")
                .comEmail("admin@email.com")
                .comSenha("hash")
                .comCpf("00000000000")
                .comoAdmin()
                .build();

        assertThat(usuario.getRole()).isEqualTo("ADMIN");
    }
}