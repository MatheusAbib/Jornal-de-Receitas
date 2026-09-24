package com.receitas.site_receitas.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "carrossel")
@Getter
@Setter
@Schema(description = "Representa um item do carrossel exibido na página inicial")
public class CarrosselItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único do item do carrossel", example = "1")
    private Long id;

    @Column(nullable = false)
    @Schema(description = "Título exibido sobre a imagem", example = "Bolo de Chocolate")
    private String titulo;

    @Column(columnDefinition = "TEXT")
    @Schema(description = "Descrição curta exibida abaixo do título", example = "Uma receita incrível para os amantes de chocolate")
    private String descricao;

    @Column(name = "imagem_url", columnDefinition = "TEXT", nullable = false)
    @Schema(description = "URL da imagem ou nome do arquivo salvo em /uploads", example = "https://exemplo.com/imagem.png")
    private String imagemUrl;

    @Column(name = "ativo", nullable = false)
    @Schema(description = "Indica se o item está ativo (visível no carrossel)", example = "true")
    private boolean ativo = true;

    @Column(name = "ordem_exibicao")
    @Schema(description = "Posição em que o item aparece no carrossel", example = "1")
    private Integer ordemExibicao;

    @Column(name = "link_destino")
    @Schema(description = "URL de destino ao clicar no item", example = "/detalhe/103")
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
