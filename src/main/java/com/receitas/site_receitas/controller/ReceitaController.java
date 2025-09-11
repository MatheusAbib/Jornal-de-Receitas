package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.repository.ReceitaRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class ReceitaController {

    private final ReceitaRepository repository;

    public ReceitaController(ReceitaRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("receitas", repository.findByAprovadaTrue());
        return "index"; 
    }

@GetMapping("/nova")
public String novaReceitaForm(Model model) {
    Receita receita = new Receita();
    receita.setPorcoes(1); // valor padrão
    model.addAttribute("receita", receita);
    return "form";
}


   @PostMapping("/salvar")
public String salvarReceita(@ModelAttribute Receita receita,
                            @RequestParam("imagemFile") MultipartFile imagemFile,
                            @RequestParam(required = false, name = "ingredientes[]") List<String> ingredientes,
                            @RequestParam(required = false, name = "modoPreparo[]") List<String> modoPreparo) throws Exception {

    // Converte a lista em uma única string separada por vírgula e espaço
    if (ingredientes != null && !ingredientes.isEmpty()) {
        // Remove quebras de linha e espaços extras
// Armazena cada ingrediente como está, sem juntar tudo em uma string
receita.setIngredientes(String.join("||", ingredientes.stream()
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .toList()));

    } else {
        receita.setIngredientes("");
    }

    if (modoPreparo != null && !modoPreparo.isEmpty()) {
receita.setModoPreparo(String.join("||", modoPreparo.stream()
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .toList()));

    } else {
        receita.setModoPreparo("");
    }

    // Salva imagem
    if (!imagemFile.isEmpty()) {
        String uploadDir = "uploads/";
        Files.createDirectories(Paths.get(uploadDir));
        String filename = System.currentTimeMillis() + "_" + imagemFile.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);
        Files.write(filePath, imagemFile.getBytes());
        receita.setImagem(filename);
    }

    receita.setAprovada(false);
    repository.save(receita);
    return "redirect:/pendentes";
}


    @GetMapping("/pendentes")
    public String pendentes(Model model) {
        model.addAttribute("receitas", repository.findByAprovadaFalse());
        return "pendentes"; 
    }

    @PostMapping("/aprovar/{id}")
    public String aprovarReceita(@PathVariable Long id) {
        Receita receita = repository.findById(id).orElse(null);
        if (receita != null) {
            receita.setAprovada(true);
            repository.save(receita);
        }
        return "redirect:/pendentes";
    }

    @PostMapping("/rejeitar/{id}")
    public String rejeitarReceita(@PathVariable Long id) {
        repository.deleteById(id);
        return "redirect:/pendentes";
    }

    @GetMapping("/detalhe/{id}")
    public String detalheReceita(@PathVariable Long id, Model model) {
        Receita receita = repository.findById(id).orElse(null);
        if (receita == null) {
            return "redirect:/";
        }

        // Converte os ingredientes e modo de preparo em lista para exibição
        List<String> ingredientesList = receita.getIngredientes() != null ?
Arrays.stream(receita.getIngredientes().split("\\|\\|"))
                      .filter(s -> !s.isEmpty())
                      .toList()
                : List.of();

        List<String> modoPreparoList = receita.getModoPreparo() != null ?
Arrays.stream(receita.getModoPreparo().split("\\|\\|"))
                      .filter(s -> !s.isEmpty())
                      .toList()
                : List.of();

        model.addAttribute("receita", receita);
        model.addAttribute("ingredientesList", ingredientesList);
        model.addAttribute("modoPreparoList", modoPreparoList);

        return "detalhe";
    }


    
}
