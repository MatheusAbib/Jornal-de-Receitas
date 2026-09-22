package com.receitas.site_receitas.command;

import com.receitas.site_receitas.factory.NotificacaoFactory;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;

public class RejeitarReceitaCommand extends BaseCommand {

    private final ReceitaService receitaService;
    private final NotificacaoService notificacaoService;
    private final FavoritoService favoritoService;
    private final EstatisticasService estatisticasService;
    private final Long receitaId;
    private final String motivo;

public RejeitarReceitaCommand(
        ReceitaService receitaService,
        NotificacaoService notificacaoService,
        FavoritoService favoritoService,
        EstatisticasService estatisticasService,
        Long receitaId,
        String motivo) {
    this.receitaService = receitaService;
    this.notificacaoService = notificacaoService;
    this.favoritoService = favoritoService;
    this.estatisticasService = estatisticasService;
    this.receitaId = receitaId;
    this.motivo = motivo;
}

    @Override
    public void executar() {
        Receita receita = receitaService.buscarPorId(receitaId).orElse(null);

        if (receita == null) {
            this.resultado = null;
            return;
        }

                receita.rejeitar(motivo);
                receitaService.salvar(receita);

        Usuario autor = receita.getUsuario();

        if (autor != null) {
        Notificacao notificacao = NotificacaoFactory.receitaRejeitada(autor, receita.getTitulo(), receita.getMotivoRejeicao());
        notificacaoService.salvar(notificacao);

        Command cmdEstatisticas = new AtualizarEstatisticasCommand(
                receitaService,
                favoritoService,
                estatisticasService,
                notificacaoService,
                autor
        );
            cmdEstatisticas.executar();
        }

        this.resultado = receita;
    }
}
