package com.receitas.site_receitas.dao.carrossel;

import com.receitas.site_receitas.model.CarrosselItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class CarrosselDAOImpl implements ICarrosselDAO {

    @Autowired
    private CarrosselJpaRepository repository;

    @Override
    public CarrosselItem salvar(CarrosselItem item) {
        return repository.save(item);
    }

    @Override
    public Optional<CarrosselItem> buscarPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public List<CarrosselItem> listarTodos() {
        return repository.findAll();
    }

    @Override
    public List<CarrosselItem> listarAtivosOrdenados() {
        return repository.findByAtivoTrueOrderByOrdemExibicaoAsc();
    }

    @Override
    public long contarAtivos() {
        return repository.countByAtivoTrue();
    }

    @Override
    public boolean existe(Long id) {
        return repository.existsById(id);
    }

    @Override
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}