package com.receitas.site_receitas.model;

import com.receitas.site_receitas.model.Receita.Categoria;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ReceitaTest {

    @Test
    @DisplayName("Deve aprovar receita com status PENDENTE")
    void deveAprovarReceitaPendente() {
        Receita receita = new Receita();
        receita.setTitulo("Bolo de Chocolate");
        receita.setStatus(StatusReceita.PENDENTE);

        receita.aprovar();

        assertThat(receita.getStatus()).isEqualTo(StatusReceita.APROVADA);
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar aprovar receita já APROVADA")
    void deveLancarExcecaoAoAprovarReceitaJaAprovada() {
        Receita receita = new Receita();
        receita.setStatus(StatusReceita.APROVADA);

        assertThatThrownBy(() -> receita.aprovar())
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Só receitas pendentes podem ser aprovadas");
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar aprovar receita REJEITADA")
    void deveLancarExcecaoAoAprovarReceitaRejeitada() {
        Receita receita = new Receita();
        receita.setStatus(StatusReceita.REJEITADA);

        assertThatThrownBy(() -> receita.aprovar())
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Só receitas pendentes podem ser aprovadas");
    }

    @Test
    @DisplayName("Deve rejeitar receita PENDENTE com motivo")
    void deveRejeitarReceitaPendenteComMotivo() {
        Receita receita = new Receita();
        receita.setStatus(StatusReceita.PENDENTE);

        receita.rejeitar("Imagem com baixa qualidade");

        assertThat(receita.getStatus()).isEqualTo(StatusReceita.REJEITADA);
        assertThat(receita.getMotivoRejeicao()).isEqualTo("Imagem com baixa qualidade");
    }

    @Test
    @DisplayName("Deve usar motivo padrão quando rejeição não informa motivo")
    void deveUsarMotivoPadraoQuandoMotivoVazio() {
        Receita receita = new Receita();
        receita.setStatus(StatusReceita.PENDENTE);

        receita.rejeitar("");

        assertThat(receita.getStatus()).isEqualTo(StatusReceita.REJEITADA);
        assertThat(receita.getMotivoRejeicao()).isEqualTo("Sem motivo informado.");
    }

    @Test
    @DisplayName("Deve usar motivo padrão quando motivo é nulo")
    void deveUsarMotivoPadraoQuandoMotivoNulo() {
        Receita receita = new Receita();
        receita.setStatus(StatusReceita.PENDENTE);

        receita.rejeitar(null);

        assertThat(receita.getStatus()).isEqualTo(StatusReceita.REJEITADA);
        assertThat(receita.getMotivoRejeicao()).isEqualTo("Sem motivo informado.");
    }

    @Test
    @DisplayName("Deve lançar exceção ao tentar rejeitar receita já APROVADA")
    void deveLancarExcecaoAoRejeitarReceitaAprovada() {
        Receita receita = new Receita();
        receita.setStatus(StatusReceita.APROVADA);

        assertThatThrownBy(() -> receita.rejeitar("Motivo"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Só receitas pendentes podem ser rejeitadas");
    }

    @Test
    @DisplayName("Deve atualizar todos os dados da receita")
    void deveAtualizarTodosOsDados() {
        Receita receita = new Receita();
        receita.setTitulo("Título Antigo");
        receita.setChefe("Chef Antigo");
        receita.setTempoPreparo("30min");
        receita.setPorcoes(2);
        receita.setCategoria(Categoria.SALGADO);
        receita.setIngredientes("Ingrediente antigo");
        receita.setModoPreparo("Modo antigo");
        receita.setImagem("imagem-antiga.jpg");

        receita.atualizarDados(
                "Novo Título",
                "Novo Chef",
                "1h",
                8,
                Categoria.DOCE,
                "Novo ingrediente",
                "Novo modo",
                "nova-imagem.jpg"
        );

        assertThat(receita.getTitulo()).isEqualTo("Novo Título");
        assertThat(receita.getChefe()).isEqualTo("Novo Chef");
        assertThat(receita.getTempoPreparo()).isEqualTo("1h");
        assertThat(receita.getPorcoes()).isEqualTo(8);
        assertThat(receita.getCategoria()).isEqualTo(Categoria.DOCE);
        assertThat(receita.getIngredientes()).isEqualTo("Novo ingrediente");
        assertThat(receita.getModoPreparo()).isEqualTo("Novo modo");
        assertThat(receita.getImagem()).isEqualTo("nova-imagem.jpg");
    }

    @Test
    @DisplayName("Deve manter dados antigos quando atualização recebe valores nulos")
    void deveManterDadosAntigosComValoresNulos() {
        Receita receita = new Receita();
        receita.setTitulo("Título Original");
        receita.setChefe("Chef Original");
        receita.setTempoPreparo("30min");
        receita.setPorcoes(2);
        receita.setCategoria(Categoria.SALGADO);
        receita.setIngredientes("Ingrediente original");
        receita.setModoPreparo("Modo original");
        receita.setImagem("imagem-original.jpg");

        receita.atualizarDados(null, null, null, 0, null, null, null, null);

        assertThat(receita.getTitulo()).isEqualTo("Título Original");
        assertThat(receita.getChefe()).isEqualTo("Chef Original");
        assertThat(receita.getTempoPreparo()).isEqualTo("30min");
        assertThat(receita.getPorcoes()).isEqualTo(2);
        assertThat(receita.getCategoria()).isEqualTo(Categoria.SALGADO);
        assertThat(receita.getIngredientes()).isEqualTo("Ingrediente original");
        assertThat(receita.getModoPreparo()).isEqualTo("Modo original");
        assertThat(receita.getImagem()).isEqualTo("imagem-original.jpg");
    }

    @Test
    @DisplayName("Deve manter título antigo quando atualização recebe título vazio")
    void deveManterTituloAntigoComTituloVazio() {
        Receita receita = new Receita();
        receita.setTitulo("Título Original");

        receita.atualizarDados("", null, null, 0, null, null, null, null);

        assertThat(receita.getTitulo()).isEqualTo("Título Original");
    }

    @Test
    @DisplayName("Deve atualizar apenas os campos informados")
    void deveAtualizarApenasCamposInformados() {
        Receita receita = new Receita();
        receita.setTitulo("Título Original");
        receita.setPorcoes(2);
        receita.setCategoria(Categoria.SALGADO);

        receita.atualizarDados(null, null, null, 8, Categoria.DOCE, null, null, null);

        assertThat(receita.getTitulo()).isEqualTo("Título Original");
        assertThat(receita.getPorcoes()).isEqualTo(8);
        assertThat(receita.getCategoria()).isEqualTo(Categoria.DOCE);
    }

    @Test
    @DisplayName("Deve iniciar receita com status PENDENTE por padrão")
    void deveIniciarComStatusPendente() {
        Receita receita = new Receita();

        assertThat(receita.getStatus()).isEqualTo(StatusReceita.PENDENTE);
    }

    @Test
    @DisplayName("Deve iniciar receita com categoria SALGADO por padrão")
    void deveIniciarComCategoriaSalgado() {
        Receita receita = new Receita();

        assertThat(receita.getCategoria()).isEqualTo(Categoria.SALGADO);
    }

    @Test
    @DisplayName("Deve iniciar receita com porções 1 por padrão")
    void deveIniciarComPorcoesUm() {
        Receita receita = new Receita();

        assertThat(receita.getPorcoes()).isEqualTo(1);
    }
}