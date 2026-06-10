package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.security.core.Authentication;
import com.receitas.site_receitas.service.SiteConfigService;


import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/") 
public class UsuarioController {

  @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Autowired 
    private SiteConfigService siteConfigService;

@PostMapping("/cadastro")
@ResponseBody
public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario, HttpSession session) {
    if(usuario.getRole() == null || usuario.getRole().isEmpty()){
        usuario.setRole("USER");
    }

    String resultado = usuarioService.cadastrarUsuario(usuario);
    if (resultado.contains("sucesso")) {
        return ResponseEntity.ok().body(Map.of("success", true, "message", resultado));
    } else {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", resultado));
    }
}
    
@GetMapping("/cadastro")
public String mostrarFormulario(Model model) { 
    String faviconUrl = siteConfigService.getFaviconUrl();
    model.addAttribute("faviconUrl", faviconUrl);
    return "cadastro"; 
}

   @PostMapping("/login")
@ResponseBody
public ResponseEntity<?> loginUsuario(@RequestBody LoginRequest loginRequest, 
                                     HttpSession session,
                                     Authentication authentication) {
    try {
        Optional<Usuario> usuarioOptional = usuarioService.findByEmail(loginRequest.getEmail());
        
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            
            if (passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
                session.setAttribute("usuarioLogado", usuario);
                
                System.out.println("Login bem-sucedido para: " + usuario.getEmail());
                System.out.println("Sessão ID: " + session.getId());
                System.out.println("Usuário salvo na sessão: " + usuario.getNome());
                
                return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "redirectUrl", "/",
                    "usuario", Map.of(
                        "id", usuario.getId(),
                        "nome", usuario.getNome(),
                        "email", usuario.getEmail(),
                        "cpf", usuario.getCpf(),
                        "telefone", usuario.getTelefone(),
                        "genero", usuario.getGenero(),
                        "dataCadastro", usuario.getDataCadastro()
                    )
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Senha incorreta"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "Usuário não encontrado"));
        }
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("success", false, "message", "Erro interno do servidor"));
    }
}

    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().body(Map.of("message", "Logout realizado com sucesso"));
    }

    public static class LoginRequest {
        private String email;
        private String senha;
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }


@GetMapping("/usuarios")
public String listarUsuarios(Model model) {
    model.addAttribute("usuarios", usuarioService.findAll());
    
    String faviconUrl = siteConfigService.getFaviconUrl();
    model.addAttribute("faviconUrl", faviconUrl);
    
    return "usuarios"; 
}

@PostMapping("/usuarios/excluir/{id}")
public String excluirUsuario(@PathVariable Integer id) {
    usuarioService.excluirUsuario(id);
    return "redirect:/usuarios";
}

@PostMapping("/usuarios/ativar/{id}")
public String ativarDesativarUsuario(@PathVariable Integer id) {
    usuarioService.ativarDesativarUsuario(id);
    return "redirect:/usuarios";
}

