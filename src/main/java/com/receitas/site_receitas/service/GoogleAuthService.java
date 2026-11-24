package com.receitas.site_receitas.service;

import com.receitas.site_receitas.dao.usuario.IUsuarioDAO;
import com.receitas.site_receitas.factory.UsuarioFactory;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.service.GoogleTokenService.ContaGoogle;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class GoogleAuthService {

    private final IUsuarioDAO usuarioDAO;
    private final EstatisticasService estatisticasService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    public GoogleAuthService(
            IUsuarioDAO usuarioDAO,
            EstatisticasService estatisticasService,
            BCryptPasswordEncoder passwordEncoder,
            EntityManager entityManager
    ) {
        this.usuarioDAO = usuarioDAO;
        this.estatisticasService = estatisticasService;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
    }

    @Transactional
    public Usuario autenticarOuCadastrar(ContaGoogle contaGoogle) {
        Optional<Usuario> contaVinculada = usuarioDAO.buscarPorGoogleSub(contaGoogle.sub());

        if (contaVinculada.isPresent()) {
            Usuario usuario = contaVinculada.get();
            verificarContaAtiva(usuario);
            return usuario;
        }

        if (usuarioDAO.existePorEmail(contaGoogle.email())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esse e-mail já está cadastrado. Entre na sua conta para vincular o Google."
            );
        }

        String nome = contaGoogle.nome();
        if (nome == null || nome.isBlank()) {
            nome = contaGoogle.email();
        }

        Usuario novo = UsuarioFactory.criarCliente(
                nome,
                contaGoogle.email(),
                null,
                null
        );
        novo.setGoogleSub(contaGoogle.sub());

        Usuario salvo = usuarioDAO.salvar(novo);
        estatisticasService.criarParaUsuario(salvo);
        return salvo;
    }

    @Transactional
    public void vincular(String emailSessao, String senhaAtual, ContaGoogle contaGoogle) {
        Usuario usuario = usuarioDAO.buscarPorEmail(emailSessao)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Entre novamente na sua conta do Jornal de Receitas."
                ));

        entityManager.refresh(usuario, LockModeType.PESSIMISTIC_WRITE);

        if (!usuario.getEmail().equals(emailSessao)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Entre novamente na sua conta do Jornal de Receitas."
            );
        }

        verificarContaAtiva(usuario);

        String senhaSalva = usuario.getSenha();
        if (senhaAtual == null || senhaAtual.isBlank()
                || senhaSalva == null || !passwordEncoder.matches(senhaAtual, senhaSalva)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Senha atual incorreta."
            );
        }

        if (contaGoogle.sub().equals(usuario.getGoogleSub())) {
            return;
        }

        if (!usuario.getEmail().equalsIgnoreCase(contaGoogle.email())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selecione a conta Google com o mesmo e-mail do seu perfil."
            );
        }

        if (usuario.getGoogleSub() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Seu perfil já tem uma conta Google vinculada."
            );
        }

        if (usuarioDAO.buscarPorGoogleSub(contaGoogle.sub()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Essa conta Google já está vinculada a outro perfil."
            );
        }

        usuario.setGoogleSub(contaGoogle.sub());
        usuarioDAO.salvar(usuario);
    }

    private void verificarContaAtiva(Usuario usuario) {
        if (!usuario.isAtivo()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Conta desativada. Contate o administrador."
            );
        }
    }
}