package com.receitas.site_receitas.service;

import com.receitas.site_receitas.builder.EstatisticasBuilder;
import com.receitas.site_receitas.dao.estatisticas.IEstatisticasDAO;
import com.receitas.site_receitas.model.Estatisticas;
import com.receitas.site_receitas.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class EstatisticasService {

    @Autowired
    private IEstatisticasDAO estatisticasDAO;

    @Transactional
    public Estatisticas criarParaUsuario(Usuario usuario) {
        Optional<Estatisticas> existente = estatisticasDAO.buscarPorUsuario(usuario);
        if (existente.isPresent()) {
            return existente.get();
        }

        Estatisticas estatisticas = new EstatisticasBuilder()
                .doUsuario(usuario)
                .build();

        return estatisticasDAO.salvar(estatisticas);
    }

    @Transactional(readOnly = true)
    public Optional<Estatisticas> buscarPorUsuario(Usuario usuario) {
        return estatisticasDAO.buscarPorUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public Optional<Estatisticas> buscarPorUsuarioId(Integer usuarioId) {
        return estatisticasDAO.buscarPorUsuarioId(usuarioId);
    }

    @Transactional
    public Estatisticas atualizar(Estatisticas estatisticas) {
        return estatisticasDAO.salvar(estatisticas);
    }

    @Transactional
    public Estatisticas recalcular(Usuario usuario, int total, int aprovadas, int rejeitadas, int pendentes, int favoritos, int notificacoes) {
        Estatisticas est = estatisticasDAO.buscarPorUsuario(usuario)
                .orElseGet(() -> criarParaUsuario(usuario));

        est.recalcular(total, aprovadas, rejeitadas, pendentes, favoritos, notificacoes);

        return estatisticasDAO.salvar(est);
    }
}