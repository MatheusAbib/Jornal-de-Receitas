function openLogoutModal() {

  const modal = document.getElementById('logoutModal');

  if (modal) {

    modal.classList.add('show');

    modal.style.display = 'flex';

    document.body.style.overflow = 'hidden';

  }

}

function closeLogoutModal() {

  const modal = document.getElementById('logoutModal');

  if (modal) {

    modal.classList.remove('show');

    modal.style.display = 'none';

    document.body.style.overflow = 'auto';

  }

}


function atualizarEstadoBotaoLogin() {

  const username = document.getElementById('username');

  const password = document.getElementById('password');

  const submitBtn = document.getElementById('loginSubmitBtn');

  if (!username || !password || !submitBtn) {

    return;

  }

  const email = username.value.trim();

  const senha = password.value;

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const senhaValida =
    senha.trim().length > 0;

  submitBtn.disabled =
    !(emailValido && senhaValida);

}


function atualizarEstadoBotaoCadastro() {

  const nome = document.getElementById('cadastroNome');

  const email = document.getElementById('cadastroEmail');

  const cpf = document.getElementById('cadastroCpf');

  const telefone = document.getElementById('cadastroTelefone');

  const genero = document.getElementById('cadastroGenero');

  const senha = document.getElementById('cadastroSenha');

  const confirmarSenha =
    document.getElementById('cadastroConfirmarSenha');

  const form = document.getElementById('cadastroFormModal');

  if (
    !nome ||
    !email ||
    !cpf ||
    !telefone ||
    !genero ||
    !senha ||
    !confirmarSenha ||
    !form
  ) {

    return;

  }

  const submitBtn =
    form.querySelector('.cadastro-submit-btn');

  if (!submitBtn) {

    return;

  }

  const nomeValido =
    nome.value.trim().length >= 3;

  const emailValido =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.value.trim()
    );

  const cpfValido =
    cpf.value.replace(/\D/g, '').length === 11;

  const telefoneValido =
    telefone.value.replace(/\D/g, '').length >= 10;

  const generoValido =
    genero.value.trim() !== '';

  const senhaValida =
    senha.value.length >= 6;

  const confirmarSenhaValida =
    confirmarSenha.value === senha.value &&
    confirmarSenha.value.length >= 6;

  const formularioValido =
    nomeValido &&
    emailValido &&
    cpfValido &&
    telefoneValido &&
    generoValido &&
    senhaValida &&
    confirmarSenhaValida;

  submitBtn.disabled = !formularioValido;

}


function confirmLogout() {

    sessionStorage.setItem('page-loader-force', 'true');

    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = '/';
    })
    .catch(error => {
        console.error('Erro ao fazer logout:', error);
        window.location.href = '/';
    });
}


function openLoginModal() {

  const loginModal = document.getElementById('loginModal');

  if (loginModal) {

    loginModal.classList.add('show');

    document.body.style.overflow = 'hidden';

    hideLoginError();

    atualizarEstadoBotaoLogin();

    setTimeout(() => {

      const usernameField =
        document.getElementById('username');

      if (usernameField) {

        usernameField.focus();

      }

    }, 300);

  }

}

function closeLoginModal() {

  const loginModal =
    document.getElementById('loginModal');

  if (loginModal) {

    loginModal.classList.remove('show');

    document.body.style.overflow = 'auto';

    const loginForm =
      document.getElementById('loginForm');

    if (loginForm) {

      loginForm.reset();

    }

    hideLoginError();

    atualizarEstadoBotaoLogin();

  }

}

function showLoginError(message) {

  const errorDiv =
    document.getElementById('loginError');

  const errorMessage =
    document.getElementById('errorMessage');

  if (errorDiv && errorMessage) {

    errorMessage.textContent = message;

    errorDiv.style.display = 'flex';

    const loginForm =
      document.getElementById('loginForm');

    if (loginForm) {

      loginForm.classList.add('shake');

      setTimeout(
        () => loginForm.classList.remove('shake'),
        500
      );

    }

  }

}

function hideLoginError() {

  const errorDiv =
    document.getElementById('loginError');

  if (errorDiv) {

    errorDiv.style.display = 'none';

  }

}

function showLoginSuccess() {

  const errorDiv =
    document.getElementById('loginError');

  const submitBtn =
    document.querySelector('.login-submit-btn');

  if (errorDiv && submitBtn) {

    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Login realizado! Redirecionando...';

    submitBtn.disabled = true;

    errorDiv.innerHTML =
      '<i class="fas fa-check-circle"></i> Redirecionando...';

    errorDiv.style.display = 'flex';

    errorDiv.style.background =
      'rgba(46, 204, 113, 0.1)';

    errorDiv.style.borderColor =
      'rgba(46, 204, 113, 0.3)';

    errorDiv.style.color =
      '#27ae60';

  }

}


