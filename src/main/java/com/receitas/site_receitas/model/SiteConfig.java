package com.receitas.site_receitas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "site_config")
@Getter
@Setter
public class SiteConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String chave;

    @Column(columnDefinition = "TEXT")
    private String valor;

    private String descricao;

    private boolean ativo = true;

    public SiteConfig() {
    }
}