@PostMapping("/perfil/editar")
@ResponseBody
public ResponseEntity<?> editarPerfilUsuario(@RequestBody java.util.Map<String, String> dados,
                                            Authentication authentication,
                                            HttpSession session) {
    try {
        String email = null;
        
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            email = authentication.getName();
        }
        
        if (email == null) {
            Usuario sessionUser = (Usuario) session.getAttribute("usuarioLogado");
            if (sessionUser != null) {
                email = sessionUser.getEmail();
            }
        }
        
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Usuário não autenticado"));
        }

        Optional<Usuario> usuarioOptional = usuarioService.findByEmail(email);
        
        if (usuarioOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Usuário não encontrado"));
        }

        Usuario usuarioAtualizado = usuarioOptional.get();
        
        if (dados.containsKey("nome") && dados.get("nome") != null) {
            usuarioAtualizado.setNome(dados.get("nome"));
        }
        if (dados.containsKey("email") && dados.get("email") != null) {
            String novoEmail = dados.get("email");
            if (!novoEmail.equals(email)) {
                Optional<Usuario> usuarioComEmail = usuarioService.findByEmail(novoEmail);
                if (usuarioComEmail.isPresent()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Este email já está em uso por outro usuário"));
                }
            }
            usuarioAtualizado.setEmail(novoEmail);
        }
        if (dados.containsKey("telefone")) {
            usuarioAtualizado.setTelefone(dados.get("telefone"));
        }
        if (dados.containsKey("genero")) {
            usuarioAtualizado.setGenero(dados.get("genero"));
        }
        
        if (dados.containsKey("senha") && dados.get("senha") != null && !dados.get("senha").isEmpty()) {
            String novaSenha = dados.get("senha");
            String confirmarSenha = dados.get("confirmarSenha");
            
            if (!novaSenha.equals(confirmarSenha)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Senhas não coincidem"));
            }
            usuarioAtualizado.setSenha(passwordEncoder.encode(novaSenha));
        }

        usuarioService.salvarUsuario(usuarioAtualizado);
        
        session.setAttribute("usuarioLogado", usuarioAtualizado);
        
        java.util.Map<String, Object> usuarioMap = new java.util.HashMap<>();
        usuarioMap.put("id", usuarioAtualizado.getId());
        usuarioMap.put("nome", usuarioAtualizado.getNome() != null ? usuarioAtualizado.getNome() : "");
        usuarioMap.put("email", usuarioAtualizado.getEmail() != null ? usuarioAtualizado.getEmail() : "");
        usuarioMap.put("cpf", usuarioAtualizado.getCpf() != null ? usuarioAtualizado.getCpf() : "");
        usuarioMap.put("telefone", usuarioAtualizado.getTelefone() != null ? usuarioAtualizado.getTelefone() : "");
        usuarioMap.put("genero", usuarioAtualizado.getGenero() != null ? usuarioAtualizado.getGenero() : "");
        usuarioMap.put("dataCadastro", usuarioAtualizado.getDataCadastro() != null ? usuarioAtualizado.getDataCadastro().toString() : "");
        
        return ResponseEntity.ok().body(Map.of(
            "message", "Perfil atualizado com sucesso",
            "usuario", usuarioMap
        ));
        
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Erro interno ao atualizar perfil: " + e.getMessage()));
    }
}

@PostMapping("/usuarios/editar/{id}")
public String editarUsuario(@PathVariable Integer id, @ModelAttribute Usuario usuario, 
                           @RequestParam(required = false) String confirmarSenha) {
    if(usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
        if(!usuario.getSenha().equals(confirmarSenha)) {
            return "redirect:/usuarios?error=Senhas não coincidem";
        }
    }
    usuarioService.atualizarUsuario(id, usuario);
    return "redirect:/usuarios";
}

@GetMapping("/perfil/usuario-logado")
@ResponseBody
public ResponseEntity<?> getUsuarioLogado(Authentication authentication, HttpSession session) {
    try {
        String email = null;
        
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName())) {
            email = authentication.getName();
        }
        
        if (email == null) {
            Usuario sessionUser = (Usuario) session.getAttribute("usuarioLogado");
            if (sessionUser != null) {
                email = sessionUser.getEmail();
            }
        }
        
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Usuário não autenticado"));
        }

        Optional<Usuario> usuarioOptional = usuarioService.findByEmail(email);
        
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            session.setAttribute("usuarioLogado", usuario);
            
            java.util.Map<String, Object> usuarioMap = new java.util.HashMap<>();
            usuarioMap.put("id", usuario.getId());
            usuarioMap.put("nome", usuario.getNome() != null ? usuario.getNome() : "");
            usuarioMap.put("email", usuario.getEmail() != null ? usuario.getEmail() : "");
            usuarioMap.put("cpf", usuario.getCpf() != null ? usuario.getCpf() : "");
            usuarioMap.put("telefone", usuario.getTelefone() != null ? usuario.getTelefone() : "");
            usuarioMap.put("genero", usuario.getGenero() != null ? usuario.getGenero() : "");
            usuarioMap.put("dataCadastro", usuario.getDataCadastro() != null ? usuario.getDataCadastro().toString() : "");
            usuarioMap.put("role", usuario.getRole() != null ? usuario.getRole() : "");
            
            return ResponseEntity.ok().body(Map.of("usuario", usuarioMap));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Usuário não encontrado"));
        }
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("message", "Erro interno ao buscar dados do usuário: " + e.getMessage()));
    }
}

}