function openCadastroModal() {

  const modal =
    document.getElementById('cadastroModal');

  if (modal) {

    modal.classList.add('show');

    document.body.style.overflow = 'hidden';

    hideCadastroAlert();

    atualizarEstadoBotaoCadastro();

    setTimeout(() => {

      const nomeField =
        document.getElementById('cadastroNome');

      if (nomeField) nomeField.focus();

    }, 300);

  }

}

function closeCadastroModal() {

  const modal =
    document.getElementById('cadastroModal');

  if (modal) {

    modal.classList.remove('show');

    document.body.style.overflow = 'auto';

    const form =
      document.getElementById('cadastroFormModal');

    if (form) {

      form.reset();

    }

    clearCadastroValidation();

    hideCadastroAlert();

    atualizarEstadoBotaoCadastro();

  }

}

function hideCadastroAlert() {

  const alert =
    document.getElementById('cadastroAlert');

  if (alert) alert.style.display = 'none';

}

function showCadastroAlert(message, isError = false) {

  const alert =
    document.getElementById('cadastroAlert');

  const messageSpan =
    document.getElementById('cadastroAlertMessage');

  if (alert && messageSpan) {

    messageSpan.textContent = message;

    alert.className =
      isError
        ? 'cadastro-alert error'
        : 'cadastro-alert';

    alert.style.display = 'flex';

    setTimeout(() => {

      if (alert.style.display === 'flex') {

        alert.style.opacity = '0';

        setTimeout(() => {

          alert.style.display = 'none';

          alert.style.opacity = '1';

        }, 3000);

      }

    }, 5000);

  }

}

function showCadastroError(fieldId, message) {

  const errorDiv =
    document.getElementById(
      `cadastro${fieldId}Error`
    );

  if (errorDiv) {

    errorDiv.textContent = message;

    errorDiv.style.display = 'block';

    const input =
      document.getElementById(
        `cadastro${fieldId}`
      );

    if (input) {

      input.style.borderColor = '#e74c3c';

    }

  }

}

function clearCadastroError(fieldId) {

  const errorDiv =
    document.getElementById(
      `cadastro${fieldId}Error`
    );

  if (errorDiv) {

    errorDiv.style.display = 'none';

    const input =
      document.getElementById(
        `cadastro${fieldId}`
      );

    if (input) {

      input.style.borderColor = '';

    }

  }

}

function clearCadastroValidation() {

  const fields = [
    'Nome',
    'Email',
    'Cpf',
    'Telefone',
    'Genero',
    'Senha',
    'ConfirmarSenha'
  ];

  fields.forEach(field =>
    clearCadastroError(field)
  );

}

function toggleCadastroPassword(inputId) {

  const input =
    document.getElementById(inputId);

  const icon =
    input.parentElement.querySelector(
      '.password-toggle-cadastro i'
    );

  if (input.type === 'password') {

    input.type = 'text';

    icon.classList.remove('fa-eye');

    icon.classList.add('fa-eye-slash');

  } else {

    input.type = 'password';

    icon.classList.remove('fa-eye-slash');

    icon.classList.add('fa-eye');

  }

}

function validateCadastroForm() {

  let isValid = true;

  clearCadastroValidation();

  const nome =
    document.getElementById('cadastroNome')
      .value
      .trim();

  if (nome.length < 3) {

    showCadastroError(
      'Nome',
      'Nome deve ter pelo menos 3 caracteres'
    );

    isValid = false;

  }

  const email =
    document.getElementById('cadastroEmail')
      .value
      .trim();

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {

    showCadastroError(
      'Email',
      'Email inválido'
    );

    isValid = false;

  }

  const cpf =
    document.getElementById('cadastroCpf')
      .value
      .replace(/\D/g, '');

  if (cpf.length !== 11) {

    showCadastroError(
      'Cpf',
      'CPF deve ter 11 dígitos'
    );

    isValid = false;

  }

  const telefone =
    document.getElementById('cadastroTelefone')
      .value
      .replace(/\D/g, '');

  if (telefone.length < 10) {

    showCadastroError(
      'Telefone',
      'Telefone inválido'
    );

    isValid = false;

  }

  const genero =
    document.getElementById('cadastroGenero')
      .value;

  if (!genero) {

    showCadastroError(
      'Genero',
      'Selecione um gênero'
    );

    isValid = false;

  }

  const senha =
    document.getElementById('cadastroSenha')
      .value;

  if (senha.length < 6) {

    showCadastroError(
      'Senha',
      'Senha deve ter pelo menos 6 caracteres'
    );

    isValid = false;

  }

  const confirmarSenha =
    document.getElementById('cadastroConfirmarSenha')
      .value;

  if (senha !== confirmarSenha) {

    showCadastroError(
      'ConfirmarSenha',
      'As senhas não coincidem'
    );

    isValid = false;

  }

  return isValid;

}


