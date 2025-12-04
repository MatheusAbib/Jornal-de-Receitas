package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.repository.ReceitaRepository;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.repository.UsuarioRepository;
import com.receitas.site_receitas.service.CellarService;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class ReceitaController {

    private final ReceitaRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final CellarService cellarService;

    public ReceitaController(ReceitaRepository repository, UsuarioRepository usuarioRepository, CellarService cellarService) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.cellarService = cellarService;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("receitas", repository.findByAprovadaTrue());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getName().equals("anonymousUser")) {
            String email = authentication.getName();
            Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
            if (usuario.isPresent()) {
                model.addAttribute("nomeUsuario", usuario.get().getNome());
            } else {
                model.addAttribute("nomeUsuario", email);
            }
        }

        return "index"; 
    }

    @GetMapping("/nova")
    public String novaReceitaForm(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getName().equals("anonymousUser")) {
            return "redirect:/";
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        Receita receita = new Receita();
        receita.setPorcoes(1);
        receita.setChefe(usuarioOpt.map(Usuario::getNome).orElse(email));

        model.addAttribute("receita", receita);
        model.addAttribute("nomeUsuario", usuarioOpt.map(Usuario::getNome).orElse(email));

        return "form";
    }

    @PostMapping("/salvar")
    public String salvarReceita(@ModelAttribute Receita receita,
                                @RequestParam("imagemFile") MultipartFile imagemFile,
                                @RequestParam(required = false, name = "ingredientes[]") List<String> ingredientes,
                                @RequestParam(required = false, name = "modoPreparo[]") List<String> modoPreparo,
                                Model model) throws Exception {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            authentication.getName().equals("anonymousUser")) {
            return "redirect:/";
        }

        String email = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        usuarioOpt.ifPresent(receita::setUsuario);
        if (receita.getChefe() == null || receita.getChefe().trim().isEmpty()) {
            receita.setChefe(usuarioOpt.map(Usuario::getNome).orElse(email));
        }

        // Processa ingredientes
        if (ingredientes != null && !ingredientes.isEmpty()) {
            receita.setIngredientes(String.join("||", ingredientes.stream()
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList()));
        } else {
            receita.setIngredientes("");
        }

        // Processa modo de preparo
        if (modoPreparo != null && !modoPreparo.isEmpty()) {
            receita.setModoPreparo(String.join("||", modoPreparo.stream()
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList()));
        } else {
            receita.setModoPreparo("");
        }

        // Salva imagem no Cellar
        if (!imagemFile.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + imagemFile.getOriginalFilename();
            cellarService.uploadFile(filename, imagemFile);
            String imageUrl = cellarService.getFileUrl(filename);
            receita.setImagem(imageUrl);
        }

        receita.setAprovada(false);
        repository.save(receita);
        model.addAttribute("sucesso", "Receita enviada para aprovação!");

        Receita novaReceita = new Receita();
        novaReceita.setPorcoes(1);
        novaReceita.setChefe(usuarioOpt.map(Usuario::getNome).orElse(email));
        model.addAttribute("receita", novaReceita);
        model.addAttribute("nomeUsuario", usuarioOpt.map(Usuario::getNome).orElse(email));

        return "form";
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
        if (receita == null) return "redirect:/";

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

    @PostMapping("/receitas/excluir/{id}")
    @ResponseBody
    public ResponseEntity<?> excluirReceita(@PathVariable Long id) {
        try {
            if (!repository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Receita não encontrada"));
            }

            Receita receita = repository.findById(id).orElse(null);

            // Remover imagem do Cellar (opcional: pode manter se quiser histórico)
            // Se quiser deletar do S3, podemos adicionar método deleteFile(filename) no CellarService

            repository.deleteById(id);

            return ResponseEntity.ok(Map.of(
                "message", "Receita excluída com sucesso",
                "id", id
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erro interno ao excluir receita: " + e.getMessage()));
        }
    }
}
