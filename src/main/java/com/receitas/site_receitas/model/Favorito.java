package com.receitas.site_receitas.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "favorito", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "receita_id"})
})
@Getter
@Setter
@Schema(description = "Representa o vínculo de favorito entre um usuário e uma receita")
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único do registro de favorito", example = "1")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    @Schema(description = "Usuário que favoritou a receita")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "receita_id", nullable = false)
    @Schema(description = "Receita que foi favoritada")
    private Receita receita;

    public Favorito() {
    }

    public Favorito(Usuario usuario, Receita receita) {
        this.usuario = usuario;
        this.receita = receita;
    }
}
