package com.receitas.site_receitas.factory;

import com.receitas.site_receitas.model.Usuario;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UsuarioFactoryTest {

    @Test
    @DisplayName("Deve criar cliente com role USER e ativo")
    void deveCriarCliente() {
        Usuario usuario = UsuarioFactory.criarCliente("Joao", "joao@email.com", "senha", "11111111111");

        assertThat(usuario.getNome()).isEqualTo("Joao");
        assertThat(usuario.getEmail()).isEqualTo("joao@email.com");
        assertThat(usuario.getRole()).isEqualTo("USER");
        assertThat(usuario.isAtivo()).isTrue();
        assertThat(usuario.getDataCadastro()).isNotNull();
    }

    @Test
    @DisplayName("Deve criar admin com role ADMIN e ativo")
    void deveCriarAdmin() {
        Usuario usuario = UsuarioFactory.criarAdmin("Admin", "admin@email.com", "senha", "00000000000");

        assertThat(usuario.getRole()).isEqualTo("ADMIN");
        assertThat(usuario.isAtivo()).isTrue();
    }

    @Test
    @DisplayName("Deve criar cliente completo com telefone e genero")
    void deveCriarClienteCompleto() {
        Usuario usuario = UsuarioFactory.criarClienteCompleto(
                "Joao", "joao@email.com", "senha", "11111111111",
                "11999999999", "MASCULINO"
        );

        assertThat(usuario.getTelefone()).isEqualTo("11999999999");
        assertThat(usuario.getGenero()).isEqualTo("MASCULINO");
        assertThat(usuario.getRole()).isEqualTo("USER");
    }
}