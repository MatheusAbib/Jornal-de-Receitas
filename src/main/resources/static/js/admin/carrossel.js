let estadoOriginalCarrossel = null;

function abrirNovoItem() {
  document.getElementById('itemModalTitulo').innerHTML = '<i class="fas fa-plus"></i> Novo Item';
  document.getElementById('itemForm').action = '/carrossel/adicionar';
  document.getElementById('itemForm').reset();

  const inputFileReset = document.getElementById('itemImagemFile');
  const labelFileReset = document.querySelector('.carrossel-file-label');
  const nomeFileReset = document.getElementById('itemImagemFileName');
  const previewWrapperReset = document.getElementById('itemImagemPreviewWrapper');
  const previewImgReset = document.getElementById('itemImagemPreview');

  if (inputFileReset) inputFileReset.value = '';
  if (labelFileReset) labelFileReset.classList.remove('tem-arquivo');
  if (nomeFileReset) nomeFileReset.textContent = 'Escolher arquivo';
  if (previewWrapperReset) previewWrapperReset.style.display = 'none';
  if (previewImgReset) previewImgReset.src = '';

  document.getElementById('itemModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';

  estadoOriginalCarrossel = null;
  capturarEstadoOriginalCarrossel();
  atualizarEstadoBotaoSalvarCarrossel();
}

function abrirEdicaoItem(button) {
  const id = button.getAttribute('data-id');

  document.getElementById('itemModalTitulo').innerHTML = '<i class="fas fa-edit"></i> Editar Item';
  document.getElementById('itemForm').action = '/carrossel/editar/' + id;
  document.getElementById('itemTitulo').value = button.getAttribute('data-titulo') || '';
  document.getElementById('itemDescricao').value = button.getAttribute('data-descricao') || '';
  document.getElementById('itemImagemUrl').value = button.getAttribute('data-imagem') || '';
  document.getElementById('itemOrdem').value = button.getAttribute('data-ordem') || '';
  document.getElementById('itemLink').value = button.getAttribute('data-link') || '';

  const inputFileReset = document.getElementById('itemImagemFile');
  const labelFileReset = document.querySelector('.carrossel-file-label');
  const nomeFileReset = document.getElementById('itemImagemFileName');
  const previewWrapperReset = document.getElementById('itemImagemPreviewWrapper');
  const previewImgReset = document.getElementById('itemImagemPreview');

  if (inputFileReset) inputFileReset.value = '';
  if (labelFileReset) labelFileReset.classList.remove('tem-arquivo');
  if (nomeFileReset) nomeFileReset.textContent = 'Escolher arquivo';
  if (previewWrapperReset) previewWrapperReset.style.display = 'none';
  if (previewImgReset) previewImgReset.src = '';

  document.getElementById('itemModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';

  capturarEstadoOriginalCarrossel();
  atualizarEstadoBotaoSalvarCarrossel();
}

function fecharItemModal() {
  document.getElementById('itemModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  estadoOriginalCarrossel = null;
}

function abrirExclusaoItem(button) {
  const id = button.getAttribute('data-id');
  const titulo = button.getAttribute('data-titulo') || '';

  document.getElementById('excluirItemTitulo').textContent = titulo;
  document.getElementById('excluirItemForm').action = '/carrossel/excluir/' + id;
  document.getElementById('excluirItemModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function fecharExclusaoItem() {
  document.getElementById('excluirItemModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function capturarEstadoOriginalCarrossel() {
  estadoOriginalCarrossel = {
    titulo: document.getElementById('itemTitulo')?.value.trim() || '',
    descricao: document.getElementById('itemDescricao')?.value.trim() || '',
    imagemUrl: document.getElementById('itemImagemUrl')?.value.trim() || '',
    ordem: document.getElementById('itemOrdem')?.value.trim() || '',
    link: document.getElementById('itemLink')?.value.trim() || ''
  };
}

function atualizarEstadoBotaoSalvarCarrossel() {
  const form = document.getElementById('itemForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  const titulo = document.getElementById('itemTitulo')?.value.trim() || '';
  const descricao = document.getElementById('itemDescricao')?.value.trim() || '';
  const imagemUrl = document.getElementById('itemImagemUrl')?.value.trim() || '';
  const ordem = document.getElementById('itemOrdem')?.value.trim() || '';
  const link = document.getElementById('itemLink')?.value.trim() || '';
  const arquivo = document.getElementById('itemImagemFile')?.files?.length > 0;

  const tituloValido = titulo.length > 0;
  const imagemValida = imagemUrl.length > 0 || arquivo;

  if (!estadoOriginalCarrossel) {
    submitBtn.disabled = !(tituloValido && imagemValida);
    return;
  }

  const houveAlteracao =
    titulo !== estadoOriginalCarrossel.titulo ||
    descricao !== estadoOriginalCarrossel.descricao ||
    imagemUrl !== estadoOriginalCarrossel.imagemUrl ||
    ordem !== estadoOriginalCarrossel.ordem ||
    link !== estadoOriginalCarrossel.link ||
    arquivo;

  submitBtn.disabled = !(tituloValido && imagemValida && houveAlteracao);
}

function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement('div');
  notificacao.className = 'user-notification success';
  notificacao.innerHTML = `<i class="fas fa-check-circle"></i> ${mensagem}`;

  document.body.appendChild(notificacao);

  setTimeout(() => notificacao.classList.add('show'), 10);

  setTimeout(() => {
    notificacao.classList.remove('show');
    setTimeout(() => {
      if (notificacao.parentNode) {
        document.body.removeChild(notificacao);
      }
    }, 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {

  const itemForm = document.getElementById('itemForm');
  if (itemForm) {
    const submitBtn = itemForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
  }

  const itemModal = document.getElementById('itemModal');
  if (itemModal) {
    itemModal.addEventListener('click', function (e) {
      if (e.target === itemModal) fecharItemModal();
    });
  }

  const excluirModal = document.getElementById('excluirItemModal');
  if (excluirModal) {
    excluirModal.addEventListener('click', function (e) {
      if (e.target === excluirModal) fecharExclusaoItem();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      fecharItemModal();
      fecharExclusaoItem();
    }
  });

  const inputFile = document.getElementById('itemImagemFile');
  const labelFile = document.querySelector('.carrossel-file-label');
  const nomeFile = document.getElementById('itemImagemFileName');
  const previewWrapper = document.getElementById('itemImagemPreviewWrapper');
  const previewImg = document.getElementById('itemImagemPreview');

  if (inputFile && labelFile && nomeFile) {
    inputFile.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        nomeFile.textContent = this.files[0].name;
        labelFile.classList.add('tem-arquivo');

        if (previewWrapper && previewImg) {
          const reader = new FileReader();
          reader.onload = function (e) {
            previewImg.src = e.target.result;
            previewWrapper.style.display = 'block';
          };
          reader.readAsDataURL(this.files[0]);
        }
      } else {
        nomeFile.textContent = 'Escolher arquivo';
        labelFile.classList.remove('tem-arquivo');
        if (previewWrapper) previewWrapper.style.display = 'none';
        if (previewImg) previewImg.src = '';
      }
    });
  }

  ['itemTitulo', 'itemDescricao', 'itemImagemUrl', 'itemOrdem', 'itemLink', 'itemImagemFile']
    .forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', atualizarEstadoBotaoSalvarCarrossel);
        el.addEventListener('change', atualizarEstadoBotaoSalvarCarrossel);
      }
    });

  const params = new URLSearchParams(window.location.search);
  const ok = params.get('ok');

  if (ok === 'adicionada') {
    mostrarNotificacao('Item adicionado com sucesso!');
    const url = new URL(window.location.href);
    url.searchParams.delete('ok');
    window.history.replaceState({}, '', url);
  } else if (ok === 'editada') {
    mostrarNotificacao('Item atualizado com sucesso!');
    const url = new URL(window.location.href);
    url.searchParams.delete('ok');
    window.history.replaceState({}, '', url);
  } else if (ok === 'excluida') {
    mostrarNotificacao('Item excluído com sucesso!');
    const url = new URL(window.location.href);
    url.searchParams.delete('ok');
    window.history.replaceState({}, '', url);
  } else if (ok === 'alternada') {
    mostrarNotificacao('Status alterado com sucesso!');
    const url = new URL(window.location.href);
    url.searchParams.delete('ok');
    window.history.replaceState({}, '', url);
  }

});