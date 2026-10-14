package com.receitas.site_receitas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UploadService {

    private final Path uploadDir;

    public UploadService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String salvarImagem(MultipartFile arquivo) throws IOException {
        if (arquivo == null || arquivo.isEmpty()) {
            return null;
        }

        Files.createDirectories(uploadDir);

        String nomeArquivo = UUID.randomUUID() + obterExtensaoSegura(arquivo.getOriginalFilename());

        Path destino = uploadDir.resolve(nomeArquivo);
        Files.write(destino, arquivo.getBytes());

        return nomeArquivo;
    }

    public void excluirImagem(String nomeArquivo) {
        if (nomeArquivo == null || nomeArquivo.startsWith("http")) {
            return;
        }
        try {
            Files.deleteIfExists(uploadDir.resolve(nomeArquivo));
        } catch (IOException e) {
        }
    }

    private String obterExtensaoSegura(String nomeOriginal) {
        if (nomeOriginal == null || !nomeOriginal.contains(".")) {
            return ".bin";
        }
        String ext = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        if (ext.matches("\\.[a-zA-Z0-9]{1,5}")) {
            return ext.toLowerCase();
        }
        return ".bin";
    }
}