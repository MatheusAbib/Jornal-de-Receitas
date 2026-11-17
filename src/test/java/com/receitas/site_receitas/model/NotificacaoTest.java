package com.receitas.site_receitas.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class NotificacaoTest {

    @Test
    @DisplayName("Deve marcar notificacao como lida")
    void deveMarcarComoLida() {
        Notificacao notificacao = new Notificacao();
        notificacao.setLida(false);

        notificacao.marcarComoLida();

        assertThat(notificacao.isLida()).isTrue();
    }

    @Test
    @DisplayName("Deve comecar como nao lida por padrao")
    void deveComecarComoNaoLida() {
        Notificacao notificacao = new Notificacao();

        assertThat(notificacao.isLida()).isFalse();
    }

    @Test
    @DisplayName("Deve manter lida ao marcar novamente")
    void deveManterLidaAoMarcarNovamente() {
        Notificacao notificacao = new Notificacao();
        notificacao.marcarComoLida();

        notificacao.marcarComoLida();

        assertThat(notificacao.isLida()).isTrue();
    }
}