function abrirModalUsuario(usuario) {

  const modal =
    document.getElementById('userModal');

  document.getElementById('editNome').value =
    usuario.nome || '';

  document.getElementById('editEmail').value =
    usuario.email || '';

  document.getElementById('editCpf').value =
    usuario.cpf || '';

  document.getElementById('editTelefone').value =
    usuario.telefone || '';

  document.getElementById('editGenero').value =
    (usuario.genero || '').toUpperCase().trim();

  document.getElementById('editDataCadastro').value =
    usuario.dataCadastro || '';

  document.getElementById('editSenha').value = '';

  document.getElementById('confirmarSenha').value = '';

  const messageEl =
    document.getElementById('userEditMessage');

  if (!usuario.email) {

    messageEl.innerHTML =
      '<i class="fas fa-info-circle"></i> Para editar seu perfil completo, faça login primeiro.';

    messageEl.className = 'message info';

  } else {

    messageEl.textContent = '';

    messageEl.className = 'message';

  }

  modal.classList.add('show');

  document.body.style.overflow = 'hidden';

}

function fecharModalUsuario() {

  const modal =
    document.getElementById('userModal');

  if (modal) {

    modal.classList.remove('show');

    document.body.style.overflow = 'auto';

    const modalContent =
      modal.querySelector('.modal-content-user');

    if (modalContent) {

      modalContent.style.overflowY = '';

      modalContent.style.maxHeight = '';

    }

    modal.style.overflowY = '';

  }

}

const editTelefone =
    document.getElementById('editTelefone');

if (editTelefone) {
    editTelefone.addEventListener('input', function () {
        let valor = this.value.replace(/\D/g, '');

        if (valor.length > 11) {
            valor = valor.substring(0, 11);
        }

        if (valor.length <= 10) {
            valor = valor.replace(
                /^(\d{2})(\d{4})(\d{0,4}).*/,
                '($1) $2-$3'
            );
        } else {
            valor = valor.replace(
                /^(\d{2})(\d{5})(\d{0,4}).*/,
                '($1) $2-$3'
            );
        }

        this.value = valor;
    });
}

function toggleUserEditMode() {

  const viewMode =
    document.getElementById('userViewMode');

  const editMode =
    document.getElementById('userEditMode');

  if (viewMode && editMode) {

    const isViewVisible =
      viewMode.style.display !== 'none';

    viewMode.style.display =
      isViewVisible ? 'none' : 'block';

    editMode.style.display =
      isViewVisible ? 'block' : 'none';

  }

}

let estadoOriginalUsuario = null;

function capturarEstadoOriginalUsuario() {
  estadoOriginalUsuario = {
    nome: document.getElementById('editNome')?.value.trim() || '',
    email: document.getElementById('editEmail')?.value.trim() || '',
    telefone: document.getElementById('editTelefone')?.value.trim() || '',
    genero: document.getElementById('editGenero')?.value || ''
  };
}

function atualizarEstadoBotaoSalvarUsuario() {
  const form = document.getElementById('userEditForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  const nome = document.getElementById('editNome')?.value.trim() || '';
  const email = document.getElementById('editEmail')?.value.trim() || '';
  const telefone = document.getElementById('editTelefone')?.value.trim() || '';
  const genero = document.getElementById('editGenero')?.value || '';
  const senha = document.getElementById('editSenha')?.value || '';
  const confirmarSenha = document.getElementById('confirmarSenha')?.value || '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nomeValido = nome.length >= 3;
  const emailValido = emailRegex.test(email);
  const telefoneValido = telefone.replace(/\D/g, '').length >= 10;
  const generoValido = genero.trim() !== '';

  let senhaValida = true;
  if (senha || confirmarSenha) {
    senhaValida = senha.length >= 6 && senha === confirmarSenha;
  }

  const formularioValido =
    nomeValido && emailValido && telefoneValido && generoValido && senhaValida;

  if (!estadoOriginalUsuario) {
    submitBtn.disabled = true;
    return;
  }

  const mudou =
    nome !== estadoOriginalUsuario.nome ||
    email !== estadoOriginalUsuario.email ||
    telefone !== estadoOriginalUsuario.telefone ||
    genero !== estadoOriginalUsuario.genero ||
    senha.length > 0 ||
    confirmarSenha.length > 0;

  submitBtn.disabled = !(formularioValido && mudou);
}

function formatarTelefone(telefone) {

  if (!telefone) return '';

  const digits =
    telefone.replace(/\D/g, '');

  if (digits.length === 11) {

    return digits.replace(
      /(\d{2})(\d{5})(\d{4})/,
      '($1) $2-$3'
    );

  } else if (digits.length === 10) {

    return digits.replace(
      /(\d{2})(\d{4})(\d{4})/,
      '($1) $2-$3'
    );

  } else if (digits.length === 9) {

    return digits.replace(
      /(\d{5})(\d{4})/,
      '$1-$2'
    );

  } else if (digits.length === 8) {

    return digits.replace(
      /(\d{4})(\d{4})/,
      '$1-$2'
    );

  }

  return digits;

}

function aplicarMascaraTelefoneInput(input) {

  let value =
    input.value.replace(/\D/g, '');

  if (value.length > 11) {

    value =
      value.substring(0, 11);

  }

  if (value.length === 11) {

    value =
      value.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3'
      );

  } else if (value.length === 10) {

    value =
      value.replace(
        /(\d{2})(\d{4})(\d{4})/,
        '($1) $2-$3'
      );

  } else if (value.length > 6) {

    value =
      value.replace(
        /(\d{2})(\d{4})(\d{0,4})/,
        '($1) $2-$3'
      );

  } else if (value.length > 2) {

    value =
      value.replace(
        /(\d{2})(\d{0,5})/,
        '($1) $2'
      );

  } else if (value.length > 0) {

    value =
      value.replace(
        /(\d{0,2})/,
        '($1'
      );

  }

  input.value = value;

}

