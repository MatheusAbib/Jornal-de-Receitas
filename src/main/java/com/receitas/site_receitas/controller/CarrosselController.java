package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.CarrosselItem;
import com.receitas.site_receitas.service.CarrosselService;
import com.receitas.site_receitas.service.SiteConfigService;
import com.receitas.site_receitas.service.UploadService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping("/carrossel")
public class CarrosselController {

    @Autowired
    private CarrosselService carrosselService;

    @Autowired
    private UploadService uploadService;

    @Autowired
    private SiteConfigService siteConfigService;

    @ModelAttribute("carrosselItens")
    public List<CarrosselItem> getCarrosselItens() {
        return carrosselService.listarAtivos();
    }

    @GetMapping("/admin")
    public String adminCarrossel(Model model) {
        model.addAttribute("paginaAtual", "carrossel");
        model.addAttribute("carrosselItens", carrosselService.listarTodos());
        model.addAttribute("novoItem", new CarrosselItem());
        model.addAttribute("faviconUrl", siteConfigService.getFaviconUrl());
        return "admin/carrossel";
    }

    @PostMapping("/adicionar")
    public String adicionarItem(
            @ModelAttribute CarrosselItem carrosselItem,
            @RequestParam(value = "imagemFile", required = false) MultipartFile imagemFile) throws Exception {

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        if (nomeArquivo != null) {
            carrosselItem.setImagemUrl(nomeArquivo);
        }

        carrosselService.salvar(carrosselItem);
        return "redirect:/carrossel/admin?ok=adicionada";
    }

    @PostMapping("/editar/{id}")
    public String editarItem(
            @PathVariable Long id,
            @ModelAttribute CarrosselItem itemAtualizado,
            @RequestParam(value = "imagemFile", required = false) MultipartFile imagemFile) throws Exception {

        String nomeArquivo = uploadService.salvarImagem(imagemFile);

        if (nomeArquivo != null) {
            itemAtualizado.setImagemUrl(nomeArquivo);
        }

        carrosselService.atualizar(id, itemAtualizado);
        return "redirect:/carrossel/admin?ok=editada";
    }

    @PostMapping("/toggle/{id}")
    public String toggleAtivo(@PathVariable Long id) {
        carrosselService.alternarAtivo(id);
        return "redirect:/carrossel/admin?ok=alternada";
    }

    @PostMapping("/excluir/{id}")
    public String excluirItem(@PathVariable Long id) {
        carrosselService.excluir(id);
        return "redirect:/carrossel/admin?ok=excluida";
    }
}