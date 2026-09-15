function trocarAba(aba) {

  document.querySelectorAll('.minhas-tab').forEach(tab => {

    tab.classList.remove('active');

  });

  document.querySelectorAll('.minhas-tab-content').forEach(content => {

    content.classList.remove('active');

  });

  const tabClicada = document.querySelector(`.minhas-tab[onclick*="'${aba}'"]`);

  if (tabClicada) tabClicada.classList.add('active');

  const conteudo = document.getElementById(`tab-${aba}`);

  if (conteudo) conteudo.classList.add('active');

  const url = new URL(window.location.href);

  url.searchParams.set('aba', aba);

  window.history.replaceState({}, '', url);

}

let receitaParaExcluir = null;

function abrirExclusao(button) {

  receitaParaExcluir = button.getAttribute('data-id');

  document.getElementById('excluirTitulo').textContent = button.getAttribute('data-titulo') || '';

  document.getElementById('excluirModal').style.display = 'block';

  document.body.style.overflow = 'hidden';

}

function closeExclusaoModal() {

  document.getElementById('excluirModal').style.display = 'none';

  document.body.style.overflow = 'auto';

  receitaParaExcluir = null;

}

function mostrarNotificacaoExclusao(mensagem) {

  const notificacao = document.createElement('div');

  notificacao.className = 'user-notification success';

  notificacao.innerHTML =
    `<i class="fas fa-check-circle"></i> ${mensagem}`;

  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.classList.add('show');
  }, 10);

  setTimeout(() => {
    notificacao.classList.remove('show');

    setTimeout(() => {
      notificacao.remove();
    }, 300);

  }, 3000);
}

async function confirmarExclusao() {

  if (!receitaParaExcluir) return;

  const confirmBtn = document.querySelector('#excluirModal .modal-button-delete.confirm');

  const originalText = confirmBtn.innerHTML;

  confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';

  confirmBtn.disabled = true;

  try {

const response = await fetch(`/receitas/excluir/${receitaParaExcluir}`, {

  method: 'POST',

  credentials: 'include'

});

if (response.ok) {

  mostrarNotificacaoExclusao(
    'Receita excluída com sucesso!'
  );

  setTimeout(() => {
    window.location.reload();
  }, 1500);

} else {

  throw new Error('Erro ao excluir');

}

  } catch (error) {

    confirmBtn.innerHTML = originalText;

    confirmBtn.disabled = false;

    console.error('Erro na exclusão:', error);

  }

}

function abrirDetalhes(button) {

  const id = button.getAttribute('data-id');

  const modal = document.getElementById('detalhesModal');

  const conteudo = document.getElementById('detalhesModalConteudo');

  conteudo.innerHTML = '<div style="padding:40px;text-align:center;"><i class="fas fa-spinner fa-spin" style="font-size:2rem;color:#8b0000;"></i></div>';

  modal.style.display = 'block';

  document.body.style.overflow = 'hidden';

  fetch(`/minhas-receitas/${id}/detalhes`)

    .then(r => r.text())

    .then(html => {

      conteudo.innerHTML = html;

    })

    .catch(() => {

      conteudo.innerHTML = '<div style="padding:40px;text-align:center;color:#e74c3c;"><i class="fas fa-exclamation-circle" style="font-size:2rem;"></i><p>Erro ao carregar detalhes.</p></div>';

    });

}

function closeDetalhesModal() {

  const modal = document.getElementById('detalhesModal');

  if (modal) {

    modal.style.display = 'none';

    modal.innerHTML = '<div id="detalhesModalConteudo"></div>';

    document.body.style.overflow = 'auto';

  }

}

function abrirMotivo(button) {

  const motivo = button.getAttribute('data-motivo') || 'Sem motivo informado.';

  document.getElementById('motivoTexto').textContent = motivo;

  document.getElementById('motivoModal').style.display = 'block';

  document.body.style.overflow = 'hidden';

}

function closeMotivoModal() {

  document.getElementById('motivoModal').style.display = 'none';

  document.body.style.overflow = 'auto';

}

document.querySelectorAll('.admin-confirm-modal, .delete-user-modal').forEach(modal => {

  modal.addEventListener('click', e => {

    if (e.target === modal) {

      if (modal.id === 'motivoModal') closeMotivoModal();

      if (modal.id === 'excluirModal') closeExclusaoModal();

    }

  });

});

document.addEventListener('click', function(e) {

  const modal = document.getElementById('detalhesModal');

  if (e.target === modal) {

    closeDetalhesModal();

  }

});

document.addEventListener('keydown', function(e) {

  if (e.key === 'Escape') {

    closeDetalhesModal();

  }

});

document.addEventListener('keydown', function(e) {

  if (e.key === 'Escape') {

    closeMotivoModal();

    closeExclusaoModal();

  }

});

document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  if (params.get('enviada') === '1') {
    mostrarNotificacaoExclusao('Receita enviada para aprovação com sucesso!');

    const url = new URL(window.location.href);
    url.searchParams.delete('enviada');
    window.history.replaceState({}, '', url);
  }
});