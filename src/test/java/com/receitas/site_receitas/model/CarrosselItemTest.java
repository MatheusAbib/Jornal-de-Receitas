package com.receitas.site_receitas.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CarrosselItemTest {

    @Test
    @DisplayName("Deve alternar ativo de true para false")
    void deveAlternarAtivoDeTrueParaFalse() {
        CarrosselItem item = new CarrosselItem();
        item.setAtivo(true);

        item.alternarAtivo();

        assertThat(item.isAtivo()).isFalse();
    }

    @Test
    @DisplayName("Deve alternar ativo de false para true")
    void deveAlternarAtivoDeFalseParaTrue() {
        CarrosselItem item = new CarrosselItem();
        item.setAtivo(false);

        item.alternarAtivo();

        assertThat(item.isAtivo()).isTrue();
    }

    @Test
    @DisplayName("Deve atualizar dados do carrossel")
    void deveAtualizarDados() {
        CarrosselItem item = new CarrosselItem();
        item.setTitulo("Antigo");
        item.setDescricao("Desc Antiga");
        item.setImagemUrl("antiga.jpg");
        item.setOrdemExibicao(1);
        item.setLinkDestino("/antigo");

        item.atualizarDados("Novo", "Desc Nova", "nova.jpg", 2, "/novo");

        assertThat(item.getTitulo()).isEqualTo("Novo");
        assertThat(item.getDescricao()).isEqualTo("Desc Nova");
        assertThat(item.getImagemUrl()).isEqualTo("nova.jpg");
        assertThat(item.getOrdemExibicao()).isEqualTo(2);
        assertThat(item.getLinkDestino()).isEqualTo("/novo");
    }

    @Test
    @DisplayName("Deve manter dados antigos ao atualizar com nulos")
    void deveManterDadosAntigosComNulos() {
        CarrosselItem item = new CarrosselItem();
        item.setTitulo("Original");
        item.setDescricao("Desc Original");
        item.setImagemUrl("original.jpg");

        item.atualizarDados(null, null, null, null, null);

        assertThat(item.getTitulo()).isEqualTo("Original");
        assertThat(item.getDescricao()).isEqualTo("Desc Original");
        assertThat(item.getImagemUrl()).isEqualTo("original.jpg");
    }

    @Test
    @DisplayName("Deve definir ordem de exibicao")
    void deveDefinirOrdem() {
        CarrosselItem item = new CarrosselItem();
        item.setOrdemExibicao(5);

        item.definirOrdem(10);

        assertThat(item.getOrdemExibicao()).isEqualTo(10);
    }
}
