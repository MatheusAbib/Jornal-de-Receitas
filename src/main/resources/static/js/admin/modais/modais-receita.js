let contextoAtual = null;
let estadoOriginalReceita = null;

function openDetalhesModal(button) {
    const id = button.getAttribute('data-id');
    contextoAtual = button.getAttribute('data-contexto') || 'aprovadas';

    const modal = document.getElementById('detalhesModal');
    const conteudo = document.getElementById('detalhesModalConteudo');

    conteudo.innerHTML = '<div style="padding:40px;text-align:center;"><i class="fas fa-spinner fa-spin" style="font-size:2rem;color:#d4af37;"></i></div>';

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    const contextoDetalhes =
        contextoAtual === 'pendentes' || contextoAtual === 'rejeitadas'
            ? 'pendentes'
            : contextoAtual;

    fetch(`/${contextoDetalhes}/${id}/detalhes`)
        .then(r => r.text())
        .then(html => {
            conteudo.innerHTML = html;
        })
        .catch(() => {
            conteudo.innerHTML = '<div style="padding:40px;text-align:center;color:#e74c3c;"><i class="fas fa-exclamation-circle" style="font-size:2rem;"></i><p>Erro ao carregar detalhes.</p></div>';
        });
}

function closeDetalhesModal() {
    document.getElementById('detalhesModal').style.display = 'none';
    document.getElementById('detalhesModalConteudo').innerHTML = '';
    document.body.style.overflow = 'auto';
}

function abrirEdicaoDoDetalhes(button) {
    closeDetalhesModal();
    openEditModal(button);
}

function openEditModal(button) {
    const id = button.getAttribute('data-id');
    const ingredientes = button.getAttribute('data-ingredientes') || '';
    const modoPreparo = button.getAttribute('data-modoPreparo') || '';
    const imagemAtual = button.getAttribute('data-imagem') || '';

    contextoAtual = button.getAttribute('data-contexto') || contextoAtual || 'aprovadas';

    document.getElementById('editTitulo').value = button.getAttribute('data-titulo') || '';
    document.getElementById('editChefe').value = button.getAttribute('data-chefe') || '';
    document.getElementById('editTempo').value = button.getAttribute('data-tempo') || '';
    document.getElementById('editPorcoes').value = button.getAttribute('data-porcoes') || 1;
    document.getElementById('editCategoria').value = button.getAttribute('data-categoria') || 'SALGADO';
    document.getElementById('editIngredientes').value = ingredientes.split('||').filter(s => s.trim()).join('\n');
    document.getElementById('editModoPreparo').value = modoPreparo.split('||').filter(s => s.trim()).join('\n');

    const preview = document.getElementById('editImagemPreview');
    const info = document.getElementById('editImagemInfo');
    const inputImg = document.getElementById('editImagem');

    if (inputImg) inputImg.value = '';

    if (imagemAtual) {
        preview.src = imagemAtual.startsWith('http') ? imagemAtual : '/uploads/' + imagemAtual;
        preview.classList.add('visivel');
        info.textContent = 'Imagem atual — escolha outra para substituir';
    } else {
        preview.src = '';
        preview.classList.remove('visivel');
        info.textContent = 'Esta receita ainda não tem imagem';
    }

    atualizarContadores();

    const contextoEdicao =
        contextoAtual === 'rejeitadas'
            ? 'pendentes'
            : contextoAtual;

    document.getElementById('editForm').action = `/${contextoEdicao}/editar/${id}`;

    document.getElementById('editModal').style.display = 'block';
    document.body.style.overflow = 'hidden';

    capturarEstadoOriginalReceita();
    atualizarEstadoBotaoSalvar();
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    estadoOriginalReceita = null;
}

function atualizarContadores() {
    const ingTexto = document.getElementById('editIngredientes').value;
    const passoTexto = document.getElementById('editModoPreparo').value;

    const ingCount = ingTexto.split('\n').filter(l => l.trim().length > 0).length;
    const passoCount = passoTexto.split('\n').filter(l => l.trim().length > 0).length;

    document.getElementById('contadorIngredientes').textContent = ingCount;
    document.getElementById('contadorPassos').textContent = passoCount;
}

function capturarEstadoOriginalReceita() {
    estadoOriginalReceita = {
        titulo: document.getElementById('editTitulo')?.value.trim() || '',
        chefe: document.getElementById('editChefe')?.value.trim() || '',
        tempo: document.getElementById('editTempo')?.value.trim() || '',
        porcoes: document.getElementById('editPorcoes')?.value.trim() || '',
        categoria: document.getElementById('editCategoria')?.value || '',
        ingredientes: document.getElementById('editIngredientes')?.value.trim() || '',
        modoPreparo: document.getElementById('editModoPreparo')?.value.trim() || ''
    };
}

