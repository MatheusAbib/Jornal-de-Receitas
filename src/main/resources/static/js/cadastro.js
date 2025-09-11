  function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') input.type = 'text';
    else input.type = 'password';
  }

  // Máscaras simples
  const cpfInput = document.getElementById('cpf');
  cpfInput.addEventListener('input', function() {
    let v = this.value.replace(/\D/g, '');
    if(v.length > 3) v=v.slice(0,3)+'.'+v.slice(3);
    if(v.length > 7) v=v.slice(0,7)+'.'+v.slice(7);
    if(v.length > 11) v=v.slice(0,11)+'-'+v.slice(11,13);
    this.value = v;
  });

  const telInput = document.getElementById('telefone');
  telInput.addEventListener('input', function() {
    let v = this.value.replace(/\D/g,'');
    if(v.length > 0) v='('+v;
    if(v.length > 3) v=v.slice(0,3)+') '+v.slice(3);
    if(v.length > 9) v=v.slice(0,9)+'-'+v.slice(9,13);
    this.value = v;
  });

  // Validação de senhas
  document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const alertBox = document.getElementById('alertBox');

    if (senha !== confirmarSenha) {
      alertBox.textContent = 'As senhas não coincidem!';
      alertBox.className = 'alert alert-error';
      alertBox.style.display = 'block';
      e.preventDefault();
      return;
    }
    if (senha.length < 6) {
      alertBox.textContent = 'A senha deve ter pelo menos 6 caracteres!';
      alertBox.className = 'alert alert-error';
      alertBox.style.display = 'block';
      e.preventDefault();
      return;
    }
  });

  // Mensagem do servidor com redirecionamento
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const error = urlParams.get('error');
  const alertBox = document.getElementById('alertBox');

  if(success){
    alertBox.textContent = decodeURIComponent(success);
    alertBox.className = 'alert alert-success';
    alertBox.style.display = 'block';

    // Redireciona após 3 segundos
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  }

  if(error){
    alertBox.textContent = decodeURIComponent(error);
    alertBox.className = 'alert alert-error';
    alertBox.style.display = 'block';
  }