package com.receitas.site_receitas.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UploadService {

    private static final String UPLOAD_DIR = "uploads/";

    public String salvarImagem(MultipartFile arquivo) throws IOException {
        if (arquivo == null || arquivo.isEmpty()) {
            return null;
        }

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        String nomeArquivo = UUID.randomUUID() + obterExtensaoSegura(arquivo.getOriginalFilename());

        Path destino = Paths.get(UPLOAD_DIR, nomeArquivo);
        Files.write(destino, arquivo.getBytes());

        return nomeArquivo;
    }

    public void excluirImagem(String nomeArquivo) {
        if (nomeArquivo == null || nomeArquivo.startsWith("http")) {
            return;
        }
        try {
            Files.deleteIfExists(Paths.get(UPLOAD_DIR, nomeArquivo));
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