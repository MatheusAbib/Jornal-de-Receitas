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
        // 1. Busca a receita. (bloco "alt" do diagrama: se não existe → resultado = null e para)
        Receita receita = receitaService.buscarPorId(receitaId).orElse(null);

        if (receita == null) {
            this.resultado = null;
            return;
        }
        // 2. Chama aprovar() na entidade (regra de negócio mora na Receita) e salva no banco
        receita.aprovar();
        receitaService.salvar(receita);

        // 3. Cria notificação "sua receita foi aprovada" via Factory e salva
        Usuario autor = receita.getUsuario();
        if (autor != null) {
            Notificacao notificacaoAutor = NotificacaoFactory.receitaAprovada(autor, receita.getTitulo());
            notificacaoService.salvar(notificacaoAutor);
        }

        // 4. Loop para notificar todos os usuários, exceto ADMIN e o próprio autor
        List<Usuario> usuarios = usuarioService.listarTodos();
        for (Usuario usuario : usuarios) {
            if ("ADMIN".equals(usuario.getRole())) continue;
            if (autor != null && usuario.getId().equals(autor.getId())) continue;

            Notificacao notificacao = NotificacaoFactory.novaReceitaPublicada(usuario, receita.getTitulo());
            notificacaoService.salvar(notificacao);
        }
        // 5. Cria e executa um segundo Command para recalcular estatísticas do autor
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