function showMessage(message, type) {

  const messageEl =
    document.getElementById('userEditMessage');

  if (messageEl) {

    messageEl.textContent = message;

    messageEl.className =
      `message ${type}`;

    if (type === 'success') {

      messageEl.innerHTML =
        `<i class="fas fa-check-circle"></i> ${message}`;

    } else {

      messageEl.innerHTML =
        `<i class="fas fa-exclamation-circle"></i> ${message}`;

    }

  }

}


function verificarUsuarioAutenticado() {

  const nomeUsuarioElement =
    document.querySelector(
      '.newspaper-subtitle span'
    );

  const estaLogado =
    nomeUsuarioElement &&
    nomeUsuarioElement.textContent.trim();

  if (estaLogado) {

    const userIcon =
      document.getElementById('userIcon');

    if (userIcon) {

      userIcon.style.cursor = 'pointer';

      userIcon.title =
        'Ver meu perfil';

    }

  }

}

function configurarIconeUsuario() {

  const userIcon =
    document.getElementById('userIcon');

  const nomeUsuarioElement =
    document.querySelector(
      '.newspaper-subtitle span'
    );

  const estaLogado =
    nomeUsuarioElement &&
    nomeUsuarioElement.textContent.trim();

  if (userIcon && estaLogado) {

    userIcon.style.display =
      'inline-flex';

    userIcon.style.cursor =
      'pointer';

    userIcon.title =
      'Ver meu perfil';

    userIcon.onclick = function() {

      abrirModalUsuarioSimples();

    };

  } else if (userIcon) {

    userIcon.style.display =
      'none';

  }

}

