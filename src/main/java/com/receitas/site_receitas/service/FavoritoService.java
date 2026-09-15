package com.receitas.site_receitas.service;

import com.receitas.site_receitas.model.Favorito;
import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.repository.FavoritoRepository;
import com.receitas.site_receitas.repository.ReceitaRepository;
import com.receitas.site_receitas.repository.NotificacaoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private ReceitaRepository receitaRepository;

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Transactional
    public boolean isFavorito(Usuario usuario, Long receitaId) {
        Receita receita = receitaRepository.findById(receitaId).orElse(null);

        if (receita == null) {
            return false;
        }

        return favoritoRepository.existsByUsuarioAndReceita(usuario, receita);
    }

    @Transactional(readOnly = true)
    public List<Long> getFavoritosIds(Usuario usuario) {
        List<Favorito> favoritos = favoritoRepository.findByUsuario(usuario);

        return favoritos.stream()
                .map(f -> f.getReceita().getId())
                .collect(Collectors.toList());
    }

    @Transactional
    public void adicionarFavorito(Usuario usuario, Long receitaId) {

        Receita receita = receitaRepository.findById(receitaId).orElse(null);

        if (receita == null) {
            return;
        }

        if (!favoritoRepository.existsByUsuarioAndReceita(usuario, receita)) {

            Favorito favorito = new Favorito(usuario, receita);

            favoritoRepository.save(favorito);

            Notificacao notificacao = new Notificacao(
                    usuario,
                    "Você adicionou \"" + receita.getTitulo() + "\" aos favoritos.",
                    Notificacao.TipoNotificacao.FAVORITOU
            );

            notificacaoRepository.save(notificacao);
        }
    }

    @Transactional
    public void removerFavorito(Usuario usuario, Long receitaId) {

        Receita receita = receitaRepository.findById(receitaId).orElse(null);

        if (receita == null) {
            return;
        }

        favoritoRepository.deleteByUsuarioAndReceita(usuario, receita);

        Notificacao notificacao = new Notificacao(
                usuario,
                "Você removeu \"" + receita.getTitulo() + "\" dos favoritos.",
                Notificacao.TipoNotificacao.DESFAVORITOU
        );

        notificacaoRepository.save(notificacao);
    }
}