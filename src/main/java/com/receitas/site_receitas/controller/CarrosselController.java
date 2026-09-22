package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.CarrosselItem;
import com.receitas.site_receitas.service.CarrosselService;
import com.receitas.site_receitas.service.SiteConfigService;
import com.receitas.site_receitas.service.UploadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Controller
@RequestMapping("/carrossel")
@Tag(name = "Carrossel", description = "Endpoints de gerenciamento do carrossel de imagens da home")
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

    @Operation(
        summary = "Adicionar item ao carrossel",
        description = "Cria um novo item no carrossel. Aceita URL de imagem ou upload de arquivo. Se um arquivo for enviado, ele é salvo em /uploads e seu nome substitui a URL."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "302", description = "Item adicionado e redirecionado para o admin do carrossel"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
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

    @Operation(
        summary = "Editar item do carrossel",
        description = "Atualiza um item existente do carrossel. Aceita URL de imagem ou upload de arquivo. Se um arquivo for enviado, ele é salvo em /uploads e seu nome substitui a URL."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "302", description = "Item atualizado e redirecionado para o admin do carrossel"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
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

    @Operation(
        summary = "Alternar status do item do carrossel",
        description = "Ativa ou desativa um item do carrossel. Itens inativos não aparecem na home."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "302", description = "Status alterado e redirecionado para o admin do carrossel"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping("/toggle/{id}")
    public String toggleAtivo(@PathVariable Long id) {
        carrosselService.alternarAtivo(id);
        return "redirect:/carrossel/admin?ok=alternada";
    }

    @Operation(
        summary = "Excluir item do carrossel",
        description = "Remove permanentemente um item do carrossel."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "302", description = "Item excluído e redirecionado para o admin do carrossel"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping("/excluir/{id}")
    public String excluirItem(@PathVariable Long id) {
        carrosselService.excluir(id);
        return "redirect:/carrossel/admin?ok=excluida";
    }
}