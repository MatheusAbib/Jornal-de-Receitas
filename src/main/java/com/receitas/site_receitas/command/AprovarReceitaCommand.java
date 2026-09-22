package com.receitas.site_receitas.command;

import com.receitas.site_receitas.factory.NotificacaoFactory;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.EstatisticasService;
import com.receitas.site_receitas.service.FavoritoService;
import com.receitas.site_receitas.service.NotificacaoService;
import com.receitas.site_receitas.service.ReceitaService;
import com.receitas.site_receitas.service.UsuarioService;

import java.util.List;

public class AprovarReceitaCommand extends BaseCommand {

    private final ReceitaService receitaService;
    private final UsuarioService usuarioService;
    private final NotificacaoService notificacaoService;
    private final FavoritoService favoritoService;
    private final EstatisticasService estatisticasService;
    private final Long receitaId;

public AprovarReceitaCommand(
        ReceitaService receitaService,
        UsuarioService usuarioService,
        NotificacaoService notificacaoService,
        FavoritoService favoritoService,
        EstatisticasService estatisticasService,
        Long receitaId) {
    this.receitaService = receitaService;
    this.usuarioService = usuarioService;
    this.notificacaoService = notificacaoService;
    this.favoritoService = favoritoService;
    this.estatisticasService = estatisticasService;
    this.receitaId = receitaId;
}

    @Override
    public void executar() {
        Receita receita = receitaService.buscarPorId(receitaId).orElse(null);

        if (receita == null) {
            this.resultado = null;
            return;
        }

        receita.aprovar();
        receitaService.salvar(receita);

        Usuario autor = receita.getUsuario();

        if (autor != null) {
            Notificacao notificacaoAutor = NotificacaoFactory.receitaAprovada(autor, receita.getTitulo());
            notificacaoService.salvar(notificacaoAutor);
        }

        List<Usuario> usuarios = usuarioService.listarTodos();

        for (Usuario usuario : usuarios) {
            if ("ADMIN".equals(usuario.getRole())) continue;
            if (autor != null && usuario.getId().equals(autor.getId())) continue;

            Notificacao notificacao = NotificacaoFactory.novaReceitaPublicada(usuario, receita.getTitulo());
            notificacaoService.salvar(notificacao);
        }

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
