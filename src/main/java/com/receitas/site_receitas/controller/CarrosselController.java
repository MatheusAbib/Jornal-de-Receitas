package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.CarrosselItem;
import com.receitas.site_receitas.repository.CarrosselRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/carrossel")
public class CarrosselController {

    @Autowired
    private CarrosselRepository carrosselRepository;

    // Método para obter os itens do carrossel ativos (para ser usado no index)
    @ModelAttribute("carrosselItens")
    public List<CarrosselItem> getCarrosselItens() {
        return carrosselRepository.findByAtivoTrueOrderByOrdemExibicaoAsc();
    }

    // Página de administração do carrossel (apenas ADMIN)
    @GetMapping("/admin")
    public String adminCarrossel(Model model) {
        model.addAttribute("carrosselItens", carrosselRepository.findAll());
        model.addAttribute("novoItem", new CarrosselItem());
        return "admin/carrossel"; // Você pode criar este template depois se quiser
    }

    // Adicionar novo item ao carrossel (apenas ADMIN)
    @PostMapping("/adicionar")
    public String adicionarItem(@ModelAttribute CarrosselItem carrosselItem) {
        if (carrosselItem.getOrdemExibicao() == null) {
            // Se não tiver ordem definida, coloca como último
            long count = carrosselRepository.countByAtivoTrue();
            carrosselItem.setOrdemExibicao((int) count + 1);
        }
        carrosselItem.setAtivo(true);
        carrosselRepository.save(carrosselItem);
        return "redirect:/carrossel/admin";
    }

    // Editar item do carrossel (apenas ADMIN)
    @PostMapping("/editar/{id}")
    public String editarItem(@PathVariable Long id, @ModelAttribute CarrosselItem itemAtualizado) {
        Optional<CarrosselItem> itemOptional = carrosselRepository.findById(id);
        if (itemOptional.isPresent()) {
            CarrosselItem item = itemOptional.get();
            item.setTitulo(itemAtualizado.getTitulo());
            item.setDescricao(itemAtualizado.getDescricao());
            item.setImagemUrl(itemAtualizado.getImagemUrl());
            item.setOrdemExibicao(itemAtualizado.getOrdemExibicao());
            item.setLinkDestino(itemAtualizado.getLinkDestino());
            carrosselRepository.save(item);
        }
        return "redirect:/carrossel/admin";
    }

    // Alternar status ativo/inativo (apenas ADMIN)
    @PostMapping("/toggle/{id}")
    public String toggleAtivo(@PathVariable Long id) {
        Optional<CarrosselItem> itemOptional = carrosselRepository.findById(id);
        if (itemOptional.isPresent()) {
            CarrosselItem item = itemOptional.get();
            item.setAtivo(!item.isAtivo());
            carrosselRepository.save(item);
        }
        return "redirect:/carrossel/admin";
    }

    // Excluir item do carrossel (apenas ADMIN)
    @PostMapping("/excluir/{id}")
    public String excluirItem(@PathVariable Long id) {
        carrosselRepository.deleteById(id);
        return "redirect:/carrossel/admin";
    }
}