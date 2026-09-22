package com.receitas.site_receitas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "receita")
@Getter
@Setter
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(name = "tempo_preparo")
    private String tempoPreparo;

    @Column(columnDefinition = "TEXT")
    private String ingredientes;

    @Column(name = "modo_preparo", columnDefinition = "TEXT")
    private String modoPreparo;

    @Column(columnDefinition = "TEXT")
    private String imagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusReceita status = StatusReceita.PENDENTE;

    @Column(name = "motivo_rejeicao", columnDefinition = "TEXT")
    private String motivoRejeicao;

    private int porcoes = 1;

    private String chefe;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
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
