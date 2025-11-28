document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('recipeForm');
  const imageInput = document.getElementById('imagemFile');
  const imagePreview = document.getElementById('imagePreview');
  const fileText = document.getElementById('fileText');
  const ingredientesContainer = document.getElementById('ingredientesContainer');
  const modoPreparoContainer = document.getElementById('modoPreparoContainer');

  // Verificar se há mensagem de sucesso da submissão anterior
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('sucesso')) {
    mostrarNotificacao(urlParams.get('sucesso'));
  }

  // Criar elemento de notificação
  function criarNotificacao() {
    const notificacao = document.createElement('div');
    notificacao.id = 'successNotification';
    notificacao.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      display: none;
      align-items: center;
      gap: 10px;
      font-family: inherit;
      font-size: 14px;
      max-width: 300px;
      animation: slideInRight 0.3s ease;
    `;
    notificacao.innerHTML = `
      <i class="fas fa-check-circle" style="font-size: 18px;"></i>
      <span id="notificationText"></span>
    `;
    document.body.appendChild(notificacao);
    return notificacao;
  }

  const notificacao = criarNotificacao();

  function mostrarNotificacao(mensagem) {
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = mensagem;
    notificacao.style.display = 'flex';
    
    setTimeout(() => {
      notificacao.style.display = 'none';
    }, 5000);
  }

  // Limpar formulário
  function limparFormulario() {
    form.reset();
    
    // Limpar preview da imagem
    imagePreview.classList.remove('active');
    fileText.textContent = 'Selecione uma imagem para sua receita';
    
    // Limpar ingredientes dinâmicos (manter apenas o primeiro)
    const ingredientes = ingredientesContainer.querySelectorAll('.ingrediente-item');
    ingredientes.forEach((item, index) => {
      if (index > 0) item.remove();
    });
    if (ingredientes[0]) {
      ingredientes[0].querySelector('input').value = '';
      ingredientes[0].querySelector('input').placeholder = 'Ingrediente 1';
    }
    
    // Limpar passos dinâmicos (manter apenas o primeiro)
    const passos = modoPreparoContainer.querySelectorAll('.passo-item');
    passos.forEach((item, index) => {
      if (index > 0) item.remove();
    });
    if (passos[0]) {
      passos[0].querySelector('input').value = '';
      passos[0].querySelector('input').placeholder = 'Passo 1';
    }
    
    // Resetar valores padrão
    document.getElementById('porcoes').value = '1';
  }

  // Preview de imagem
  imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        showError('imagemError', 'Formato de arquivo não suportado. Use JPG, PNG ou GIF.');
        this.value = '';
        return;
      }
      hideError('imagemError');
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.querySelector('img').src = e.target.result;
        imagePreview.classList.add('active');
        fileText.textContent = file.name;
      }
      reader.readAsDataURL(file);
    } else {
      imagePreview.classList.remove('active');
      fileText.textContent = 'Selecione uma imagem para sua receita';
    }
  });

  // Reindexar ingredientes
  function atualizarIngredientes() {
    const ingredientes = ingredientesContainer.querySelectorAll('.ingrediente-item input');
    ingredientes.forEach((input, i) => {
      input.placeholder = `Ingrediente ${i + 1}`;
      aplicarCapitalizacao(input);
    });
  }

  // Reindexar passos
  function atualizarPassos() {
    const passos = modoPreparoContainer.querySelectorAll('.passo-item input');
    passos.forEach((input, i) => {
      input.placeholder = `Passo ${i + 1}`;
      aplicarCapitalizacao(input);
    });
  }

  // Adicionar ingrediente
  document.getElementById('addIngrediente').addEventListener('click', function() {
    const div = document.createElement('div');
    div.classList.add('ingrediente-item');
    div.innerHTML = `
      <div class="input-wrapper">
        <input type="text" name="ingredientes[]" required>
        <button type="button" class="remove-btn">×</button>
      </div>
    `;
    ingredientesContainer.appendChild(div);
    div.querySelector('.remove-btn').addEventListener('click', function() {
      div.remove();
      atualizarIngredientes();
    });
    atualizarIngredientes();
  });

  // Adicionar passo
  document.getElementById('addPasso').addEventListener('click', function() {
    const div = document.createElement('div');
    div.classList.add('passo-item');
    div.innerHTML = `
      <div class="input-wrapper">
        <input type="text" name="modoPreparo[]" required>
        <button type="button" class="remove-btn">×</button>
      </div>
    `;
    modoPreparoContainer.appendChild(div);
    div.querySelector('.remove-btn').addEventListener('click', function() {
      div.remove();
      atualizarPassos();
    });
    atualizarPassos();
  });

  // Capitalização
  function capitalizeFirst(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function aplicarCapitalizacao(input) {
    input.addEventListener("blur", function () {
      let valor = input.value.trim();
      if (valor) {
        input.value = capitalizeFirst(valor);
      }
    });
  }

  // Título fixo
  const tituloInput = document.getElementById("titulo");
  aplicarCapitalizacao(tituloInput);

  // Aplica capitalização nos existentes
  ingredientesContainer.querySelectorAll("input").forEach(inp => aplicarCapitalizacao(inp));
  modoPreparoContainer.querySelectorAll("input").forEach(inp => aplicarCapitalizacao(inp));

  // Tempo de preparo
  const tempoPreparoInput = document.getElementById('tempoPreparo');
  tempoPreparoInput.addEventListener('blur', function() {
    let valor = tempoPreparoInput.value.trim();
    if (valor) {
      let numero = valor.match(/\d+/);
      if (numero) {
        tempoPreparoInput.value = numero[0] + " Minutos";
      }
    }
  });

  // Validação simples
  form.addEventListener('submit', function(e) {
    let isValid = true;
    if (!form.querySelector('#titulo').value.trim()) { showError('tituloError'); isValid = false; } else hideError('tituloError');
    if (!form.querySelector('#tempoPreparo').value.trim()) { showError('tempoError'); isValid = false; } else hideError('tempoError');
    if (ingredientesContainer.querySelectorAll('input').length === 0) { showError('ingredientesError'); isValid = false; } else hideError('ingredientesError');
    if (modoPreparoContainer.querySelectorAll('input').length === 0) { showError('modoPreparoError'); isValid = false; } else hideError('modoPreparoError');
    if (imageInput.files[0] && !imageInput.files[0].type.match('image.*')) { showError('imagemError'); isValid = false; }
    
    if (isValid) {
      // Se o formulário for válido, mostrar notificação após o envio
      setTimeout(() => {
        mostrarNotificacao('Receita enviada para aprovação!');
        limparFormulario();
      }, 100);
    } else {
      e.preventDefault();
    }
  });

  function showError(id, msg='Campo obrigatório') { const el = document.getElementById(id); el.textContent = msg; el.classList.add('show'); }
  function hideError(id) { const el = document.getElementById(id); el.classList.remove('show'); }

  // Adicionar animação CSS para a notificação
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
});