document.addEventListener('DOMContentLoaded', function() {

  const form = document.getElementById('recipeForm');
  const imageInput = document.getElementById('imagemFile');
  const imagePreview = document.getElementById('imagePreview');
  const fileText = document.getElementById('fileText');
  const ingredientesContainer = document.getElementById('ingredientesContainer');
  const modoPreparoContainer = document.getElementById('modoPreparoContainer');

  function formatarIngrediente(item) {
    const quantidade = item.querySelector('.quantidade-input').value;
    const unidade = item.querySelector('.unidade-select').value;
    const nome = item.querySelector('.ingrediente-nome-input').value;

    if (!quantidade || !unidade || !nome) return '';

    let quantidadeFormatada = quantidade;

    if (quantidade % 1 === 0) {
      quantidadeFormatada = Math.floor(quantidade);
    } else {
      quantidadeFormatada = quantidade.replace(/\./g, ',');
    }

    if (unidade === 'pitada') return `${quantidadeFormatada} pitada${quantidade != 1 ? 's' : ''} de ${nome}`;
    if (unidade === 'fio') return `1 fio de ${nome}`;
    if (unidade === 'unidade') return `${quantidadeFormatada} ${nome}`;
    if (quantidade == 1) return `${quantidadeFormatada} ${unidade} de ${nome}`;
    if (unidade === 'colher (chá)') return `${quantidadeFormatada} colheres (chá) de ${nome}`;
    if (unidade === 'colher (sopa)') return `${quantidadeFormatada} colheres (sopa) de ${nome}`;
    if (unidade === 'xicara') return `${quantidadeFormatada} xícaras (chá) de ${nome}`;
    if (unidade === 'copo') return `${quantidadeFormatada} copos (americano) de ${nome}`;

    return `${quantidadeFormatada} ${unidade} de ${nome}`;
  }

  function capitalizar(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  function limparPassoInput(input) {
    let valor = input.value.trim();

    valor = valor.replace(/^[\d\-\*\(\)\.]+\s*/, '');
    valor = valor.replace(/^(passo\s*\d+[\:\-\s]*)/i, '');

    input.value = valor.charAt(0).toUpperCase() + valor.slice(1);
  }

  function capitalizarIngrediente(input) {
    input.addEventListener('blur', function() {
      let valor = this.value.trim();

      if (valor) {
        this.value = capitalizar(valor);
      }

      atualizarEstadoBotaoEnvio();
    });
  }

  function capitalizarPasso(input) {
    input.addEventListener('blur', function() {
      let valor = this.value.trim();

      if (valor) {
        limparPassoInput(input);
      }

      atualizarEstadoBotaoEnvio();
    });

    input.addEventListener('input', function() {
      let valor = this.value;

      if (
        valor.match(/^[\d\-\*\(\)\.]+\s/) ||
        valor.toLowerCase().match(/^passo\s*\d+[\:\-\s]/i)
      ) {
        this.value = valor
          .replace(/^[\d\-\*\(\)\.]+\s*/, '')
          .replace(/^passo\s*\d+[\:\-\s]*/i, '');
      }

      atualizarEstadoBotaoEnvio();
    });
  }

  const tempoToggleBtn = document.getElementById('tempoToggleBtn');
  const tempoToggleLabel = document.getElementById('tempoToggleLabel');
  const tempoMinutosWrapper = document.getElementById('tempoMinutosWrapper');
  const tempoHorasWrapper = document.getElementById('tempoHorasWrapper');
  const tempoMinutosInput = document.getElementById('tempoMinutos');
  const tempoHorasInput = document.getElementById('tempoHoras');
  const tempoMinutosHorasInput = document.getElementById('tempoMinutosHoras');
  const tempoHidden = document.getElementById('tempoPreparo');
  const tempoError = document.getElementById('tempoError');

  let tempoModo = 'minutos';

function limparSufixo(valor) {
    return String(valor || '').replace(/\D/g, '');
}

  function atualizarTempoHidden() {
    if (tempoModo === 'minutos') {
      const min = parseInt(limparSufixo(tempoMinutosInput.value));
      tempoHidden.value = min > 0 ? min + 'min' : '';
    } else {
      const h = parseInt(limparSufixo(tempoHorasInput.value)) || 0;
      const m = parseInt(limparSufixo(tempoMinutosHorasInput.value)) || 0;
      const partes = [];
      if (h > 0) partes.push(h + 'h');
      if (m > 0) partes.push(m + 'min');
      tempoHidden.value = partes.join(' ');
    }
  }

  function validarTempo() {
    let msgErro = '';

    if (tempoModo === 'minutos') {
      const min = parseInt(limparSufixo(tempoMinutosInput.value));

      if (min && min >= 60) {
        msgErro = 'Use o modo "Horas" para valores acima de 60 minutos.';
      }
    } else {
      const h = parseInt(limparSufixo(tempoHorasInput.value)) || 0;
      const m = parseInt(limparSufixo(tempoMinutosHorasInput.value)) || 0;

      if (h === 0 && m > 0) {
        msgErro = 'Sem horas? Use o modo "Minutos".';
      } else if (m >= 60) {
        msgErro = 'Os minutos devem ser menores que 60.';
      }
    }

    if (msgErro) {
      tempoError.textContent = msgErro;
      tempoError.classList.add('show');
    } else {
      tempoError.classList.remove('show');
    }

    return msgErro === '';
  }

  tempoToggleBtn.addEventListener('click', function() {
    if (tempoModo === 'minutos') {
      tempoModo = 'horas';
      tempoToggleLabel.textContent = 'Horas';
      tempoMinutosWrapper.style.display = 'none';
      tempoHorasWrapper.style.display = 'flex';

      const min = parseInt(limparSufixo(tempoMinutosInput.value));
      if (min > 0) {
        if (min >= 60) {
          const h = Math.floor(min / 60);
          const m = min % 60;
          tempoHorasInput.value = h + 'h';
          tempoMinutosHorasInput.value = m > 0 ? m + 'min' : '';
        } else {
          tempoHorasInput.value = '';
          tempoMinutosHorasInput.value = min + 'min';
        }
      }

      tempoMinutosInput.value = '';
    } else {
      tempoModo = 'minutos';
      tempoToggleLabel.textContent = 'Minutos';
      tempoHorasWrapper.style.display = 'none';
      tempoMinutosWrapper.style.display = 'flex';

      const h = parseInt(limparSufixo(tempoHorasInput.value)) || 0;
      const m = parseInt(limparSufixo(tempoMinutosHorasInput.value)) || 0;
      const total = h * 60 + m;

      if (total > 0) tempoMinutosInput.value = total + 'min';

      tempoHorasInput.value = '';
      tempoMinutosHorasInput.value = '';
    }

    atualizarTempoHidden();
    validarTempo();
    atualizarEstadoBotaoEnvio();
  });

tempoMinutosInput.addEventListener('focus', function() {
    this.value = limparSufixo(this.value);
});

tempoMinutosInput.addEventListener('input', function() {
    atualizarTempoHidden();
    validarTempo();
    atualizarEstadoBotaoEnvio();
});

tempoMinutosInput.addEventListener('blur', function() {
    const min = parseInt(limparSufixo(this.value), 10) || 0;

    if (min > 60) {
        this.value = '';
    } else if (min > 0) {
        this.value = min + 'min';
    }

    atualizarTempoHidden();
    validarTempo();
    atualizarEstadoBotaoEnvio();
});

tempoHorasInput.addEventListener('focus', function() {
    this.value = limparSufixo(this.value);
});

tempoHorasInput.addEventListener('input', function() {
    atualizarTempoHidden();
    validarTempo();
    atualizarEstadoBotaoEnvio();
});

tempoHorasInput.addEventListener('blur', function() {
    const h = parseInt(limparSufixo(this.value), 10) || 0;

    this.value = h > 0 ? h + 'h' : '';

    atualizarTempoHidden();
    validarTempo();
    atualizarEstadoBotaoEnvio();
});

tempoMinutosHorasInput.addEventListener('focus', function() {
    this.value = limparSufixo(this.value);
});

tempoMinutosHorasInput.addEventListener('input', function() {
    atualizarTempoHidden();
    validarTempo();
    atualizarEstadoBotaoEnvio();
});

tempoMinutosHorasInput.addEventListener('blur', function() {
    const m = parseInt(limparSufixo(this.value), 10) || 0;

    if (m >= 60) {
        this.value = '';
    } else if (m > 0) {
        this.value = m + 'min';
    }

    atualizarTempoHidden();
    validarTempo();
    atualizarEstadoBotaoEnvio();
});

  function atualizarEstadoBotaoEnvio() {
    const submitButton = form.querySelector('.submit-button');

    if (!submitButton) return;

    const tituloInput = document.getElementById('titulo');
    const porcoesInput = document.getElementById('porcoes');
    const chefInput = document.getElementById('chefe');
    const categoriaSelect = document.getElementById('categoria');

    const tituloValido =
      tituloInput && tituloInput.value.trim().length > 0;

    const tempoValido =
      tempoHidden &&
      tempoHidden.value.trim().length > 0 &&
      validarTempo();

    const porcoesValida =
      porcoesInput &&
      porcoesInput.value &&
      Number(porcoesInput.value) >= 1;

    const chefValido =
      chefInput && chefInput.value.trim().length > 0;

    const categoriaValida =
      categoriaSelect && categoriaSelect.value.trim() !== '';

    const ingredientesItens =
      ingredientesContainer.querySelectorAll('.ingrediente-item');

    const ingredienteValido = Array.from(ingredientesItens).some(item => {
      const quantidadeInput = item.querySelector('.quantidade-input');
      const nomeInput = item.querySelector('.ingrediente-nome-input');

      return (
        quantidadeInput &&
        nomeInput &&
        quantidadeInput.value &&
        Number(quantidadeInput.value) > 0 &&
        nomeInput.value.trim().length > 0
      );
    });

    const passosItens =
      modoPreparoContainer.querySelectorAll('.passo-item');

    const passoValido = Array.from(passosItens).some(item => {
      const input = item.querySelector('.passo-input');

      return input && input.value.trim().length > 0;
    });

    const imagemValida =
      imageInput &&
      imageInput.files &&
      imageInput.files.length > 0 &&
      imageInput.files[0].type.match('image.*');

    submitButton.disabled = !(
      tituloValido &&
      tempoValido &&
      porcoesValida &&
      chefValido &&
      categoriaValida &&
      ingredienteValido &&
      passoValido &&
      imagemValida
    );
  }

  imageInput.addEventListener('change', function() {
    const file = this.files[0];

    if (file) {
      if (!file.type.match('image.*')) {
        showError('imagemError', 'Formato de arquivo não suportado. Use JPG, PNG ou GIF.');
        this.value = '';
        atualizarEstadoBotaoEnvio();
        return;
      }

      hideError('imagemError');

      const reader = new FileReader();

      reader.onload = function(e) {
        imagePreview.querySelector('img').src = e.target.result;
        imagePreview.classList.add('active');
        fileText.textContent = file.name;
      };

      reader.readAsDataURL(file);
    } else {
      imagePreview.classList.remove('active');
      fileText.textContent = 'Selecione uma imagem para sua receita';
    }

    atualizarEstadoBotaoEnvio();
  });

  document.getElementById('addIngrediente').addEventListener('click', function() {
    const div = document.createElement('div');

    div.classList.add('ingrediente-item');

    div.innerHTML = `
      <div class="ingrediente-row">
        <input type="number" class="quantidade-input" placeholder="Quant." step="0.01" value="1">
        <select class="unidade-select">
          <option value="g">gramas (g)</option>
          <option value="kg">quilogramas (kg)</option>
          <option value="ml">mililitros (ml)</option>
          <option value="L">litros (L)</option>
          <option value="colher (chá)">colher (chá)</option>
          <option value="colher (sopa)">colher (sopa)</option>
          <option value="xicara">xícara (chá)</option>
          <option value="copo">copo (americano)</option>
          <option value="unidade">unidade(s)</option>
          <option value="pitada">pitada</option>
          <option value="fio">fio</option>
        </select>
        <div class="input-wrapper ingrediente-nome-wrapper">
          <input type="text" class="ingrediente-nome-input" placeholder="Nome do ingrediente" required>
          <button type="button" class="remove-btn">×</button>
        </div>
      </div>
    `;

    ingredientesContainer.appendChild(div);

    const nomeInput = div.querySelector('.ingrediente-nome-input');
    const quantidadeInput = div.querySelector('.quantidade-input');
    const unidadeSelect = div.querySelector('.unidade-select');

    capitalizarIngrediente(nomeInput);

    nomeInput.addEventListener('input', atualizarEstadoBotaoEnvio);
    quantidadeInput.addEventListener('input', atualizarEstadoBotaoEnvio);
    unidadeSelect.addEventListener('change', atualizarEstadoBotaoEnvio);

    div.querySelector('.remove-btn').addEventListener('click', function() {
      const total =
        ingredientesContainer.querySelectorAll('.ingrediente-item').length;

      if (total <= 1) return;

      div.remove();
      atualizarEstadoBotaoEnvio();
    });

    atualizarEstadoBotaoEnvio();
  });

  document.getElementById('addPasso').addEventListener('click', function() {
    const div = document.createElement('div');

    div.classList.add('passo-item');

    const passoNumero =
      modoPreparoContainer.querySelectorAll('.passo-item').length + 1;

    div.innerHTML = `
      <div class="input-wrapper">
        <input type="text" class="passo-input" name="modoPreparo[]" placeholder="Passo ${passoNumero}" required>
        <button type="button" class="remove-btn">×</button>
      </div>
    `;

    modoPreparoContainer.appendChild(div);

    const passoInput = div.querySelector('.passo-input');

    capitalizarPasso(passoInput);

    passoInput.addEventListener('input', atualizarEstadoBotaoEnvio);

    div.querySelector('.remove-btn').addEventListener('click', function() {
      const total =
        modoPreparoContainer.querySelectorAll('.passo-item').length;

      if (total <= 1) return;

      div.remove();

      const passos =
        modoPreparoContainer.querySelectorAll('.passo-item');

      passos.forEach((passo, index) => {
        const input = passo.querySelector('.passo-input');
        input.placeholder = `Passo ${index + 1}`;
      });

      atualizarEstadoBotaoEnvio();
    });

    atualizarEstadoBotaoEnvio();
  });

  function capitalizeFirst(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  const tituloInput = document.getElementById('titulo');

  tituloInput.addEventListener('blur', function() {
    this.value = capitalizeFirst(this.value.trim());
    atualizarEstadoBotaoEnvio();
  });

  tituloInput.addEventListener('input', atualizarEstadoBotaoEnvio);

  const chefInput = document.getElementById('chefe');

  chefInput.addEventListener('blur', function() {
    this.value = capitalizeFirst(this.value.trim());
    atualizarEstadoBotaoEnvio();
  });

  chefInput.addEventListener('input', atualizarEstadoBotaoEnvio);

  document.querySelectorAll('.ingrediente-nome-input').forEach(inp => {
    capitalizarIngrediente(inp);
    inp.addEventListener('input', atualizarEstadoBotaoEnvio);
  });

  document.querySelectorAll('.passo-input').forEach(inp => {
    capitalizarPasso(inp);
    inp.addEventListener('input', atualizarEstadoBotaoEnvio);
  });

  document.querySelectorAll('.quantidade-input').forEach(input => {
    input.addEventListener('input', atualizarEstadoBotaoEnvio);
    input.addEventListener('change', atualizarEstadoBotaoEnvio);
  });

  document.querySelectorAll('.unidade-select').forEach(select => {
    select.addEventListener('change', atualizarEstadoBotaoEnvio);
  });

  const porcoesInput = document.getElementById('porcoes');

  porcoesInput.addEventListener('input', atualizarEstadoBotaoEnvio);
  porcoesInput.addEventListener('change', atualizarEstadoBotaoEnvio);

  const categoriaSelect = document.getElementById('categoria');

  categoriaSelect.addEventListener('change', atualizarEstadoBotaoEnvio);

  form.addEventListener('submit', function(e) {
    let isValid = true;

    if (!form.querySelector('#titulo').value.trim()) {
      showError('tituloError');
      isValid = false;
    } else {
      hideError('tituloError');
    }

    if (!tempoHidden.value.trim() || !validarTempo()) {
      if (!tempoHidden.value.trim()) {
        tempoError.textContent = 'Por favor, informe o tempo de preparo';
        tempoError.classList.add('show');
      }
      isValid = false;
    } else {
      tempoError.classList.remove('show');
    }

    if (!porcoesInput.value || porcoesInput.value < 1) {
      showError('porcoesError');
      isValid = false;
    } else {
      hideError('porcoesError');
    }

    if (!categoriaSelect.value) {
      showError('categoriaError');
      isValid = false;
    } else {
      hideError('categoriaError');
    }

    if (!chefInput.value.trim()) {
      showError('chefeError');
      isValid = false;
    } else {
      hideError('chefeError');
    }

    const ingredientesItens =
      ingredientesContainer.querySelectorAll('.ingrediente-item');

    let temIngredientePreenchido = false;

    ingredientesItens.forEach(item => {
      const nomeInput =
        item.querySelector('.ingrediente-nome-input');

      const quantidadeInput =
        item.querySelector('.quantidade-input');

      if (
        nomeInput &&
        nomeInput.value.trim() &&
        quantidadeInput &&
        quantidadeInput.value
      ) {
        temIngredientePreenchido = true;
      }
    });

    if (!temIngredientePreenchido) {
      showError('ingredientesError');
      isValid = false;
    } else {
      hideError('ingredientesError');
    }

    const passosItens =
      modoPreparoContainer.querySelectorAll('.passo-item');

    let temPassoPreenchido = false;

    passosItens.forEach(item => {
      const input = item.querySelector('.passo-input');

      if (input && input.value.trim()) {
        temPassoPreenchido = true;
      }
    });

    if (!temPassoPreenchido) {
      showError('modoPreparoError');
      isValid = false;
    } else {
      hideError('modoPreparoError');
    }

    if (!imageInput.files || imageInput.files.length === 0) {
      showError(
        'imagemError',
        'Por favor, adicione uma imagem para a receita'
      );
      isValid = false;
    } else if (!imageInput.files[0].type.match('image.*')) {
      showError('imagemError');
      isValid = false;
    } else {
      hideError('imagemError');
    }

    if (!isValid) {
      e.preventDefault();

      const primeiroErro =
        form.querySelector('.error-message.show');

      if (primeiroErro) {
        primeiroErro.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    } else {
      const ingredientesTexto = [];

      ingredientesItens.forEach(item => {
        const texto = formatarIngrediente(item);

        if (texto) ingredientesTexto.push(texto);
      });

      const ingredientesHidden =
        document.createElement('input');

      ingredientesHidden.type = 'hidden';
      ingredientesHidden.name = 'ingredientes';
      ingredientesHidden.value =
        ingredientesTexto.join('||');

      form.appendChild(ingredientesHidden);

      const passosTexto = [];

      passosItens.forEach((item, index) => {
        const input = item.querySelector('.passo-input');

        if (input && input.value.trim()) {
          passosTexto.push(
            `${index + 1}. ${input.value.trim()}`
          );
        }
      });

      const passosHidden =
        document.createElement('input');

      passosHidden.type = 'hidden';
      passosHidden.name = 'modoPreparoTexto';
      passosHidden.value =
        passosTexto.join('||');

      form.appendChild(passosHidden);

      const ingredientesInputs =
        ingredientesContainer.querySelectorAll(
          '.ingrediente-nome-input'
        );

      ingredientesInputs.forEach(
        input => input.disabled = true
      );

      const quantidadesInputs =
        ingredientesContainer.querySelectorAll(
          '.quantidade-input'
        );

      quantidadesInputs.forEach(
        input => input.disabled = true
      );

      const unidadesSelects =
        ingredientesContainer.querySelectorAll(
          '.unidade-select'
        );

      unidadesSelects.forEach(
        select => select.disabled = true
      );
    }
  });

  function showError(id, msg = 'Campo obrigatório') {
    const el = document.getElementById(id);

    if (el) {
      el.textContent = msg;
      el.classList.add('show');
    }
  }

  function hideError(id) {
    const el = document.getElementById(id);

    if (el) {
      el.classList.remove('show');
    }
  }

  atualizarEstadoBotaoEnvio();
});

document.addEventListener("DOMContentLoaded", () => {
  const notification = document.getElementById("notification");

  if (notification) {
    setTimeout(() => notification.classList.add("show"), 300);
    setTimeout(() => notification.classList.remove("show"), 4300);
  }
});