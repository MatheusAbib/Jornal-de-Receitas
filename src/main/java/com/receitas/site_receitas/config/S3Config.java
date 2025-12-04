package com.receitas.site_receitas.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import java.net.URI;

@Configuration
public class S3Config {

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials credentials = AwsBasicCredentials.create(
                System.getenv("CELLAR_S3_KEY"),
                System.getenv("CELLAR_S3_SECRET")
        );

        return S3Client.builder()
                .endpointOverride(URI.create("https://" + System.getenv("CELLAR_S3_HOST")))
                .credentialsProvider(StaticCredentialsProvider.create(credentials))
                .region(Region.US_EAST_1) // qualquer região, Cellar ignora
                .build();
    }
}
