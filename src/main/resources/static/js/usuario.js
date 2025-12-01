 // ===================== VARIÁVEIS GLOBAIS =====================
let currentDeleteUser = null;
let currentEditUser = null;

// ===================== FUNÇÕES DE NOTIFICAÇÃO =====================
function showUserNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `user-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    ${message}
  `;
  
  document.body.appendChild(notification);
  
  // Mostrar notificação
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Remover após 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ===================== MODAL DE EXCLUSÃO =====================
function openDeleteModal(button) {
  currentDeleteUser = {
    id: button.getAttribute('data-id'),
    nome: button.getAttribute('data-nome'),
    email: button.getAttribute('data-email'),
    cpf: button.getAttribute('data-cpf')
  };
  
  document.getElementById('deleteUserName').textContent = currentDeleteUser.nome;
  document.getElementById('deleteUserEmail').textContent = currentDeleteUser.email;
  document.getElementById('deleteUserCpf').textContent = currentDeleteUser.cpf;
  
  document.getElementById('deleteUserModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeDeleteModal() {
  document.getElementById('deleteUserModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  currentDeleteUser = null;
}

async function confirmDeleteUser() {
  if (!currentDeleteUser) return;
  
  const deleteBtn = document.querySelector('#deleteUserModal .modal-button-delete.confirm');
  const originalText = deleteBtn.innerHTML;
  
  try {
    // Mostrar carregamento
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';
    deleteBtn.disabled = true;
    
    const response = await fetch(`/usuarios/excluir/${currentDeleteUser.id}`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      showUserNotification('Usuário excluído com sucesso!', 'success');
      
      // Fechar modal e recarregar a página após um breve delay
      setTimeout(() => {
        closeDeleteModal();
        location.reload();
      }, 1000);
      
    } else {
      throw new Error('Erro ao excluir usuário');
    }
    
  } catch (error) {
    console.error('Erro:', error);
    showUserNotification('Erro ao excluir usuário', 'error');
    deleteBtn.innerHTML = originalText;
    deleteBtn.disabled = false;
  }
}

// ===================== MODAL DE EDIÇÃO =====================
// ===================== MODAL DE EDIÇÃO =====================
function openEditModal(button) {
  currentEditUser = {
    id: button.getAttribute('data-id'),
    nome: button.getAttribute('data-nome'),
    email: button.getAttribute('data-email'),
    cpf: button.getAttribute('data-cpf'),  // CPF sem formatação
    telefone: button.getAttribute('data-telefone') || '',
    genero: button.getAttribute('data-genero') || '',
    role: button.getAttribute('data-role') || 'USER'
  };
  
  // Preencher formulário
  document.getElementById('editUserId').value = currentEditUser.id;
  document.getElementById('editUserNome').value = currentEditUser.nome;
  document.getElementById('editUserEmail').value = currentEditUser.email;
  
  // CPF - formatar automaticamente
  let cpfValue = currentEditUser.cpf || '';
  if (cpfValue) {
    // Remover qualquer formatação existente
    cpfValue = cpfValue.replace(/\D/g, '');
    
    // Aplicar máscara se tiver 11 dígitos
    if (cpfValue.length === 11) {
      cpfValue = cpfValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
  }
  document.getElementById('editUserCpf').value = cpfValue;
  
  // Telefone - formatar automaticamente
  let telefoneValue = currentEditUser.telefone || '';
  if (telefoneValue) {
    // Remover qualquer formatação existente
    const digits = telefoneValue.replace(/\D/g, '');
    
    // Aplicar máscara baseada no tamanho
    if (digits.length === 11) {
      telefoneValue = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (digits.length === 10) {
      telefoneValue = digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (digits.length > 0) {
      // Se não tiver tamanho padrão, manter o valor original
      telefoneValue = digits;
    }
  }
  document.getElementById('editUserTelefone').value = telefoneValue;
  
  document.getElementById('editUserGenero').value = currentEditUser.genero;
  document.getElementById('editUserRole').value = currentEditUser.role;
  
  // Limpar campos de senha
  document.getElementById('editUserSenha').value = '';
  document.getElementById('editUserConfirmarSenha').value = '';
  
  // Configurar ação do formulário
  document.getElementById('editUserForm').action = `/usuarios/editar/${currentEditUser.id}`;
  
  document.getElementById('editUserModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}



function closeEditModal() {
  document.getElementById('editUserModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  currentEditUser = null;
}

// ===================== MODAL DE CONFIRMAÇÃO =====================
function openConfirmSaveModal() {
  document.getElementById('confirmSaveModal').style.display = 'block';
}

function closeConfirmSaveModal() {
  document.getElementById('confirmSaveModal').style.display = 'none';
}

// ===================== FORMULÁRIO DE EDIÇÃO =====================
document.getElementById('editUserForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const senha = document.getElementById('editUserSenha').value;
  const confirmarSenha = document.getElementById('editUserConfirmarSenha').value;
  
  if (senha && senha !== confirmarSenha) {
    showUserNotification('As senhas não coincidem!', 'error');
    return;
  }
  
  openConfirmSaveModal();
});

async function confirmEditUser() {
  const form = document.getElementById('editUserForm');
  const formData = new FormData(form);
  
  // Remover máscaras antes de enviar
  const cpfInput = document.getElementById('editUserCpf');
  const telefoneInput = document.getElementById('editUserTelefone');
  
  if (cpfInput) {
    formData.set('cpf', removerMascara(cpfInput.value));
  }
  
  if (telefoneInput && telefoneInput.value) {
    formData.set('telefone', removerMascara(telefoneInput.value));
  }
  
  const saveBtn = document.querySelector('#confirmSaveModal .modal-button-confirm.confirm');
  const originalText = saveBtn.innerHTML;
  
  try {
    // Mostrar carregamento
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    saveBtn.disabled = true;
    
    const response = await fetch(form.action, {
      method: 'POST',
      body: new URLSearchParams([...formData]),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      credentials: 'include'
    });
    
    if (response.ok) {
      showUserNotification('Usuário atualizado com sucesso!', 'success');
      
      // Fechar modais e recarregar
      setTimeout(() => {
        closeConfirmSaveModal();
        closeEditModal();
        location.reload();
      }, 1000);
      
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao atualizar usuário');
    }
    
  } catch (error) {
    console.error('Erro:', error);
    showUserNotification('Erro ao atualizar usuário', 'error');
    saveBtn.innerHTML = originalText;
    saveBtn.disabled = false;
  }
}

// ===================== CONFIGURAÇÃO DE EVENT LISTENERS =====================
document.addEventListener('DOMContentLoaded', function() {
  // Modal de exclusão
  const deleteModal = document.getElementById('deleteUserModal');
  const closeDeleteBtn = document.querySelector('.close-delete-user-modal');
  const cancelDeleteBtn = document.querySelector('#deleteUserModal .modal-button-delete.cancel');
  const confirmDeleteBtn = document.querySelector('#deleteUserModal .modal-button-delete.confirm');
  
  if (closeDeleteBtn) {
    closeDeleteBtn.addEventListener('click', closeDeleteModal);
  }
  
  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  }
  
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', confirmDeleteUser);
  }
  
  if (deleteModal) {
    deleteModal.addEventListener('click', function(e) {
      if (e.target === deleteModal) {
        closeDeleteModal();
      }
    });
  }
  
  // Modal de edição
  const editModal = document.getElementById('editUserModal');
  const closeEditBtn = document.querySelector('.close-edit-user-modal');
  const cancelEditBtn = document.querySelector('#editUserModal .modal-button-edit.cancel');
  
  if (closeEditBtn) {
    closeEditBtn.addEventListener('click', closeEditModal);
  }
  
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener('click', closeEditModal);
  }
  
  if (editModal) {
    editModal.addEventListener('click', function(e) {
      if (e.target === editModal) {
        closeEditModal();
      }
    });
  }

    // ========== CONFIGURAR MÁSCARAS NOS CAMPOS ==========
  const cpfInput = document.getElementById('editUserCpf');
  const telefoneInput = document.getElementById('editUserTelefone');
  
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      aplicarMascaraCPF(e.target);
    });
    
    cpfInput.addEventListener('blur', function(e) {
      // Validar CPF ao sair do campo (opcional)
      const cpfDigits = removerMascara(e.target.value);
      if (cpfDigits.length === 11 && !validarCPF(cpfDigits)) {
        showUserNotification('CPF inválido! Verifique os dígitos.', 'error');
      }
    });
  }
  
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function(e) {
      aplicarMascaraTelefone(e.target);
    });
  }
  
  // Função opcional para validar CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    
    // Elimina CPFs conhecidos como inválidos
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validação dos dígitos verificadores
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }
  
  // Modal de confirmação
  const confirmModal = document.getElementById('confirmSaveModal');
  const closeConfirmBtn = document.querySelector('.close-confirm-save-modal');
  const cancelConfirmBtn = document.querySelector('#confirmSaveModal .modal-button-confirm.cancel');
  const confirmSaveBtn = document.querySelector('#confirmSaveModal .modal-button-confirm.confirm');
  
  if (closeConfirmBtn) {
    closeConfirmBtn.addEventListener('click', closeConfirmSaveModal);
  }
  
  if (cancelConfirmBtn) {
    cancelConfirmBtn.addEventListener('click', closeConfirmSaveModal);
  }
  
  if (confirmSaveBtn) {
    confirmSaveBtn.addEventListener('click', confirmEditUser);
  }
  
  if (confirmModal) {
    confirmModal.addEventListener('click', function(e) {
      if (e.target === confirmModal) {
        closeConfirmSaveModal();
      }
    });
  }
  
  // Fechar modais com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeDeleteModal();
      closeEditModal();
      closeConfirmSaveModal();
    }
  });
  
  // Toggle switches
  document.querySelectorAll('.switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      if (this.checked) {
        showUserNotification('Usuário ativado com sucesso!', 'success');
      } else {
        showUserNotification('Usuário desativado com sucesso!', 'success');
      }
      this.form.submit();
    });
  });
});

// ===================== MÁSCARAS PARA CPF E TELEFONE =====================
function aplicarMascaraCPF(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    input.value = value;
}

function aplicarMascaraTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    if (value.length === 11) {
        // Formato: (99) 99999-9999
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length === 10) {
        // Formato: (99) 9999-9999
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
        value = value.replace(/(\d{0,2})/, '($1');
    }
    
    input.value = value;
}

function removerMascara(campoComMascara) {
    return campoComMascara.replace(/\D/g, '');
}