function atualizarEstadoBotaoSalvar() {
    const form = document.getElementById('editForm');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    const titulo = document.getElementById('editTitulo')?.value.trim() || '';
    const chefe = document.getElementById('editChefe')?.value.trim() || '';
    const tempo = document.getElementById('editTempo')?.value.trim() || '';
    const porcoes = document.getElementById('editPorcoes')?.value.trim() || '';
    const categoria = document.getElementById('editCategoria')?.value || '';
    const ingredientes = document.getElementById('editIngredientes')?.value.trim() || '';
    const modoPreparo = document.getElementById('editModoPreparo')?.value.trim() || '';

    const todosPreenchidos =
        titulo.length > 0 &&
        chefe.length > 0 &&
        tempo.length > 0 &&
        porcoes.length > 0 &&
        categoria.length > 0 &&
        ingredientes.length > 0 &&
        modoPreparo.length > 0;

    if (!estadoOriginalReceita) {
        submitBtn.disabled = true;
        return;
    }

    const houveAlteracao =
        titulo !== estadoOriginalReceita.titulo ||
        chefe !== estadoOriginalReceita.chefe ||
        tempo !== estadoOriginalReceita.tempo ||
        porcoes !== estadoOriginalReceita.porcoes ||
        categoria !== estadoOriginalReceita.categoria ||
        ingredientes !== estadoOriginalReceita.ingredientes ||
        modoPreparo !== estadoOriginalReceita.modoPreparo ||
        (document.getElementById('editImagem')?.files?.length > 0);

    submitBtn.disabled = !(todosPreenchidos && houveAlteracao);
}

document.addEventListener('DOMContentLoaded', function () {

    const editForm = document.getElementById('editForm');
    if (!editForm) return;

    const submitBtn = editForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    editForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const ingredientesTexto = document.getElementById('editIngredientes').value;
        const modoPreparoTexto = document.getElementById('editModoPreparo').value;

        const formData = new FormData(editForm);
        formData.delete('ingredientesTexto');
        formData.delete('modoPreparoTexto');

        ingredientesTexto.split('\n').forEach(linha => {
            const v = linha.trim();
            if (v) formData.append('ingredientes[]', v);
        });

        modoPreparoTexto.split('\n').forEach(linha => {
            const v = linha.trim();
            if (v) formData.append('modoPreparo[]', v);
        });

        fetch(editForm.action, {
            method: 'POST',
            body: formData
        })
            .then(r => {
                if (r.redirected || r.ok) {
                    let destino = '/receitas-aprovadas';
                    if (contextoAtual === 'pendentes') {
                        destino = '/pendentes';
                    } else if (contextoAtual === 'rejeitadas') {
                        destino = '/pendentes?aba=rejeitadas';
                    }
                    window.location.href = destino + (destino.includes('?') ? '&' : '?') + 'ok=editada';
                } else {
                    throw new Error('Erro ao salvar');
                }
            })
            .catch(() => {
                if (typeof showUserNotification === 'function') {
                    showUserNotification('Erro ao salvar receita.', 'error');
                } else {
                    alert('Erro ao salvar receita.');
                }
            });
    });

    ['editTitulo', 'editChefe', 'editTempo', 'editPorcoes', 'editCategoria', 'editIngredientes', 'editModoPreparo', 'editImagem']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', atualizarEstadoBotaoSalvar);
                el.addEventListener('change', atualizarEstadoBotaoSalvar);
            }
        });

    const textareaIng = document.getElementById('editIngredientes');
    const textareaPasso = document.getElementById('editModoPreparo');

    if (textareaIng) textareaIng.addEventListener('input', atualizarContadores);
    if (textareaPasso) textareaPasso.addEventListener('input', atualizarContadores);

    const inputImagem = document.getElementById('editImagem');
    if (inputImagem) {
        inputImagem.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const preview = document.getElementById('editImagemPreview');
            const info = document.getElementById('editImagemInfo');

            preview.src = URL.createObjectURL(file);
            preview.classList.add('visivel');
            info.textContent = 'Nova imagem: ' + file.name;
        });
    }
});

document.addEventListener('click', function (e) {
    const detalhesModal = document.getElementById('detalhesModal');
    if (e.target === detalhesModal) {
        closeDetalhesModal();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeDetalhesModal();
        closeEditModal();
    }
});