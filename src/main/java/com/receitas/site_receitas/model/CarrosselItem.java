package com.receitas.site_receitas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "carrossel")
@Getter
@Setter
public class CarrosselItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "imagem_url", columnDefinition = "TEXT", nullable = false)
    private String imagemUrl;

    @Column(name = "ativo", nullable = false)
    private boolean ativo = true;

    @Column(name = "ordem_exibicao")
    private Integer ordemExibicao;

    @Column(name = "link_destino")
    private String linkDestino;

    public CarrosselItem() {
    }

    public CarrosselItem(String titulo, String descricao, String imagemUrl, Integer ordemExibicao) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.imagemUrl = imagemUrl;
        this.ordemExibicao = ordemExibicao;
        this.ativo = true;
    }

    public void alternarAtivo() {
        this.ativo = !this.ativo;
    }

    public void atualizarDados(String titulo, String descricao, String imagemUrl, Integer ordem, String linkDestino) {
        if (titulo != null && !titulo.isBlank()) this.titulo = titulo;
        if (descricao != null) this.descricao = descricao;
        if (imagemUrl != null && !imagemUrl.isBlank()) this.imagemUrl = imagemUrl;
        if (ordem != null) this.ordemExibicao = ordem;
        if (linkDestino != null) this.linkDestino = linkDestino;
    }

    public void definirOrdem(Integer ordem) {
        if (ordem != null && ordem > 0) {
            this.ordemExibicao = ordem;
        }
    }
}
