package com.receitas.site_receitas.command;

import com.receitas.site_receitas.builder.EstatisticasBuilder;
import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;

public class AtualizarEstatisticasCommand extends BaseCommand {

    private final ReceitaService receitaService;
    private final FavoritoService favoritoService;
    private final EstatisticasService estatisticasService;
    private final NotificacaoService notificacaoService;
    private final Usuario usuario;

    public AtualizarEstatisticasCommand(
            ReceitaService receitaService,
            FavoritoService favoritoService,
            EstatisticasService estatisticasService,
            NotificacaoService notificacaoService,
            Usuario usuario) {
        this.receitaService = receitaService;
        this.favoritoService = favoritoService;
        this.estatisticasService = estatisticasService;
        this.notificacaoService = notificacaoService;
        this.usuario = usuario;
    }

    @Override
    public void executar() {
        if (usuario == null) {
            this.resultado = null;
            return;
        }

        Estatisticas est = estatisticasService.buscarPorUsuario(usuario)
                .orElseGet(() -> {
                Estatisticas nova = new EstatisticasBuilder()
                        .doUsuario(usuario)
                        .build();
                    return nova;
                });

        long pendentes = receitaService.contarPorUsuarioEStatus(usuario.getId(), StatusReceita.PENDENTE);
        long aprovadas = receitaService.contarPorUsuarioEStatus(usuario.getId(), StatusReceita.APROVADA);
        long rejeitadas = receitaService.contarPorUsuarioEStatus(usuario.getId(), StatusReceita.REJEITADA);
        long total = pendentes + aprovadas + rejeitadas;
        int favoritos = favoritoService.listarPorUsuario(usuario).size();
        long notificacoes = notificacaoService.contarPorUsuario(usuario);

        est.recalcular(
            (int) total,
            (int) aprovadas,
            (int) rejeitadas,
            (int) pendentes,
            favoritos,
            (int) notificacoes
        );

        estatisticasService.atualizar(est);
        this.resultado = est;
    }
}