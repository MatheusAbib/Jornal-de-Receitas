package com.receitas.site_receitas.builder;

import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Usuario;

import java.time.LocalDateTime;

public class EstatisticasBuilder {

    private Estatisticas estatisticas = new Estatisticas();

    public EstatisticasBuilder doUsuario(Usuario usuario) {
        estatisticas.setUsuario(usuario);
        return this;
    }

    public EstatisticasBuilder comTotalReceitas(int total) {
        estatisticas.setTotalReceitas(total);
        return this;
    }

    public EstatisticasBuilder comReceitasAprovadas(int total) {
        estatisticas.setReceitasAprovadas(total);
        return this;
    }

    public EstatisticasBuilder comReceitasRejeitadas(int total) {
        estatisticas.setReceitasRejeitadas(total);
        return this;
    }

    public EstatisticasBuilder comReceitasPendentes(int total) {
        estatisticas.setReceitasPendentes(total);
        return this;
    }

    public EstatisticasBuilder comTotalFavoritos(int total) {
        estatisticas.setTotalFavoritos(total);
        return this;
    }

    public EstatisticasBuilder comTotalNotificacoes(int total) {
        estatisticas.setTotalNotificacoes(total);
        return this;
    }

    public EstatisticasBuilder comUltimaAtividade(LocalDateTime data) {
        estatisticas.setUltimaAtividade(data);
        return this;
    }

    public Estatisticas build() {
        if (estatisticas.getUsuario() == null) {
            throw new IllegalStateException("Usuário é obrigatório para criar Estatisticas");
        }
        if (estatisticas.getUltimaAtividade() == null) {
            estatisticas.setUltimaAtividade(LocalDateTime.now());
        }
        return estatisticas;
    }
}
