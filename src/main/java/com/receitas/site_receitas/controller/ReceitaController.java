package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.repository.ReceitaRepository;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.repository.UsuarioRepository;
import com.receitas.site_receitas.model.CarrosselItem;
import com.receitas.site_receitas.repository.CarrosselRepository;
import com.receitas.site_receitas.service.SiteConfigService; 

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
    
    @Autowired
    private CarrosselRepository carrosselRepository;
    
    @Autowired
    private SiteConfigService siteConfigService; 

    public ReceitaController(ReceitaRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

@GetMapping("/")
public String index(Model model) {
    model.addAttribute("receitas", repository.findByAprovadaTrue());
    
    List<CarrosselItem> carrosselItens = carrosselRepository.findByAtivoTrueOrderByOrdemExibicaoAsc();
    model.addAttribute("carrosselItens", carrosselItens);
    
        String faviconUrl = siteConfigService.getConfigValue("favicon_url");
        String ganacheUrl = siteConfigService.getConfigValue("ganache_url");
        String sopaUrl = siteConfigService.getConfigValue("sopa_url");
        String pestoUrl = siteConfigService.getConfigValue("pesto_url");
        String bolinhoUrl = siteConfigService.getConfigValue("bolinho_url");

        model.addAttribute("faviconUrl", faviconUrl);
        model.addAttribute("ganacheUrl", ganacheUrl);
        model.addAttribute("sopaUrl", sopaUrl);
        model.addAttribute("pestoUrl", pestoUrl);
        model.addAttribute("bolinhoUrl", bolinhoUrl);

    
    System.out.println("Carregando " + carrosselItens.size() + " itens do carrossel"); 
    System.out.println("Favicon URL: " + faviconUrl); 
    System.out.println("Ganache URL: " + ganacheUrl); 
    
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.isAuthenticated() && 
        !authentication.getName().equals("anonymousUser")) {
        
        String email = authentication.getName();
        System.out.println("Email do usuário autenticado: " + email); 
        
        Optional<Usuario> usuario = usuarioRepository.findByEmail(email);
        
        if (usuario.isPresent()) {
            System.out.println("Usuário encontrado: " + usuario.get().getNome()); 
            model.addAttribute("nomeUsuario", usuario.get().getNome());
        } else {
            System.out.println("Usuário NÃO encontrado no banco para email: " + email); 
            model.addAttribute("nomeUsuario", email); 
        }
    } else {
        System.out.println("Usuário não autenticado ou anonymous"); 
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
    
    if (usuarioOpt.isPresent()) {
        receita.setChefe(usuarioOpt.get().getNome());
    } else {
        receita.setChefe(email); 
    }
    
    model.addAttribute("receita", receita);
    
    if (usuarioOpt.isPresent()) {
        model.addAttribute("nomeUsuario", usuarioOpt.get().getNome());
    } else {
        model.addAttribute("nomeUsuario", email);
    }
    
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
    
    if (usuarioOpt.isPresent()) {
        receita.setUsuario(usuarioOpt.get());
        
        if (receita.getChefe() == null || receita.getChefe().trim().isEmpty()) {
            receita.setChefe(usuarioOpt.get().getNome());
        }
    } else {
        if (receita.getChefe() == null || receita.getChefe().trim().isEmpty()) {
            receita.setChefe(email);
        }
    }

    if (ingredientes != null && !ingredientes.isEmpty()) {
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

    Receita novaReceita = new Receita();
    novaReceita.setPorcoes(1);
    
    if (usuarioOpt.isPresent()) {
        novaReceita.setChefe(usuarioOpt.get().getNome());
    } else {
        novaReceita.setChefe(email);
    }
    
    model.addAttribute("receita", novaReceita);
    
    if (usuarioOpt.isPresent()) {
        model.addAttribute("nomeUsuario", usuarioOpt.get().getNome());
    } else {
        model.addAttribute("nomeUsuario", email);
    }

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
        
        if (receita != null && receita.getImagem() != null && !receita.getImagem().startsWith("http")) {
            try {
                Path imagePath = Paths.get("uploads/" + receita.getImagem());
                Files.deleteIfExists(imagePath);
            } catch (IOException e) {
                System.err.println("Erro ao excluir imagem: " + e.getMessage());
            }
        }
        
        repository.deleteById(id);
        
        return ResponseEntity.ok().body(Map.of(
            "message", "Receita excluída com sucesso",
            "id", id
        ));
        
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Erro interno ao excluir receita: " + e.getMessage()));
    }
}

    @GetMapping("/debug/carrossel")
    @ResponseBody
    public List<CarrosselItem> debugCarrossel() {
        List<CarrosselItem> itens = carrosselRepository.findByAtivoTrueOrderByOrdemExibicaoAsc();
        System.out.println("DEBUG - Itens do carrossel encontrados: " + itens.size());
        for (CarrosselItem item : itens) {
            System.out.println("Item: " + item.getTitulo() + " - URL: " + item.getImagemUrl());
        }
        return itens;
    }

@GetMapping("/sobre")
public String sobre(Model model) {
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
    
    return "sobre"; 
}
}