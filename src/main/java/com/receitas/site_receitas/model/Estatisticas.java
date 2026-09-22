package com.receitas.site_receitas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "estatisticas")
@Getter
@Setter
public class Estatisticas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "total_receitas", nullable = false)
    private int totalReceitas = 0;

    @Column(name = "receitas_aprovadas", nullable = false)
    private int receitasAprovadas = 0;

    @Column(name = "receitas_rejeitadas", nullable = false)
    private int receitasRejeitadas = 0;

    @Column(name = "receitas_pendentes", nullable = false)
    private int receitasPendentes = 0;

    @Column(name = "total_favoritos", nullable = false)
    private int totalFavoritos = 0;

    @Column(name = "total_notificacoes", nullable = false)
    private int totalNotificacoes = 0;

    @Column(name = "ultima_atividade", nullable = false)
    private LocalDateTime ultimaAtividade = LocalDateTime.now();


    public void recalcular(int total, int aprovadas, int rejeitadas, int pendentes, int favoritos, int notificacoes) {
        this.totalReceitas = total;
        this.receitasAprovadas = aprovadas;
        this.receitasRejeitadas = rejeitadas;
        this.receitasPendentes = pendentes;
        this.totalFavoritos = favoritos;
        this.totalNotificacoes = notificacoes;
        this.ultimaAtividade = LocalDateTime.now();
    }
}


