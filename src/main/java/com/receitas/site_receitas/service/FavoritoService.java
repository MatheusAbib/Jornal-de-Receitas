package com.receitas.site_receitas.service;

import com.receitas.site_receitas.builder.FavoritoBuilder;
import com.receitas.site_receitas.command.AtualizarEstatisticasCommand;
import com.receitas.site_receitas.command.Command;
import com.receitas.site_receitas.command.CommandInvoker;
import com.receitas.site_receitas.dao.favorito.IFavoritoDAO;
import com.receitas.site_receitas.factory.NotificacaoFactory;
import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoritoService {

    @Autowired
    private IFavoritoDAO favoritoDAO;

    @Autowired
    private ReceitaService receitaService;

    @Autowired
    private NotificacaoService notificacaoService;

    @Autowired
    private EstatisticasService estatisticasService;

    @Autowired
    private CommandInvoker commandInvoker;

    @Transactional(readOnly = true)
    public boolean isFavorito(Usuario usuario, Long receitaId) {
        Receita receita = receitaService.buscarPorId(receitaId).orElse(null);
        if (receita == null) return false;
        return favoritoDAO.existePorUsuarioEReceita(usuario, receita);
    }

    @Transactional(readOnly = true)
    public List<Long> getFavoritosIds(Usuario usuario) {
        List<Favorito> favoritos = favoritoDAO.listarPorUsuario(usuario);
        return favoritos.stream()
                .map(f -> f.getReceita().getId())
                .collect(Collectors.toList());
    }

    @Transactional
    public void adicionarFavorito(Usuario usuario, Long receitaId) {
        Receita receita = receitaService.buscarPorId(receitaId).orElse(null);
        if (receita == null) return;

        if (!favoritoDAO.existePorUsuarioEReceita(usuario, receita)) {
            Favorito favorito = new FavoritoBuilder()
                .doUsuario(usuario)
                .daReceita(receita)
                .build();
            favoritoDAO.salvar(favorito);

Notificacao notificacao = NotificacaoFactory.favoritou(usuario, receita.getTitulo());
notificacaoService.salvar(notificacao);

Command cmdEstatisticas = new AtualizarEstatisticasCommand(
        receitaService,
        this,
        estatisticasService,
        notificacaoService,
        usuario
);
            commandInvoker.executar(cmdEstatisticas);
        }
    }

    @Transactional
    public void removerFavorito(Usuario usuario, Long receitaId) {
        Receita receita = receitaService.buscarPorId(receitaId).orElse(null);
        if (receita == null) return;

        favoritoDAO.deletarPorUsuarioEReceita(usuario, receita);

        Notificacao notificacao = NotificacaoFactory.desfavoritou(usuario, receita.getTitulo());
        notificacaoService.salvar(notificacao);

        Command cmdEstatisticas = new AtualizarEstatisticasCommand(
                receitaService,
                this,
                estatisticasService,
                notificacaoService,
                usuario
        );
        commandInvoker.executar(cmdEstatisticas);
    }

    @Transactional(readOnly = true)
    public List<Favorito> listarPorUsuario(Usuario usuario) {
        return favoritoDAO.listarPorUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public long contarCurtidas(Receita receita) {
        return favoritoDAO.contarPorReceita(receita);
    }

    @Transactional(readOnly = true)
        public long contarCurtidasPorUsuario(Integer usuarioId) {
            return favoritoDAO.contarCurtidasPorUsuario(usuarioId);
        }
}