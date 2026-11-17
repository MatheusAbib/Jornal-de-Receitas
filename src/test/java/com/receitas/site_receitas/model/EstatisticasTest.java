package com.receitas.site_receitas.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EstatisticasTest {

    @Test
    @DisplayName("Deve inicializar com valores zerados")
    void deveInicializarComValoresZerados() {
        Estatisticas est = new Estatisticas();

        assertThat(est.getTotalReceitas()).isZero();
        assertThat(est.getReceitasAprovadas()).isZero();
        assertThat(est.getReceitasRejeitadas()).isZero();
        assertThat(est.getReceitasPendentes()).isZero();
        assertThat(est.getTotalFavoritos()).isZero();
        assertThat(est.getTotalNotificacoes()).isZero();
    }

    @Test
    @DisplayName("Deve recalcular todos os valores")
    void deveRecalcularTodosOsValores() {
        Estatisticas est = new Estatisticas();

        est.recalcular(10, 5, 2, 3, 8, 15);

        assertThat(est.getTotalReceitas()).isEqualTo(10);
        assertThat(est.getReceitasAprovadas()).isEqualTo(5);
        assertThat(est.getReceitasRejeitadas()).isEqualTo(2);
        assertThat(est.getReceitasPendentes()).isEqualTo(3);
        assertThat(est.getTotalFavoritos()).isEqualTo(8);
        assertThat(est.getTotalNotificacoes()).isEqualTo(15);
    }

    @Test
    @DisplayName("Deve atualizar ultima atividade ao recalcular")
    void deveAtualizarUltimaAtividadeAoRecalcular() {
        Estatisticas est = new Estatisticas();
        var antes = est.getUltimaAtividade();

        est.recalcular(1, 1, 0, 0, 0, 0);

        assertThat(est.getUltimaAtividade()).isAfterOrEqualTo(antes);
    }
}