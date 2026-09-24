package com.receitas.site_receitas.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "receita")
@Getter
@Setter
@Schema(description = "Representa uma receita cadastrada no sistema")
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único da receita", example = "1")
    private Long id;

    @Schema(description = "Título da receita", example = "Bolo de Chocolate")
    private String titulo;

    @Column(name = "tempo_preparo")
    @Schema(description = "Tempo de preparo formatado", example = "1h 10min")
    private String tempoPreparo;

    @Column(columnDefinition = "TEXT")
    @Schema(
        description = "Lista de ingredientes separados por '||'",
        example = "200g de farinha||200g de açúcar||3 ovos"
    )
    private String ingredientes;

    @Column(name = "modo_preparo", columnDefinition = "TEXT")
    @Schema(
        description = "Passos do modo de preparo separados por '||'",
        example = "Misture os secos||Adicione os ovos||Asse por 35 minutos"
    )
    private String modoPreparo;

    @Column(columnDefinition = "TEXT")
    @Schema(
        description = "Nome do arquivo de imagem salvo em /uploads ou URL externa",
        example = "1789489569365_bolo.jpg"
    )
    private String imagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Schema(description = "Status atual da receita", example = "PENDENTE", allowableValues = {"PENDENTE", "APROVADA", "REJEITADA"})
    private StatusReceita status = StatusReceita.PENDENTE;

    @Column(name = "motivo_rejeicao", columnDefinition = "TEXT")
    @Schema(description = "Motivo pelo qual a receita foi rejeitada (apenas quando status é REJEITADA)", example = "Ingredientes sem quantidade")
    private String motivoRejeicao;

    @Schema(description = "Número de porções que a receita rende", example = "5")
    private int porcoes = 1;

    @Schema(description = "Nome do chef autor da receita", example = "Chef Confeiteiro")
    private String chefe;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @Schema(description = "Usuário autor da receita")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Schema(description = "Categoria da receita", example = "DOCE", allowableValues = {"SALGADO", "DOCE"})
    private Categoria categoria = Categoria.SALGADO;

    public enum Categoria {
        SALGADO,
        DOCE
    }

    public enum StatusReceita {
        PENDENTE,
        APROVADA,
        REJEITADA
    }

    public void aprovar() {
        if (this.status != StatusReceita.PENDENTE) {
            throw new IllegalStateException("Só receitas pendentes podem ser aprovadas");
        }
        this.status = StatusReceita.APROVADA;
    }

    public void rejeitar(String motivo) {
        if (this.status != StatusReceita.PENDENTE) {
            throw new IllegalStateException("Só receitas pendentes podem ser rejeitadas");
        }
        this.status = StatusReceita.REJEITADA;
        this.motivoRejeicao = (motivo != null && !motivo.isBlank()) ? motivo : "Sem motivo informado.";
    }

    public void atualizarDados(String titulo, String chefe, String tempoPreparo, Integer porcoes,
                            Categoria categoria, String ingredientes, String modoPreparo, String imagem) {
        if (titulo != null && !titulo.isBlank()) this.titulo = titulo;
        if (chefe != null) this.chefe = chefe;
        if (tempoPreparo != null) this.tempoPreparo = tempoPreparo;
        if (porcoes > 0) this.porcoes = porcoes;
        if (categoria != null) this.categoria = categoria;
        if (ingredientes != null) this.ingredientes = ingredientes;
        if (modoPreparo != null) this.modoPreparo = modoPreparo;
        if (imagem != null) this.imagem = imagem;
    }
}
