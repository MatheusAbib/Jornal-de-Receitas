package com.receitas.site_receitas.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
public class CellarService {

    private final S3Client s3Client;
    private final String bucket = System.getenv("CELLAR_S3_BUCKET");

    public CellarService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    // Faz upload de um arquivo MultipartFile para o S3
    public void uploadFile(String fileName, MultipartFile file) throws IOException {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)
                .build();

        s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
    }

    // Retorna a URL pública do arquivo no Cellar
    public String getFileUrl(String fileName) {
        return "https://" + bucket + "." + System.getenv("CELLAR_S3_HOST") + "/" + fileName;
    }

    // Deleta um arquivo do S3
    public void deleteFile(String fileName) {
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)
                .build();
        s3Client.deleteObject(request);
    }
}