async function abrirModalUsuarioSimples() {

  const modal =
    document.getElementById('userModal');

  if (!modal) {

    console.error(
      'Modal do usuário não encontrado'
    );

    return;

  }

  const messageEl =
    document.getElementById(
      'userEditMessage'
    );

  if (messageEl) {

    messageEl.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Carregando dados do usuário...';

    messageEl.className =
      'message info';

  }

  try {

    const response =
      await fetch(
        '/perfil/usuario-logado',
        {
          credentials: 'include'
        }
      );

    if (response.ok) {

      const data =
        await response.json();

      const usuario =
        data.usuario;

      if (document.getElementById('editNome')) {

        document.getElementById('editNome').value =
          usuario.nome || '';

      }

      if (document.getElementById('editEmail')) {

        document.getElementById('editEmail').value =
          usuario.email || '';

      }

      if (document.getElementById('editCpf')) {

        document.getElementById('editCpf').value =
          usuario.cpf || '';

      }

      if (document.getElementById('editTelefone')) {

        let telefoneValue =
          usuario.telefone || '';

        if (telefoneValue) {

          telefoneValue =
            formatarTelefone(
              telefoneValue
            );

        }

        document.getElementById('editTelefone').value =
          telefoneValue;

      }

      if (document.getElementById('editGenero')) {

        const generoSelect =
          document.getElementById('editGenero');

        const generoValue =
          (usuario.genero || '').toUpperCase();

        generoSelect.value =
          generoValue;

      }

      if (document.getElementById('editDataCadastro')) {

        let dataCadastro =
          usuario.dataCadastro || '';

        if (dataCadastro) {

          try {

            const dataString =
              dataCadastro.split('T')[0];

            const [ano, mes, dia] =
              dataString.split('-');

            const dataFormatada =
              `${dia}/${mes}/${ano}`;

            document.getElementById(
              'editDataCadastro'
            ).value =
              dataFormatada;

          } catch (e) {

            document.getElementById(
              'editDataCadastro'
            ).value =
              dataCadastro;

          }

        }

      }

      document.getElementById('viewNome').textContent =
        usuario.nome || '-';

      document.getElementById('viewEmail').textContent =
        usuario.email || '-';

      document.getElementById('viewCpf').textContent =
        usuario.cpf || '-';

      document.getElementById('viewTelefone').textContent =
        usuario.telefone || '-';

      const generoMap = {
        'MASCULINO': 'Masculino',
        'FEMININO': 'Feminino',
        'OUTRO': 'Outro'
      };

      document.getElementById('viewGenero').textContent =
        generoMap[usuario.genero] ||
        usuario.genero ||
        '-';

      if (usuario.dataCadastro) {

        try {

          const dataString =
            usuario.dataCadastro.split('T')[0];

          const [ano, mes, dia] =
            dataString.split('-');

          document.getElementById(
            'viewDataCadastro'
          ).textContent =
            `${dia}/${mes}/${ano}`;

        } catch (e) {

          document.getElementById(
            'viewDataCadastro'
          ).textContent =
            usuario.dataCadastro || '-';

        }

      } else {

        document.getElementById(
          'viewDataCadastro'
        ).textContent = '-';

      }

      if (document.getElementById('editSenha')) {

        document.getElementById('editSenha').value = '';

      }

      if (document.getElementById('confirmarSenha')) {

        document.getElementById(
          'confirmarSenha'
        ).value = '';

      }

      document.getElementById(
        'userViewMode'
      ).style.display = 'block';

      document.getElementById(
        'userEditMode'
      ).style.display = 'none';

      if (messageEl) {

        messageEl.innerHTML = '';

        messageEl.className =
          'message';

      }

      capturarEstadoOriginalUsuario();
      atualizarEstadoBotaoSalvarUsuario();

    } else if (response.status === 401) {

      const nomeUsuarioElement =
        document.querySelector(
          '.newspaper-subtitle span'
        );

      const nomeUsuario =
        nomeUsuarioElement
          ? nomeUsuarioElement.textContent.trim()
          : '';

      if (document.getElementById('editNome')) {

        document.getElementById(
          'editNome'
        ).value =
          nomeUsuario || '';

      }

      if (messageEl) {

        messageEl.innerHTML =
          '<i class="fas fa-info-circle"></i> Faça login para acessar todas as funcionalidades.';

        messageEl.className =
          'message info';

      }

    } else {

      if (messageEl) {

        messageEl.innerHTML =
          '<i class="fas fa-exclamation-circle"></i> Erro ao carregar dados do usuário.';

        messageEl.className =
          'message error';

      }

    }

  } catch (error) {

    const nomeUsuarioElement =
      document.querySelector(
        '.newspaper-subtitle span'
      );

    const nomeUsuario =
      nomeUsuarioElement
        ? nomeUsuarioElement.textContent.trim()
        : '';

    if (document.getElementById('editNome')) {

      document.getElementById(
        'editNome'
      ).value =
        nomeUsuario || '';

    }

    if (messageEl) {

      messageEl.innerHTML =
        '<i class="fas fa-exclamation-circle"></i> Erro de conexão ao carregar dados.';

      messageEl.className =
        'message error';

    }

  }

  modal.classList.add('show');

  document.body.style.overflow =
    'hidden';

  setTimeout(() => {

    const nomeField =
      document.getElementById('editNome');

    if (nomeField) {

      nomeField.focus();

    }

  }, 300);

}



function setupMobileModalScroll() {

  const userModal =
    document.getElementById('userModal');

  if (userModal) {

    userModal.addEventListener(
      'touchmove',
      function(e) {

        const modalContent =
          this.querySelector(
            '.modal-content-user'
          );

        if (modalContent) {

          const isScrollable =
            modalContent.scrollHeight >
            modalContent.clientHeight;

          const isAtTop =
            modalContent.scrollTop === 0;

          const isAtBottom =
            modalContent.scrollTop +
            modalContent.clientHeight >=
            modalContent.scrollHeight;

          if (
            !isScrollable ||
            (
              e.target === modalContent &&
              (
                (
                  isAtTop &&
                  e.touches[0].clientY >
                  e.touches[0].clientY
                ) ||
                (
                  isAtBottom &&
                  e.touches[0].clientY <
                  e.touches[0].clientY
                )
              )
            )
          ) {

            e.stopPropagation();

          }

        }

      },
      { passive: false }
    );

    if (window.innerWidth <= 768) {

      userModal.addEventListener(
        'shown',
        function() {

          const modalContent =
            this.querySelector(
              '.modal-content-user'
            );

          if (modalContent) {

            const viewportHeight =
              window.innerHeight;

            modalContent.style.maxHeight =
              `${viewportHeight * 0.8}px`;

          }

        }
      );

    }

  }

}


