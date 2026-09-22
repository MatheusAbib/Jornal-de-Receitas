package com.receitas.site_receitas.dao.carrossel;

import com.receitas.site_receitas.model.CarrosselItem;

import java.util.List;
import java.util.Optional;

public interface ICarrosselDAO {

    CarrosselItem salvar(CarrosselItem item);

    Optional<CarrosselItem> buscarPorId(Long id);

    List<CarrosselItem> listarTodos();

    List<CarrosselItem> listarAtivosOrdenados();

    long contarAtivos();

    boolean existe(Long id);

    void deletar(Long id);
}