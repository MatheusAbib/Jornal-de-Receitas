package com.receitas.site_receitas.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "favorito", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "receita_id"})
})
@Getter
@Setter
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "receita_id", nullable = false)
    private Receita receita;

    public Favorito() {
    }

    public Favorito(Usuario usuario, Receita receita) {
        this.usuario = usuario;
        this.receita = receita;
    }
}
