package com.receitas.site_receitas.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class UploadServiceTest {

    @TempDir
    Path tempDir;

    private UploadService uploadService;

    @BeforeEach
    void setUp() {
        uploadService = new UploadService(tempDir.toString());
    }

    @Test
    @DisplayName("Deve retornar null quando arquivo vazio")
    void deveRetornarNullQuandoArquivoVazio() throws Exception {
        MockMultipartFile arquivo = new MockMultipartFile("imagemFile", new byte[0]);

        String resultado = uploadService.salvarImagem(arquivo);

        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("Deve retornar null quando arquivo nulo")
    void deveRetornarNullQuandoArquivoNulo() throws Exception {
        String resultado = uploadService.salvarImagem(null);

        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("Deve salvar imagem com extensao valida")
    void deveSalvarImagemComExtensaoValida() throws Exception {
        MockMultipartFile arquivo = new MockMultipartFile(
                "imagemFile",
                "foto.jpg",
                "image/jpeg",
                "conteudo".getBytes()
        );

        String resultado = uploadService.salvarImagem(arquivo);

        assertThat(resultado).isNotNull();
        assertThat(resultado).endsWith(".jpg");
        assertThat(Files.exists(tempDir.resolve(resultado))).isTrue();
    }

    @Test
    @DisplayName("Deve salvar imagem com extensao longa como .bin")
    void deveSalvarImagemComExtensaoInvalida() throws Exception {
        MockMultipartFile arquivo = new MockMultipartFile(
                "imagemFile",
                "arquivo.python",
                "application/octet-stream",
                "conteudo".getBytes()
        );

        String resultado = uploadService.salvarImagem(arquivo);

        assertThat(resultado).isNotNull();
        assertThat(resultado).endsWith(".bin");
    }

    @Test
    @DisplayName("Nao deve apagar URL externa")
    void naoDeveApagarUrlExterna() {
        uploadService.excluirImagem("https://exemplo.com/imagem.jpg");

        assertThat(true).isTrue();
    }

    @Test
    @DisplayName("Nao deve lancar excecao ao apagar arquivo inexistente")
    void naoDeveLancarExcecaoAoApagarInexistente() {
        uploadService.excluirImagem("nao-existe.jpg");

        assertThat(true).isTrue();
    }

    @Test
    @DisplayName("Nao deve lancar excecao ao apagar arquivo nulo")
    void naoDeveLancarExcecaoAoApagarNulo() {
        uploadService.excluirImagem(null);

        assertThat(true).isTrue();
    }

    @Test
    @DisplayName("Deve apagar arquivo local existente")
    void deveApagarArquivoLocalExistente() throws Exception {
        Path arquivo = tempDir.resolve("imagem.jpg");
        Files.write(arquivo, "conteudo".getBytes());

        uploadService.excluirImagem("imagem.jpg");

        assertThat(Files.exists(arquivo)).isFalse();
    }
}