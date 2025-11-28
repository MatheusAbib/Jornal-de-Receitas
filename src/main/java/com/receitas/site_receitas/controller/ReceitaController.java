package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.repository.ReceitaRepository;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.repository.UsuarioRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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

    public ReceitaController(ReceitaRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

@GetMapping("/")
public String index(Model model) {
    model.addAttribute("receitas", repository.findByAprovadaTrue());
    
    // Adiciona o nome do usuário logado ao model
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated() && 
        !authentication.getName().equals("anonymousUser")) {
        
        String email = authentication.getName();
        System.out.println("Email do usuário autenticado: " + email); // Debug
        
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        
        if (usuario.isPresent()) {
            System.out.println("Usuário encontrado: " + usuario.get().getNome()); // Debug
            model.addAttribute("nomeUsuario", usuario.get().getNome());
        } else {
            System.out.println("Usuário NÃO encontrado no banco para email: " + email); // Debug
            model.addAttribute("nomeUsuario", email); // fallback para email
        }
    } else {
        System.out.println("Usuário não autenticado ou anonymous"); // Debug
    }
    
    return "index"; 
}

@GetMapping("/nova")
public String novaReceitaForm(Model model) {
    // Verifica se o usuário está autenticado
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated() || 
        authentication.getName().equals("anonymousUser")) {
        // Redireciona para a página inicial se não estiver logado
        return "redirect:/";
    }
    
    Receita receita = new Receita();
    receita.setPorcoes(1); 
    model.addAttribute("receita", receita);
    return "form";
}

   @PostMapping("/salvar")
public String salvarReceita(@ModelAttribute Receita receita,
                            @RequestParam("imagemFile") MultipartFile imagemFile,
                            @RequestParam(required = false, name = "ingredientes[]") List<String> ingredientes,
                            @RequestParam(required = false, name = "modoPreparo[]") List<String> modoPreparo,
                            Model model) throws Exception {

    // Verifica se o usuário está autenticado
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated() || 
        authentication.getName().equals("anonymousUser")) {
        // Redireciona para a página inicial se não estiver logado
        return "redirect:/";
    }

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
    
    model.addAttribute("sucesso", "Receita enviada para aprovação!");

    // Cria uma nova receita vazia para o formulário
    Receita novaReceita = new Receita();
    novaReceita.setPorcoes(1);
    model.addAttribute("receita", novaReceita);

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