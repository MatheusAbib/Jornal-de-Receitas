package com.receitas.site_receitas.service;

import com.receitas.site_receitas.builder.CarrosselBuilder;
import com.receitas.site_receitas.dao.carrossel.ICarrosselDAO;
import com.receitas.site_receitas.model.CarrosselItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CarrosselService {

    @Autowired
    private ICarrosselDAO carrosselDAO;

    @Transactional(readOnly = true)
    public List<CarrosselItem> listarAtivos() {
        return carrosselDAO.listarAtivosOrdenados();
    }

    @Transactional(readOnly = true)
    public List<CarrosselItem> listarTodos() {
        return carrosselDAO.listarTodos();
    }

    @Transactional(readOnly = true)
    public Optional<CarrosselItem> buscarPorId(Long id) {
        return carrosselDAO.buscarPorId(id);
    }

    @Transactional
    public CarrosselItem salvar(CarrosselItem item) {
        if (item.getOrdemExibicao() == null) {
            long total = carrosselDAO.contarAtivos();
            item.definirOrdem((int) total + 1);
        }

        CarrosselItem novo = new CarrosselBuilder()
                .comTitulo(item.getTitulo())
                .comDescricao(item.getDescricao())
                .comImagemUrl(item.getImagemUrl())
                .comLinkDestino(item.getLinkDestino())
                .comOrdem(item.getOrdemExibicao())
                .ativo(true)
                .build();

        return carrosselDAO.salvar(novo);
    }

    @Transactional
    public CarrosselItem atualizar(Long id, CarrosselItem dados) {
        CarrosselItem item = carrosselDAO.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Item do carrossel não encontrado"));

        Integer ordemAntiga = item.getOrdemExibicao();
        Integer ordemNova = dados.getOrdemExibicao();

        if (ordemNova != null && !ordemNova.equals(ordemAntiga)) {
            List<CarrosselItem> todos = carrosselDAO.listarTodos();

            CarrosselItem itemConflitante = todos.stream()
                    .filter(i -> !i.getId().equals(id))
                    .filter(i -> ordemNova.equals(i.getOrdemExibicao()))
                    .findFirst()
                    .orElse(null);

            if (itemConflitante != null) {
                itemConflitante.setOrdemExibicao(ordemAntiga);
                carrosselDAO.salvar(itemConflitante);
            }
        }

        item.atualizarDados(
            dados.getTitulo(),
            dados.getDescricao(),
            dados.getImagemUrl(),
            dados.getOrdemExibicao(),
            dados.getLinkDestino()
        );

        return carrosselDAO.salvar(item);
    }

    @Transactional
    public CarrosselItem alternarAtivo(Long id) {
        CarrosselItem item = carrosselDAO.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Item do carrossel não encontrado"));

        item.alternarAtivo();
        return carrosselDAO.salvar(item);
    }

    @Transactional
    public void excluir(Long id) {
        if (!carrosselDAO.existe(id)) {
            throw new RuntimeException("Item do carrossel não encontrado");
        }
        carrosselDAO.deletar(id);
    }
}