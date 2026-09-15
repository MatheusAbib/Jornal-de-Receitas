let currentDeleteUser = null;
let currentEditUser = null;
let searchTimeout = null;

function showUserNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `user-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    ${message}
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function filterUsers() {
  const input = document.getElementById('userSearch');
  const filter = input.value.toLowerCase();
  const rows = document.querySelectorAll('.user-row');
  const emptyState = document.getElementById('usersEmpty');
  const loader = document.getElementById('searchLoader');
  const countSpan = document.querySelector('.count span');
  const totalUsuarios = document.getElementById('totalUsuarios');
  const totalItemsSpan = document.querySelector('.admin-table-footer .info span:first-child');
  
  if (!loader) {
    const searchWrapper = document.querySelector('.admin-search-box');
    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'searchLoader';
    loaderDiv.style.cssText = `
      display: none;
      text-align: center;
      padding: 5px 10px;
      color: #d4af37;
      font-size: 0.85rem;
      background: white;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      position: absolute;
      right: 0;
      top: calc(100% + 5px);
      min-width: 150px;
      align-items: center;
      justify-content: center;
      gap: 8px;
    `;
    loaderDiv.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-top: -6px;"></i> Buscando...';
    searchWrapper.style.position = 'relative';
    searchWrapper.appendChild(loaderDiv);
  }
  
  const loaderEl = document.getElementById('searchLoader');
  
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  if (filter.length > 0) {
    loaderEl.style.display = 'flex';
  } else {
    loaderEl.style.display = 'none';
  }
  
  searchTimeout = setTimeout(() => {
    let visibleCount = 0;
    
    rows.forEach(row => {
      const nome = row.querySelector('[data-label="Nome"]')?.textContent?.toLowerCase() || '';
      const email = row.querySelector('[data-label="Email"]')?.textContent?.toLowerCase() || '';
      const cpf = row.querySelector('[data-label="CPF"]')?.textContent?.toLowerCase() || '';
      
      if (nome.includes(filter) || email.includes(filter) || cpf.includes(filter)) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
    
    if (countSpan) {
      countSpan.textContent = visibleCount;
    }
    
    if (totalUsuarios) {
      totalUsuarios.textContent = visibleCount;
    }
    
    if (totalItemsSpan) {
      const totalOriginal = totalItemsSpan.getAttribute('data-total') || totalItemsSpan.textContent;
      if (!totalItemsSpan.hasAttribute('data-total')) {
        totalItemsSpan.setAttribute('data-total', totalItemsSpan.textContent);
      }
      if (filter.length > 0) {
        totalItemsSpan.textContent = visibleCount;
      } else {
        totalItemsSpan.textContent = totalItemsSpan.getAttribute('data-total');
      }
    }
    
    if (emptyState) {
      if (filter.length > 0 && visibleCount === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
      }
    }
    
    loaderEl.style.display = 'none';
  }, 500);
}
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
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';
    deleteBtn.disabled = true;
    
    const response = await fetch(`/usuarios/excluir/${currentDeleteUser.id}`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (response.ok) {
      showUserNotification('Usuário excluído com sucesso!', 'success');
      
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

function openEditModal(button) {
  currentEditUser = {
    id: button.getAttribute('data-id'),
    nome: button.getAttribute('data-nome'),
    email: button.getAttribute('data-email'),
    cpf: button.getAttribute('data-cpf'),  
    telefone: button.getAttribute('data-telefone') || '',
    genero: button.getAttribute('data-genero') || '',
    role: button.getAttribute('data-role') || 'USER'
  };
  
  document.getElementById('editUserId').value = currentEditUser.id;
  document.getElementById('editUserNome').value = currentEditUser.nome;
  document.getElementById('editUserEmail').value = currentEditUser.email;
  
  let cpfValue = currentEditUser.cpf || '';
  if (cpfValue) {
    cpfValue = cpfValue.replace(/\D/g, '');
    
    if (cpfValue.length === 11) {
      cpfValue = cpfValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
  }
  document.getElementById('editUserCpf').value = cpfValue;
  
  let telefoneValue = currentEditUser.telefone || '';
  if (telefoneValue) {
    const digits = telefoneValue.replace(/\D/g, '');
    
    if (digits.length === 11) {
      telefoneValue = digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (digits.length === 10) {
      telefoneValue = digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (digits.length > 0) {
      telefoneValue = digits;
    }
  }
  document.getElementById('editUserTelefone').value = telefoneValue;
  
  document.getElementById('editUserGenero').value = currentEditUser.genero;
  document.getElementById('editUserRole').value = currentEditUser.role;
  
  document.getElementById('editUserSenha').value = '';
  document.getElementById('editUserConfirmarSenha').value = '';
  
  document.getElementById('editUserForm').action = `/usuarios/editar/${currentEditUser.id}`;
  
  document.getElementById('editUserModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeEditModal() {
  document.getElementById('editUserModal').style.display = 'none';
  document.body.style.overflow = 'auto';
  currentEditUser = null;
}

function openConfirmSaveModal() {
  document.getElementById('confirmSaveModal').style.display = 'block';
}

function closeConfirmSaveModal() {
  document.getElementById('confirmSaveModal').style.display = 'none';
}

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

document.addEventListener('DOMContentLoaded', function() {
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

  const cpfInput = document.getElementById('editUserCpf');
  const telefoneInput = document.getElementById('editUserTelefone');
  
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      aplicarMascaraCPF(e.target);
    });
    
    cpfInput.addEventListener('blur', function(e) {
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
  
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
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
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeDeleteModal();
      closeEditModal();
      closeConfirmSaveModal();
    }
  });
  
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

  const searchInput = document.getElementById('userSearch');
  if (searchInput) {
    searchInput.addEventListener('keyup', filterUsers);
  }
});

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
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length === 10) {
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