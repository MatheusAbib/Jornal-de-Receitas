package com.receitas.site_receitas.command;

import com.receitas.site_receitas.factory.NotificacaoFactory;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import com.receitas.site_receitas.service.UploadService;

public class ExcluirReceitaCommand extends BaseCommand {

    private final ReceitaService receitaService;
    private final NotificacaoService notificacaoService;
    private final FavoritoService favoritoService;
    private final EstatisticasService estatisticasService;
    private final UploadService uploadService;
    private final Long receitaId;

    public ExcluirReceitaCommand(
            ReceitaService receitaService,
            NotificacaoService notificacaoService,
            FavoritoService favoritoService,
            EstatisticasService estatisticasService,
            UploadService uploadService,
            Long receitaId) {
        this.receitaService = receitaService;
        this.notificacaoService = notificacaoService;
        this.favoritoService = favoritoService;
        this.estatisticasService = estatisticasService;
        this.uploadService = uploadService;
        this.receitaId = receitaId;
    }

    @Override
    public void executar() {
        Receita receita = receitaService.buscarPorId(receitaId).orElse(null);

        if (receita == null) {
            this.resultado = null;
            return;
        }

        uploadService.excluirImagem(receita.getImagem());

        Usuario autor = receita.getUsuario();

        if (autor != null) {
            Notificacao notificacao = NotificacaoFactory.receitaExcluida(autor, receita.getTitulo());
            notificacaoService.salvar(notificacao);
        }

        receitaService.excluir(receitaId);

        if (autor != null) {
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
