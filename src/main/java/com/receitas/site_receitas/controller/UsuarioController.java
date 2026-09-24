package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.AuthService;
import com.receitas.site_receitas.service.UsuarioService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@Tag(name = "Usuários", description = "Autenticação e gerenciamento de usuários")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthService authService;

    private Map<String, Object> usuarioParaMap(Usuario u) {
        Map<String, Object> mapa = new LinkedHashMap<>();
        mapa.put("id", u.getId());
        mapa.put("nome", u.getNome());
        mapa.put("email", u.getEmail());
        mapa.put("cpf", u.getCpf());
        mapa.put("telefone", u.getTelefone());
        mapa.put("genero", u.getGenero());
        mapa.put("dataCadastro", u.getDataCadastro() != null ? u.getDataCadastro().toString() : null);
        mapa.put("ativo", u.isAtivo());
        mapa.put("role", u.getRole());
        return mapa;
    }

    private Map<String, Object> respostaUsuario(Usuario usuario) {
        Map<String, Object> resposta = new LinkedHashMap<>();
        if (usuario == null) {
            resposta.put("usuario", null);
        } else {
            resposta.put("usuario", usuarioParaMap(usuario));
        }
        return resposta;
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

    @Operation(
        summary = "Cadastrar novo usuário",
        description = "Cria um novo usuário no sistema. Por padrão, a role é USER. Endpoint público."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Usuário cadastrado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"success\": true, \"message\": \"Cadastro realizado com sucesso!\"}")
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos ou email/CPF já cadastrado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"success\": false, \"message\": \"Email já cadastrado!\"}")
            )
        )
    })
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrarUsuario(
            @Parameter(description = "Dados do novo usuário", required = true)
            @RequestBody Usuario usuario) {
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
        description = "Autentica o usuário e cria a sessão. Retorna a URL de redirecionamento conforme a role. Endpoint público."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Login realizado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"success\": true, \"redirectUrl\": \"/\", \"role\": \"USER\", \"usuario\": {\"id\": 1, \"nome\": \"João Silva\"}}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Credenciais inválidas",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"success\": false, \"message\": \"Senha incorreta\"}")
            )
        )
    })
    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(
            @Parameter(description = "Credenciais de login (email e senha)", required = true)
            @RequestBody LoginRequest loginRequest,
            HttpSession session,
            HttpServletRequest request) {
        try {
            Usuario usuario = authService.autenticar(loginRequest.getEmail(), loginRequest.getSenha());

            authService.registrarSessao(usuario, session, request);

            String redirectUrl = "ADMIN".equals(usuario.getRole()) ? "/admin/dashboard" : "/";

            return ResponseEntity.ok().body(Map.of(
                    "success", true,
                    "redirectUrl", redirectUrl,
                    "role", usuario.getRole(),
                    "usuario", usuarioParaMap(usuario)
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
        @ApiResponse(
            responseCode = "200",
            description = "Logout realizado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Logout realizado com sucesso\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        authService.logout(session);
        return ResponseEntity.ok().body(Map.of("message", "Logout realizado com sucesso"));
    }

    @Operation(
        summary = "Editar perfil do usuário logado",
        description = "Atualiza os dados do perfil do usuário autenticado."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Perfil atualizado com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Perfil atualizado com sucesso\", \"usuario\": {\"id\": 1, \"nome\": \"João Silva\"}}")
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Dados inválidos (ex: email em uso por outro usuário)",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Este email já está em uso por outro usuário\"}")
            )
        ),
        @ApiResponse(
            responseCode = "401",
            description = "Usuário não autenticado",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"message\": \"Usuário não autenticado\"}")
            )
        )
    })
    @SecurityRequirement(name = "sessionAuth")
    @PostMapping("/perfil/editar")
    public ResponseEntity<?> editarPerfilUsuario(
            @Parameter(description = "Dados a serem atualizados", required = true)
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

            return ResponseEntity.ok().body(Map.of(
                    "message", "Perfil atualizado com sucesso",
                    "usuario", usuarioParaMap(usuarioAtualizado)
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
        description = "Retorna os dados completos do usuário autenticado. Se não houver usuário logado, retorna usuario=null com status 200."
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Retorna usuario (objeto) ou null",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{\"usuario\": null}")
            )
        )
    })
    @GetMapping("/perfil/usuario-logado")
    public ResponseEntity<?> getUsuarioLogado(Authentication authentication, HttpSession session) {
        try {
            String email = obterEmailUsuario(authentication, session);

            if (email == null) {
                return ResponseEntity.ok().body(respostaUsuario(null));
            }

            Optional<Usuario> usuarioOpt = usuarioService.findByEmail(email);

            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.ok().body(respostaUsuario(null));
            }

            Usuario usuario = usuarioOpt.get();
            session.setAttribute("usuarioLogado", usuario);

            return ResponseEntity.ok().body(respostaUsuario(usuario));
        } catch (Exception e) {
            return ResponseEntity.ok().body(respostaUsuario(null));
        }
    }

    @Operation(
        summary = "Listar todos os usuários",
        description = "Retorna a lista paginada de todos os usuários. Requer perfil ADMIN."
    )
    @SecurityRequirement(name = "sessionAuth")
    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios(
            @Parameter(description = "Número da página (começa em 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Quantidade de usuários por página", example = "10")
            @RequestParam(defaultValue = "10") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
            Page<Usuario> pagina = usuarioService.findAll(pageable);

            List<Map<String, Object>> lista = new ArrayList<>();
            for (Usuario u : pagina.getContent()) {
                lista.add(usuarioParaMap(u));
            }

            return ResponseEntity.ok(Map.of(
                    "usuarios", lista,
                    "currentPage", pagina.getNumber(),
                    "totalPages", pagina.getTotalPages(),
                    "totalItems", pagina.getTotalElements()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro ao listar usuários"));
        }
    }

    @Operation(
        summary = "Buscar usuário por ID",
        description = "Retorna os dados de um usuário específico. Requer perfil ADMIN."
    )
    @SecurityRequirement(name = "sessionAuth")
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> buscarUsuarioPorId(
            @Parameter(description = "ID do usuário", required = true, example = "1")
            @PathVariable Integer id) {
        Optional<Usuario> usuarioOpt = usuarioService.findById(id);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuário não encontrado"));
        }

        return ResponseEntity.ok(Map.of("usuario", usuarioParaMap(usuarioOpt.get())));
    }

    @Operation(
        summary = "Editar usuário",
        description = "Atualiza os dados de um usuário (admin). Requer perfil ADMIN."
    )
    @SecurityRequirement(name = "sessionAuth")
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> editarUsuario(
            @Parameter(description = "ID do usuário a ser editado", required = true, example = "1")
            @PathVariable Integer id,

            @Parameter(description = "Novos dados do usuário", required = true)
            @RequestBody Usuario usuario) {

        Optional<Usuario> existente = usuarioService.findById(id);

        if (existente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuário não encontrado"));
        }

        try {
            usuarioService.atualizarUsuario(id, usuario);
            Usuario atualizado = usuarioService.findById(id).orElse(null);

            return ResponseEntity.ok(Map.of(
                    "message", "Usuário atualizado com sucesso",
                    "usuario", usuarioParaMap(atualizado)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Erro ao atualizar usuário: " + e.getMessage()));
        }
    }

    @Operation(
        summary = "Ativar/desativar usuário",
        description = "Alterna o status entre ativo e inativo de um usuário. Requer perfil ADMIN."
    )
    @SecurityRequirement(name = "sessionAuth")
    @PatchMapping("/usuarios/{id}/ativar")
    public ResponseEntity<?> ativarDesativarUsuario(
            @Parameter(description = "ID do usuário", required = true, example = "1")
            @PathVariable Integer id) {
        Optional<Usuario> existente = usuarioService.findById(id);

        if (existente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuário não encontrado"));
        }

        try {
            Usuario atualizado = usuarioService.ativarDesativarUsuario(id);

            return ResponseEntity.ok(Map.of(
                    "message", "Status alterado com sucesso",
                    "usuario", usuarioParaMap(atualizado)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro ao alterar status"));
        }
    }

    @Operation(
        summary = "Excluir usuário",
        description = "Remove permanentemente um usuário do sistema. Requer perfil ADMIN."
    )
    @SecurityRequirement(name = "sessionAuth")
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> excluirUsuario(
            @Parameter(description = "ID do usuário a ser excluído", required = true, example = "1")
            @PathVariable Integer id) {
        Optional<Usuario> existente = usuarioService.findById(id);

        if (existente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Usuário não encontrado"));
        }

        try {
            usuarioService.excluirUsuario(id);
            return ResponseEntity.ok(Map.of("message", "Usuário excluído com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Erro ao excluir usuário"));
        }
    }

    @Schema(description = "Credenciais de login")
    public static class LoginRequest {
        @Schema(description = "Email do usuário", example = "joao@email.com")
        private String email;

        @Schema(description = "Senha do usuário", example = "senha123")
        private String senha;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }
}
