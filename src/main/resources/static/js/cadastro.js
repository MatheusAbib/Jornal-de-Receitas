 // Toggle de senha aprimorado
    function togglePassword(inputId) {
      const input = document.getElementById(inputId);
      const icon = input.nextElementSibling.querySelector('i');
      
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

    // Máscaras
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function() {
      let v = this.value.replace(/\D/g, '');
      if(v.length > 3) v = v.slice(0,3) + '.' + v.slice(3);
      if(v.length > 7) v = v.slice(0,7) + '.' + v.slice(7);
      if(v.length > 11) v = v.slice(0,11) + '-' + v.slice(11,13);
      this.value = v;
    });

    const telInput = document.getElementById('telefone');
    telInput.addEventListener('input', function() {
      let v = this.value.replace(/\D/g,'');
      if(v.length > 0) v = '(' + v;
      if(v.length > 3) v = v.slice(0,3) + ') ' + v.slice(3);
      if(v.length > 9) v = v.slice(0,9) + '-' + v.slice(9,14);
      this.value = v;
    });

    // Validação em tempo real
    function showError(fieldId, message) {
      const errorDiv = document.getElementById(fieldId + 'Error');
      errorDiv.querySelector('span').textContent = message;
      errorDiv.style.display = 'flex';
      document.getElementById(fieldId).parentElement.parentElement.classList.add('error');
      document.getElementById(fieldId).parentElement.parentElement.classList.remove('success');
    }

    function showSuccess(fieldId) {
      const errorDiv = document.getElementById(fieldId + 'Error');
      errorDiv.style.display = 'none';
      document.getElementById(fieldId).parentElement.parentElement.classList.remove('error');
      document.getElementById(fieldId).parentElement.parentElement.classList.add('success');
    }

    function clearValidation(fieldId) {
      const errorDiv = document.getElementById(fieldId + 'Error');
      errorDiv.style.display = 'none';
      document.getElementById(fieldId).parentElement.parentElement.classList.remove('error');
      document.getElementById(fieldId).parentElement.parentElement.classList.remove('success');
    }

    // Validações específicas
    document.getElementById('nome').addEventListener('blur', function() {
      if(this.value.length < 3) {
        showError('nome', 'Nome deve ter pelo menos 3 caracteres');
      } else if(this.value.length > 100) {
        showError('nome', 'Nome muito longo (máx. 100 caracteres)');
      } else {
        showSuccess('nome');
      }
    });

    document.getElementById('email').addEventListener('blur', function() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(this.value)) {
        showError('email', 'Email inválido');
      } else {
        showSuccess('email');
      }
    });

    document.getElementById('cpf').addEventListener('blur', function() {
      const cpf = this.value.replace(/\D/g, '');
      if(cpf.length !== 11) {
        showError('cpf', 'CPF deve ter 11 dígitos');
      } else {
        showSuccess('cpf');
      }
    });

    document.getElementById('senha').addEventListener('input', function() {
      if(this.value.length < 6) {
        showError('senha', 'Senha deve ter pelo menos 6 caracteres');
      } else {
        showSuccess('senha');
      }
      
      // Atualiza validação da confirmação
      const confirmarSenha = document.getElementById('confirmarSenha').value;
      if(confirmarSenha) {
        validatePasswordMatch();
      }
    });

    document.getElementById('confirmarSenha').addEventListener('input', validatePasswordMatch);

    function validatePasswordMatch() {
      const senha = document.getElementById('senha').value;
      const confirmarSenha = document.getElementById('confirmarSenha').value;
      
      if(confirmarSenha && senha !== confirmarSenha) {
        showError('confirmarSenha', 'As senhas não coincidem');
      } else if(confirmarSenha) {
        showSuccess('confirmarSenha');
      }
    }

    // Validação do formulário
    document.getElementById('cadastroForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Limpa validações anteriores
      ['nome', 'email', 'cpf', 'telefone', 'genero', 'senha', 'confirmarSenha'].forEach(clearValidation);
      
      let isValid = true;
      const alertBox = document.getElementById('alertBox');
      alertBox.style.display = 'none';
      
      // Validações básicas
      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim();
      const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
      const senha = document.getElementById('senha').value;
      const confirmarSenha = document.getElementById('confirmarSenha').value;
      const genero = document.getElementById('genero').value;
      
      if(nome.length < 3) {
        showError('nome', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailRegex.test(email)) {
        showError('email', 'Email inválido');
        isValid = false;
      }
      
      if(cpf.length !== 11) {
        showError('cpf', 'CPF deve ter 11 dígitos');
        isValid = false;
      }
      
      if(!genero) {
        showError('genero', 'Selecione um gênero');
        isValid = false;
      }
      
      if(senha.length < 6) {
        showError('senha', 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
      }
      
      if(senha !== confirmarSenha) {
        showError('confirmarSenha', 'As senhas não coincidem');
        isValid = false;
      }
      
      if(!isValid) {
        alertBox.querySelector('#alertMessage').textContent = 'Por favor, corrija os erros no formulário.';
        alertBox.className = 'alert alert-error';
        alertBox.style.display = 'flex';
        alertBox.classList.add('shake');
        setTimeout(() => alertBox.classList.remove('shake'), 500);
        return;
      }
      
      // Se tudo estiver válido, envia o formulário
      this.submit();
    });

    // Mensagem do servidor
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const alertBox = document.getElementById('alertBox');

    if(success) {
      alertBox.querySelector('#alertMessage').textContent = decodeURIComponent(success);
      alertBox.className = 'alert alert-success';
      alertBox.style.display = 'flex';
      
      // Redireciona após 3 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    }

    if(error) {
      alertBox.querySelector('#alertMessage').textContent = decodeURIComponent(error);
      alertBox.className = 'alert alert-error';
      alertBox.style.display = 'flex';
    }