function setupLoginModal() {

  const loginModal =
    document.getElementById('loginModal');

  const closeBtn =
    document.querySelector(
      '.close-login-modal'
    );

  if (closeBtn) {

    closeBtn.addEventListener(
      'click',
      closeLoginModal
    );

  }

  if (loginModal) {

    loginModal.addEventListener(
      'click',
      function(e) {

        if (e.target === loginModal) {

          closeLoginModal();

        }

      }
    );

  }

  const sidebarLoginLink =
    document.querySelector(
      'a[onclick*="openLoginModal"]'
    );

  if (sidebarLoginLink) {

    sidebarLoginLink.addEventListener(
      'click',
      function(e) {

        e.preventDefault();

        openLoginModal();

      }
    );

  }

}



document.addEventListener(
  'DOMContentLoaded',
  function() {


    const cpfInput =
      document.getElementById('cpf');

    if (cpfInput) {

      cpfInput.addEventListener(
        'input',
        function() {

          let v =
            this.value.replace(/\D/g, '');

          if (v.length > 3)
            v =
              v.slice(0, 3) +
              '.' +
              v.slice(3);

          if (v.length > 7)
            v =
              v.slice(0, 7) +
              '.' +
              v.slice(7);

          if (v.length > 11)
            v =
              v.slice(0, 11) +
              '-' +
              v.slice(11, 13);

          this.value = v;

        }
      );

    }


    const telefoneInput =
      document.getElementById('telefone');

    if (telefoneInput) {

      telefoneInput.addEventListener(
        'input',
        function() {

          let v =
            this.value.replace(/\D/g, '');

          if (v.length > 0)
            v = '(' + v;

          if (v.length > 3)
            v =
              v.slice(0, 3) +
              ') ' +
              v.slice(3);

          if (v.length > 9)
            v =
              v.slice(0, 9) +
              '-' +
              v.slice(9, 14);

          this.value = v;

        }
      );

    }


    const urlParams =
      new URLSearchParams(
        window.location.search
      );

    const error =
      urlParams.get('error');

    if (error) {

      const errorDiv =
        document.getElementById(
          'loginError'
        );

      const errorMsg =
        document.getElementById(
          'errorMessage'
        );

      if (errorDiv && errorMsg) {

        errorMsg.textContent = error;

        errorDiv.style.display =
          'flex';

      }

    }


    setupLoginModal();

    verificarUsuarioAutenticado();

    configurarIconeUsuario();

    

    ['editNome', 'editEmail', 'editTelefone', 'editGenero', 'editSenha', 'confirmarSenha']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', atualizarEstadoBotaoSalvarUsuario);
          el.addEventListener('change', atualizarEstadoBotaoSalvarUsuario);
        }
      });

    const closeLogoutBtn =
      document.querySelector(
        '.close-logout-modal'
      );

    if (closeLogoutBtn) {

      closeLogoutBtn.addEventListener(
        'click',
        closeLogoutModal
      );

    }

    const cancelLogoutBtn =
      document.querySelector(
        '.logout-modal .cancel'
      );

    if (cancelLogoutBtn) {

      cancelLogoutBtn.addEventListener(
        'click',
        closeLogoutModal
      );

    }

const logoutBtn =
    document.querySelector(
        '.logout-modal .logout'
    );

