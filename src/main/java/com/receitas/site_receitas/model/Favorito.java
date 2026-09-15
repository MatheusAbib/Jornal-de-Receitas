package com.receitas.site_receitas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favorito", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "receita_id"})
})
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

    public Favorito() {}

    public Favorito(Usuario usuario, Receita receita) {
        this.usuario = usuario;
        this.receita = receita;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Receita getReceita() { return receita; }
    public void setReceita(Receita receita) { this.receita = receita; }
}