package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.AuthService;
import com.receitas.site_receitas.service.SiteConfigService;
import com.receitas.site_receitas.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/")
@Tag(name = "Autenticação", description = "Endpoints de login, cadastro e logout")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthService authService;

    @Autowired
    private SiteConfigService siteConfigService;

    @GetMapping("/login")
    public String loginPage() {
        return "redirect:/";
    }

    @GetMapping("/cadastro")
    public String cadastroPage() {
        return "redirect:/";
    }

    @Operation(
        summary = "Cadastrar novo usuário",
        description = "Cria um novo usuário no sistema. Verifica se email e CPF já existem."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário cadastrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos ou email/CPF já cadastrado",
                content = @Content(schema = @Schema(implementation = Map.class)))
    })
    @PostMapping("/cadastro")
    @ResponseBody
    public ResponseEntity<?> cadastrarUsuario(@RequestBody Usuario usuario) {
        if (usuario.getRole() == null || usuario.getRole().isEmpty()) {
            usuario.setRole("USER");
        }

        String resultado = usuarioService.cadastrarUsuario(usuario);
        if (resultado.contains("sucesso")) {
            return ResponseEntity.ok().body(Map.of("success", true, "message", resultado));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", resultado));
        }
    }

    @Operation(
        summary = "Realizar login",
        description = "Autentica um usuário com email e senha. Retorna a URL de redirecionamento baseada no perfil (ADMIN ou USER)."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
        @ApiResponse(responseCode = "401", description = "Credenciais inválidas"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<?> loginUsuario(
            @RequestBody LoginRequest loginRequest,
            HttpSession session,
            HttpServletRequest request) {
        try {
            Usuario usuario = authService.autenticar(loginRequest.getEmail(), loginRequest.getSenha());

            authService.registrarSessao(usuario, session, request);

            String redirectUrl = "ADMIN".equals(usuario.getRole()) ? "/usuarios" : "/";

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "redirectUrl", redirectUrl,
                    "role", usuario.getRole()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Erro interno do servidor"));
        }
    }

    @Operation(
        summary = "Realizar logout",
        description = "Invalida a sessão do usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso")
    })
    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<?> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.ok().body(Map.of("message", "Logout realizado com sucesso"));
    }

    @Operation(
        summary = "Editar perfil do usuário logado",
        description = "Atualiza os dados do perfil do usuário autenticado. Permite alterar nome, email, telefone, gênero e senha."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Perfil atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos, email em uso ou senhas não coincidem"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping("/perfil/editar")
    @ResponseBody
    public ResponseEntity<?> editarPerfilUsuario(
            @RequestBody Map<String, String> dados,
            Authentication authentication,
            HttpSession session) {
        try {
            String email = obterEmailUsuario(authentication, session);

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Usuário não autenticado"));
            }

            Usuario usuarioAtualizado = usuarioService.editarPerfil(email, dados);

            session.setAttribute("usuarioLogado", usuarioAtualizado);

            Map<String, Object> usuarioMap = usuarioService.criarMapaUsuario(usuarioAtualizado);

            return ResponseEntity.ok().body(Map.of(
                    "message", "Perfil atualizado com sucesso",
                    "usuario", usuarioMap
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno ao atualizar perfil"));
        }
    }

    @Operation(
        summary = "Buscar dados do usuário logado",
        description = "Retorna os dados completos do usuário autenticado (nome, email, cpf, telefone, gênero, data de cadastro, role)."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
        @ApiResponse(responseCode = "401", description = "Usuário não autenticado"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping("/perfil/usuario-logado")
    @ResponseBody
    public ResponseEntity<?> getUsuarioLogado(Authentication authentication, HttpSession session) {
        try {
            String email = obterEmailUsuario(authentication, session);

            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Usuário não autenticado"));
            }

            Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email);

            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Usuário não encontrado"));
            }

            Usuario usuario = usuarioOpt.get();
            session.setAttribute("usuarioLogado", usuario);

            Map<String, Object> usuarioMap = usuarioService.criarMapaUsuario(usuario);

            return ResponseEntity.ok().body(Map.of("usuario", usuarioMap));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro interno ao buscar dados do usuário"));
        }
    }

    @GetMapping("/usuarios")
    public String listarUsuarios(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model) {

        model.addAttribute("paginaAtual", "usuarios");

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Usuario> paginaUsuarios = usuarioService.findAll(pageable);

        model.addAttribute("usuarios", paginaUsuarios.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", paginaUsuarios.getTotalPages());
        model.addAttribute("totalItems", paginaUsuarios.getTotalElements());
        model.addAttribute("pageSize", size);

        String faviconUrl = siteConfigService.getFaviconUrl();
        model.addAttribute("faviconUrl", faviconUrl);

        return "admin/usuarios";
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
    public String editarUsuario(
            @PathVariable Integer id,
            @ModelAttribute Usuario usuario,
            @RequestParam(required = false) String confirmarSenha) {
        if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
            if (!usuario.getSenha().equals(confirmarSenha)) {
                return "redirect:/usuarios?error=Senhas não coincidem";
            }
        }
        usuarioService.atualizarUsuario(id, usuario);
        return "redirect:/usuarios";
    }

    private String obterEmailUsuario(Authentication authentication, HttpSession session) {
        if (authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {
            return authentication.getName();
        }

        Usuario sessionUser = (Usuario) session.getAttribute("usuarioLogado");
        if (sessionUser != null) {
            return sessionUser.getEmail();
        }

        return null;
    }

    public static class LoginRequest {
        private String email;
        private String senha;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }
}