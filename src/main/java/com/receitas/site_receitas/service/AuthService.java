package com.receitas.site_receitas.service;

import com.receitas.site_receitas.model.Usuario;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UsuarioService usuarioService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UsuarioService usuarioService, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
    }

    public Usuario autenticar(String email, String senha) {
        Usuario usuario = usuarioService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!usuario.isAtivo()) {
            throw new RuntimeException("Conta desativada. Contate o administrador.");
        }

        String senhaSalva = usuario.getSenha();

        if (senhaSalva == null && usuario.getGoogleSub() != null) {
            throw new RuntimeException("Esta conta usa o Google. Selecione Continuar com o Google.");
        }

        if (senha == null || senhaSalva == null || !passwordEncoder.matches(senha, senhaSalva)) {
            throw new RuntimeException("Senha incorreta");
        }

        return usuario;
    }

    public void registrarSessao(Usuario usuario, HttpSession session, HttpServletRequest request) {
        session.setAttribute("usuarioLogado", usuario);

        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(
                        usuario.getEmail(),
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRole()))
                );

        SecurityContextHolder.getContext().setAuthentication(authToken);
        request.getSession().setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
        );
    }

    public void logout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext();
    }
}