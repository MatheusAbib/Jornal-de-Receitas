package com.receitas.site_receitas.command;

import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.ReceitaService;

public class AtualizarEstatisticasCommand extends BaseCommand {

    private final ReceitaService receitaService;
    private final FavoritoService favoritoService;
    private final EstatisticasService estatisticasService;
    private final Usuario usuario;

    public AtualizarEstatisticasCommand(
            ReceitaService receitaService,
            FavoritoService favoritoService,
            EstatisticasService estatisticasService,
            Usuario usuario) {
        this.receitaService = receitaService;
        this.favoritoService = favoritoService;
        this.estatisticasService = estatisticasService;
        this.usuario = usuario;
    }

    @Override
    public void executar() {
        if (usuario == null) {
            this.resultado = null;
            return;
        }

        long pendentes = receitaService.contarPorUsuarioEStatus(usuario.getId(), StatusReceita.PENDENTE);
        long aprovadas = receitaService.contarPorUsuarioEStatus(usuario.getId(), StatusReceita.APROVADA);
        long rejeitadas = receitaService.contarPorUsuarioEStatus(usuario.getId(), StatusReceita.REJEITADA);
        long total = pendentes + aprovadas + rejeitadas;
        int favoritos = favoritoService.listarPorUsuario(usuario).size();
        long notificacoes = 0;

        Estatisticas est = estatisticasService.recalcular(
                usuario,
                (int) total,
                (int) aprovadas,
                (int) rejeitadas,
                (int) pendentes,
                favoritos,
                (int) notificacoes
        );

        this.resultado = est;
    }
}