if (logoutBtn) {
    logoutBtn.addEventListener(
        'click',
        function() {
            sessionStorage.setItem('page-loader-force', 'true');

            const form =
                document.createElement('form');

            form.method = 'POST';
            form.action = '/logout';

            document.body.appendChild(form);
            form.submit();
        }
    );
}

    const logoutModal =
      document.getElementById(
        'logoutModal'
      );

    if (logoutModal) {

      logoutModal.addEventListener(
        'click',
        function(e) {

          if (e.target === logoutModal) {

            closeLogoutModal();

          }

        }
      );

    }


    const loginForm =
      document.getElementById(
        'loginForm'
      );

    if (loginForm) {

      const loginUsername =
        document.getElementById(
          'username'
        );

      const loginPassword =
        document.getElementById(
          'password'
        );



      if (loginUsername) {

        loginUsername.addEventListener(
          'input',
          atualizarEstadoBotaoLogin
        );

      }

      if (loginPassword) {

        loginPassword.addEventListener(
          'input',
          atualizarEstadoBotaoLogin
        );

      }



      atualizarEstadoBotaoLogin();


      loginForm.addEventListener(
        'submit',
        async function(event) {

          event.preventDefault();

          const username =
            document.getElementById(
              'username'
            ).value;

          const password =
            document.getElementById(
              'password'
            ).value;

          const remember =
            document.getElementById(
              'remember'
            ).checked;

          const submitBtn =
            this.querySelector(
              'button[type="submit"]'
            );

          const originalText =
            submitBtn.innerHTML;

          hideLoginError();

          submitBtn.disabled = true;

          submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Entrando...';

          try {

            const response =
              await fetch(
                '/login',
                {
                  method: 'POST',

                  headers: {
                    'Content-Type':
                      'application/json'
                  },

                  body: JSON.stringify({

                    email: username,

                    senha: password

                  })

                }
              );

            const result =
              await response.json();

            if (result.success) {
                showLoginSuccess();

                sessionStorage.setItem('page-loader-force', 'true');

                setTimeout(() => {
                    if (result.role === 'ADMIN') {
                        window.location.href = '/usuarios';
                    } else {
                        window.location.href = result.redirectUrl || '/';
                    }
                }, 2000);
            } else {

              showLoginError(
                result.message ||
                'Email ou senha incorretos'
              );

              document.getElementById(
                'password'
              ).value = '';

              document.getElementById(
                'password'
              ).focus();

              atualizarEstadoBotaoLogin();

            }

          } catch (error) {

            showLoginError(
              'Erro de conexão. Verifique sua internet.'
            );

            atualizarEstadoBotaoLogin();

          } finally {


            if (!document.getElementById('loginError') ||
                document.getElementById('loginError').style.display !== 'flex' ||
                !document.querySelector('.login-submit-btn')?.innerHTML.includes('Login realizado!')) {

              submitBtn.innerHTML =
                originalText;

              atualizarEstadoBotaoLogin();

            }

          }

        }
      );

    }


    const cadastroForm =
      document.getElementById(
        'cadastroFormModal'
      );

    if (cadastroForm) {

      const cadastroFields = [

        'cadastroNome',

        'cadastroEmail',

        'cadastroCpf',

        'cadastroTelefone',

        'cadastroGenero',

        'cadastroSenha',

        'cadastroConfirmarSenha'

      ];



      cadastroFields.forEach(
        fieldId => {

          const field =
            document.getElementById(
              fieldId
            );

          if (field) {

            field.addEventListener(
              'input',
              atualizarEstadoBotaoCadastro
            );

            field.addEventListener(
              'change',
              atualizarEstadoBotaoCadastro
            );

          }

        }
      );



      atualizarEstadoBotaoCadastro();


      cadastroForm.addEventListener(
        'submit',
        async function(e) {

          e.preventDefault();



          if (!validateCadastroForm()) {

            atualizarEstadoBotaoCadastro();

            return;

          }

          const submitBtn =
            this.querySelector(
              '.cadastro-submit-btn'
            );

          const originalText =
            submitBtn.innerHTML;

          submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';

          submitBtn.disabled = true;

          const formData =
            new FormData(this);

          const dados = {

            nome:
              formData.get('nome'),

            email:
              formData.get('email'),

            cpf:
              formData
                .get('cpf')
                .replace(/\D/g, ''),

            telefone:
              formData
                .get('telefone')
                .replace(/\D/g, ''),

            genero:
              formData.get('genero'),

            senha:
              formData.get('senha')

          };

          try {

            const response =
              await fetch(
                '/cadastro',
                {

                  method: 'POST',

                  headers: {

                    'Content-Type':
                      'application/json'

                  },

                  body:
                    JSON.stringify(dados)

                }
              );

            const result =
              await response.json();

            if (
              response.ok &&
              result.success
            ) {

              showCadastroAlert(
                result.message ||
                'Cadastro realizado com sucesso! Faça login.'
              );

              setTimeout(() => {

                closeCadastroModal();

                openLoginModal();

              }, 2000);

            } else {

              showCadastroAlert(
                result.message ||
                'Erro ao cadastrar',
                true
              );

              submitBtn.innerHTML =
                originalText;

              atualizarEstadoBotaoCadastro();

            }

          } catch (error) {

            showCadastroAlert(
              'Erro de conexão. Tente novamente.',
              true
            );

            submitBtn.innerHTML =
              originalText;

            atualizarEstadoBotaoCadastro();

          }

        }
      );

    }


    const cadastroCpf =
      document.getElementById(
        'cadastroCpf'
      );

    if (cadastroCpf) {

      cadastroCpf.addEventListener(
        'input',
        function() {

          let v =
            this.value.replace(/\D/g, '');

          if (v.length > 3)
            v =
              v.slice(0, 3) +
              '.' +
              v.slice(3);

          if (v.length > 7)
            v =
              v.slice(0, 7) +
              '.' +
              v.slice(7);

          if (v.length > 11)
            v =
              v.slice(0, 11) +
              '-' +
              v.slice(11, 13);

          this.value = v;

          atualizarEstadoBotaoCadastro();

        }
      );

    }


    const cadastroTelefone =
      document.getElementById(
        'cadastroTelefone'
      );

    if (cadastroTelefone) {

      cadastroTelefone.addEventListener(
        'input',
        function() {

          let v =
            this.value.replace(
              /\D/g,
              ''
            );

          if (v.length > 0)
            v = '(' + v;

          if (v.length > 3)
            v =
              v.slice(0, 3) +
              ') ' +
              v.slice(3);

          if (v.length > 9)
            v =
              v.slice(0, 9) +
              '-' +
              v.slice(9, 14);

          this.value = v;

          atualizarEstadoBotaoCadastro();

        }
      );

    }


    const closeCadastroBtn =
      document.querySelector(
        '.close-cadastro-modal'
      );

    if (closeCadastroBtn) {

      closeCadastroBtn.addEventListener(
        'click',
        closeCadastroModal
      );

    }

    const cadastroModal =
      document.getElementById(
        'cadastroModal'
      );

    if (cadastroModal) {

      cadastroModal.addEventListener(
        'click',
        function(e) {

          if (e.target === this) {

            closeCadastroModal();

          }

        }
      );

    }


    setupMobileModalScroll();

    const closeUserModalBtn =
      document.querySelector(
        '.close-user-modal'
      );

    if (closeUserModalBtn) {

      closeUserModalBtn.addEventListener(
        'click',
        fecharModalUsuario
      );

    }

    const userModal =
      document.getElementById(
        'userModal'
      );

    if (userModal) {

      userModal.addEventListener(
        'click',
        function(event) {

          if (event.target === this) {

            fecharModalUsuario();

          }

        }
      );

    }


    const userEditForm =
      document.getElementById(
        'userEditForm'
      );

    if (userEditForm) {

      userEditForm.addEventListener(
        'submit',
        async function(event) {

          event.preventDefault();

          const formData =
            new FormData(this);

          const telefoneInput =
            document.getElementById(
              'editTelefone'
            );

          if (
            telefoneInput &&
            telefoneInput.value
          ) {

            const telefoneSemMascara =
              telefoneInput.value.replace(
                /\D/g,
                ''
              );

            formData.set(
              'telefone',
              telefoneSemMascara
            );

          }

          const dadosAtualizados = {

            nome:
              formData.get('nome'),

            email:
              formData.get('email'),

            telefone:
              formData.get('telefone'),

            genero:
              formData.get('genero'),

            senha:
              formData.get('senha'),

            confirmarSenha:
              formData.get(
                'confirmarSenha'
              )

          };

          if (
            dadosAtualizados.senha &&
            dadosAtualizados.senha !==
            dadosAtualizados.confirmarSenha
          ) {

            showMessage(
              'As senhas não coincidem',
              'error'
            );

            return;

          }

          if (
            !dadosAtualizados.senha ||
            dadosAtualizados.senha.trim() === ''
          ) {

            delete dadosAtualizados.senha;

            delete dadosAtualizados.confirmarSenha;

          }

          const submitBtn =
            this.querySelector(
              'button[type="submit"]'
            );

          const originalBtnText =
            submitBtn.innerHTML;

          submitBtn.innerHTML =
            '<i class="fas fa-spinner fa-spin"></i> Salvando...';

          submitBtn.disabled = true;

          try {

            const response =
              await fetch(
                '/perfil/editar',
                {

                  method: 'POST',

                  headers: {

                    'Content-Type':
                      'application/json',

                    'X-Requested-With':
                      'XMLHttpRequest'

                  },

                  credentials:
                    'include',

                  body:
                    JSON.stringify(
                      dadosAtualizados
                    )

                }
              );

            const result =
              await response.json();

            if (response.ok) {
                const mensagem =
                    result.message ||

                showMessage(
                    mensagem,
                    'success'
                );

                mostrarNotificacaoPerfil(
                    mensagem,
                    'success'
                );

              if (dadosAtualizados.nome) {

                const nomeUsuarioElement =
                  document.querySelector(
                    '.newspaper-subtitle span'
                  );

                if (nomeUsuarioElement) {

                  nomeUsuarioElement.textContent =
                    dadosAtualizados.nome;

                }

              }

              setTimeout(
                fecharModalUsuario,
                1500
              );

          } else {
              const mensagem =
                  result.message ||
                  'Erro ao editar seus dados.';

              showMessage(
                  mensagem,
                  'error'
              );

              mostrarNotificacaoPerfil(
                  mensagem,
                  'error'
              );
          }

          } catch (error) {
              const mensagem =
                  'Erro de conexão ao editar seus dados.';

              showMessage(
                  mensagem,
                  'error'
              );

              mostrarNotificacaoPerfil(
                  mensagem,
                  'error'
              );
          } finally {

            submitBtn.innerHTML =
              originalBtnText;

            atualizarEstadoBotaoSalvarUsuario();

          }

        }
      );

    }

  }
);