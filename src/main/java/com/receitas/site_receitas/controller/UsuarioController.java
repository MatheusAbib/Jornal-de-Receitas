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


import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/") 
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    

@PostMapping("/cadastro")
public String cadastrarUsuario(@ModelAttribute Usuario usuario, HttpSession session) {
    // Role padrão
    if(usuario.getRole() == null || usuario.getRole().isEmpty()){
        usuario.setRole("USER");
    }

    // Apenas um admin logado pode criar outro admin
    Usuario logado = (Usuario) session.getAttribute("usuarioLogado");
    if("ADMIN".equals(usuario.getRole()) && (logado == null || !"ADMIN".equals(logado.getRole()))){
        return "redirect:/cadastro?error=Somente administradores podem criar outro admin";
    }

    String resultado = usuarioService.cadastrarUsuario(usuario);
    if (resultado.contains("sucesso")) {
        return "redirect:/cadastro?success=" + resultado;
    } else {
        return "redirect:/cadastro?error=" + resultado;
    }
}

    
    @GetMapping("/cadastro")
    public String mostrarFormulario() {
        return "cadastro"; 
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> loginUsuario(@RequestBody LoginRequest loginRequest, HttpSession session) {
        try {
            Optional<Usuario> usuarioOptional = usuarioService.findByEmail(loginRequest.getEmail());
            
            if (usuarioOptional.isPresent()) {
                Usuario usuario = usuarioOptional.get();
                
                // Verificar senha com BCrypt
                if (passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())) {
                    session.setAttribute("usuarioLogado", usuario);
                        return ResponseEntity.ok().body(Map.of(
                            "message", "Login realizado com sucesso",
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
                        .body(Map.of("message", "Senha incorreta"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuário não encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Erro interno do servidor"));
        }
    }

    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().body(Map.of("message", "Logout realizado com sucesso"));
    }

    // Classe para receber os dados de login
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
    return "usuarios"; // referencia ao usuarios.html
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

@PostMapping("/usuarios/editar/{id}")
public String editarUsuario(@PathVariable Integer id, @ModelAttribute Usuario usuario, @RequestParam(required = false) String confirmarSenha) {
    // Se senha estiver vazia, não atualiza
    if(usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
        if(!usuario.getSenha().equals(confirmarSenha)) {
            // você pode redirecionar com erro
            return "redirect:/usuarios?error=Senhas não coincidem";
        }
    }
    usuarioService.atualizarUsuario(id, usuario);
    return "redirect:/usuarios";
}


}