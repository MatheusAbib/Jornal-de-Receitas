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

// Responsividade para página de Gerenciamento de Usuários
function applyResponsiveStylesUsuarios() {
    // Verifica se já existe o estilo de responsividade
    if (document.getElementById('responsive-styles-usuarios')) return;
    
    const style = document.createElement('style');
    style.id = 'responsive-styles-usuarios';
    style.innerHTML = `
        /* RESPONSIVIDADE PARA PÁGINA DE USUÁRIOS */
        
        /* Dispositivos muito pequenos (celulares, até 480px) */
        @media (max-width: 480px) {
            .header-container {
                padding: 10px 15px !important;
            }
            
            .page-header h1 {
                font-size: 1.6rem !important;
                padding: 0 15px !important;
            }
            
            .page-header h1::before,
            .page-header h1::after {
                font-size: 1.1rem !important;
            }
            
            .page-header h1::before {
                left: -10px !important;
            }
            
            .page-header h1::after {
                right: -10px !important;
            }
            
            .page-subtitle {
                font-size: 0.85rem !important;
                padding: 0 10px !important;
            }
            
            .header-top {
                flex-direction: column !important;
                gap: 15px !important;
                text-align: center !important;
            }
            
            .back-link-container {
              padding: 0 15px 15px 15px !important;
              max-width: 100% !important;
            }
            
            .back-link {
              font-size: 0.9rem !important;
              padding: 8px 12px !important;
            }
            
            
            .users-container {
                padding: 15px !important;
                margin: 15px !important;
                border-radius: 8px !important;
            }
            
            .users-title {
                font-size: 1.4rem !important;
                margin-bottom: 15px !important;
                padding-bottom: 10px !important;
            }
            
            .users-title::after {
                width: 60px !important;
            }
            
            .users-table {
                font-size: 0.8rem !important;
            }
            
            .users-table th,
            .users-table td {
                padding: 8px 6px !important;
                font-size: 0.75rem !important;
            }
            
            .users-table th:nth-child(1), /* ID */
            .users-table th:nth-child(5), /* Data Cadastro */
            .users-table td:nth-child(1),
            .users-table td:nth-child(5) {
                display: none !important;
            }
            
            .users-table th:nth-child(4), /* CPF */
            .users-table td:nth-child(4) {
                display: none !important;
            }
            
            .action-btn {
                padding: 6px 8px !important;
                font-size: 0.75rem !important;
                min-width: 30px !important;
                min-height: 30px !important;
                justify-content: center !important;
            }
            
            .action-btn i {
                font-size: 0.8rem !important;
            }
            
            .switch {
                width: 40px !important;
                height: 20px !important;
            }
            
            .slider:before {
                height: 14px !important;
                width: 14px !important;
                left: 3px !important;
                bottom: 3px !important;
            }
            
            input:checked + .slider:before {
                transform: translateX(20px) !important;
            }
            
            .status-active,
            .status-inactive {
                font-size: 0.75rem !important;
            }
            
            /* Modais em mobile */
            .delete-user-modal .modal-content-delete,
            .edit-user-modal .modal-content-edit,
            .confirm-save-modal .modal-content-confirm {
                width: 95% !important;
                max-width: 95% !important;
                margin: 5% auto !important;
            }
            
            .delete-user-modal .modal-header-delete,
            .edit-user-modal .modal-header-edit {
                padding: 15px 20px !important;
            }
            
            .delete-user-modal .modal-header-delete h2,
            .edit-user-modal .modal-header-edit h2 {
                font-size: 1.4rem !important;
            }
            
            .delete-user-modal .modal-icon-delete {
                font-size: 2.5rem !important;
                margin: 15px 0 !important;
            }
            
            .delete-user-modal .modal-message,
            .delete-user-modal .user-info-card,
            .delete-user-modal .modal-warning {
                margin: 15px 20px !important;
                font-size: 0.9rem !important;
            }
            
            .edit-user-modal .modal-body-edit {
                padding: 20px !important;
            }
            
            .edit-user-modal .form-grid {
                grid-template-columns: 1fr !important;
                gap: 15px !important;
            }
            
            .edit-user-modal .form-control-edit {
                padding: 12px 15px 12px 40px !important;
                font-size: 0.9rem !important;
            }
            
            .edit-user-modal .modal-actions-edit {
                flex-direction: column !important;
                gap: 10px !important;
                margin-top: 20px !important;
            }
            
            .edit-user-modal .modal-button-edit {
                width: 100% !important;
                padding: 10px 20px !important;
            }
            
            .user-notification {
                bottom: 10px !important;
                right: 10px !important;
                left: 10px !important;
                text-align: center !important;
                padding: 10px 15px !important;
                font-size: 0.9rem !important;
            }
            
            /* Botão de fechar modais */
            .close-delete-user-modal,
            .close-edit-user-modal,
            .close-confirm-save-modal {
                top: 15px !important;
                right: 15px !important;
                font-size: 1.4rem !important;
                width: 30px !important;
                height: 30px !important;
            }
        }
        
        /* Dispositivos pequenos (celulares, 481px a 768px) */
        @media (min-width: 481px) and (max-width: 768px) {
            .page-header h1 {
                font-size: 2rem !important;
            }
            
            .page-subtitle {
                font-size: 1rem !important;
            }
            
            .users-container {
                padding: 20px !important;
                margin: 20px !important;
            }
            
            .users-title {
                font-size: 1.6rem !important;
            }
            
            .users-table {
                font-size: 0.85rem !important;
            }
            
            .users-table th,
            .users-table td {
                padding: 10px 8px !important;
            }
            
            .users-table th:nth-child(5), /* Data Cadastro */
            .users-table td:nth-child(5) {
                display: none !important;
            }
            
            .action-btn {
                padding: 6px 10px !important;
                font-size: 0.8rem !important;
            }
            
            .edit-user-modal .modal-content-edit {
                max-width: 500px !important;
            }
            
            .edit-user-modal .form-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }

          .back-link-container {
              padding: 0 20px 15px 20px !important;
              max-width: calc(100% - 40px) !important;
            }
        }
        
        /* Dispositivos médios (tablets, 769px a 1024px) */
        @media (min-width: 769px) and (max-width: 1024px) {
            .users-container {
                padding: 15px !important;
                margin: 25px 0 !important;
            }
            
            .users-table {
                font-size: 0.9rem !important;
            }
            
            .users-table th,
            .users-table td {
                padding: 12px 10px !important;
            }
            
            .edit-user-modal .form-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }

          .back-link-container {
              max-width: 1000px !important;
              padding: 0 20px 0px 0px !important;
            }
        }
        
        /* Ajustes gerais para todos os dispositivos móveis */
        @media (max-width: 768px) {
            .users-table {
                display: block !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
                -webkit-overflow-scrolling: touch !important;
            }
            
            .users-table thead,
            .users-table tbody,
            .users-table tr,
            .users-table th,
            .users-table td {
                display: block !important;
            }
            
            .users-table thead {
                display: none !important;
            }
            
            .users-table tr {
                margin-bottom: 15px !important;
                border: 1px solid #ddd !important;
                border-radius: 8px !important;
                overflow: hidden !important;
                background: white !important;
            }
            
            .users-table td {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 12px 15px !important;
                border-bottom: 1px solid #eee !important;
                text-align: right !important;
            }
            
            .users-table td:before {
                content: attr(data-label) !important;
                font-weight: 600 !important;
                color: var(--header-color) !important;
                margin-right: 10px !important;
                text-align: left !important;
            }
            
            .users-table td:last-child {
                border-bottom: none !important;
            }
            
            .modal {
                padding: 10px !important;
            }
            
            .modal-actions-delete,
            .modal-actions-confirm {
                flex-direction: column !important;
                gap: 10px !important;
            }
            
            .modal-button-delete,
            .modal-button-confirm {
                width: 100% !important;
            }
            
            .user-notification {
                max-width: calc(100% - 20px) !important;
            }
        }
        
        /* Ajustes para orientação paisagem em dispositivos móveis */
        @media (max-width: 768px) and (orientation: landscape) {
            .page-header h1 {
                font-size: 1.8rem !important;
            }
            
            .users-container {
                max-height: 70vh !important;
                overflow-y: auto !important;
            }
            
            .users-table td:before {
                min-width: 100px !important;
            }
            
            .modal-content-delete,
            .modal-content-edit,
            .modal-content-confirm {
                max-height: 90vh !important;
                overflow-y: auto !important;
            }
            
            .edit-user-modal .form-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }

        @media (min-width: 1025px) and (max-width: 1200px) {
          .back-link-container {
              max-width: 1200px !important;
              padding: 0 20px 0px 0px !important;
            }

            
            .users-container{
        margin: 20px 13px !important;
                    }
            }
        
        /* Tabela responsiva para telas médias */
        @media (max-width: 1024px) {
            .users-table {
                min-width: 100% !important;
            }
            
            .users-table td:nth-child(6), /* Status */
            .users-table td:nth-child(7) { /* Ações */
                min-width: auto !important;
            }
        }

        @media (min-width: 1201px) {
          .back-link-container {
            max-width: 1400px !important;
            padding: 0 20px 0px 0px !important;
          }
        }
        
        /* Ajustes para telas muito grandes */
        @media (min-width: 1400px) {
            body {
                max-width: 1400px !important;
                margin: 0 auto !important;
            }
            
            .header-full-width {
                width: 100vw !important;
            }
            
            .header-container {
                max-width: 1400px !important;
            }
            
            .users-container {
                max-width: 1300px !important;
                margin: 20px auto !important;
            }
        }
        
        /* Ajustes para impressão */
        @media print {
            .header-full-width,
            .back-link,
            .switch,
            .action-btn,
            .modal,
            .user-notification {
                display: none !important;
            }
            
            body {
                background: white !important;
                color: black !important;
                font-size: 12pt !important;
            }
            
            .users-container {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
                padding: 20px !important;
                margin: 20px 0 !important;
            }
            
            .users-title {
                color: black !important;
                font-size: 16pt !important;
            }
            
            .users-title::after {
                background: black !important;
            }
            
            .users-table {
                border: 1px solid #999 !important;
                font-size: 10pt !important;
            }
            
            .users-table th {
                background: #f0f0f0 !important;
                color: black !important;
                border-bottom: 2px solid #999 !important;
            }
            
            .users-table td {
                border-bottom: 1px solid #ddd !important;
            }
            
            .users-table tr:nth-child(even) {
                background-color: #f9f9f9 !important;
            }
            
            .status-active {
                color: black !important;
            }
            
            .status-inactive {
                color: #666 !important;
            }
        }
        
        /* Melhorias de acessibilidade para toque */
        @media (hover: none) and (pointer: coarse) {
            .action-btn,
            .switch,
            .modal-button-delete,
            .modal-button-edit,
            .modal-button-confirm,
            .back-link {
                min-height: 44px !important;
                min-width: 44px !important;
            }
            
            .users-table td {
                padding: 15px !important;
            }
            
            .form-control-edit {
                min-height: 44px !important;
                font-size: 16px !important; /* Evita zoom no iOS */
            }
            
            /* Aumentar área de toque para labels */
            .form-group-edit label {
                padding: 5px 0 !important;
                margin-bottom: 10px !important;
            }
        }
        
        /* Suporte para modo escuro */
        @media (prefers-color-scheme: dark) {
            @media (max-width: 768px) {
                .users-container {
                    background: #2c2c2c !important;
                    color: #f0f0f0 !important;
                }
                
                .users-title {
                    color: #e67e22 !important;
                }
                
                .users-table tr {
                    background: #3c3c3c !important;
                    border-color: #555 !important;
                }
                
                .users-table td {
                    border-color: #555 !important;
                    color: #f0f0f0 !important;
                }
                
                .users-table td:before {
                    color: #e67e22 !important;
                }
                
                .status-active {
                    color: #2ecc71 !important;
                }
                
                .status-inactive {
                    color: #e74c3c !important;
                }
                
                .modal-content-delete,
                .modal-content-edit,
                .modal-content-confirm {
                    background: #2c2c2c !important;
                    color: #f0f0f0 !important;
                }
                
                .form-control-edit {
                    background: #3c3c3c !important;
                    color: #f0f0f0 !important;
                    border-color: #555 !important;
                }
                
                .user-info-card {
                    background: #3c3c3c !important;
                }
            }
        }
        
        /* Ajustes para navegadores específicos */
        @supports (-webkit-overflow-scrolling: touch) {
            /* Safari iOS */
            .users-container {
                -webkit-overflow-scrolling: touch !important;
            }
        }
        
        /* Corrigir altura segura para dispositivos com notch */
        @supports (padding: max(0px)) {
            body {
                padding-left: max(15px, env(safe-area-inset-left)) !important;
                padding-right: max(15px, env(safe-area-inset-right)) !important;
                padding-top: max(0px, env(safe-area-inset-top)) !important;
                padding-bottom: max(0px, env(safe-area-inset-bottom)) !important;
            }
            
            .modal {
                padding: max(10px, env(safe-area-inset-top)) 
                         max(10px, env(safe-area-inset-right))
                         max(10px, env(safe-area-inset-bottom))
                         max(10px, env(safe-area-inset-left)) !important;
            }
        }
        
        /* Estilo para tabela em cards (mobile) */
        @media (max-width: 768px) {
            .users-table td[data-label="ID"] { display: none; }
            .users-table td[data-label="Nome"]:before { content: "Nome:"; }
            .users-table td[data-label="Email"]:before { content: "Email:"; }
            .users-table td[data-label="CPF"]:before { content: "CPF:"; }
            .users-table td[data-label="Data Cadastro"]:before { content: "Cadastro:"; }
            .users-table td[data-label="Status"]:before { content: "Status:"; }
            .users-table td[data-label="Ações"]:before { content: "Ações:"; }
        }
    `;
    
    document.head.appendChild(style);
}

// Função para ajustar dinamicamente a tabela de usuários
function adjustTableLayoutForScreenSize() {
    const width = window.innerWidth;
    
    // Ajustar display da tabela para mobile
    const table = document.querySelector('.users-table');
    const tbody = table?.querySelector('tbody');
    
    if (width <= 768 && tbody) {
        // Converter tabela para cards em mobile
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                const header = table.querySelector(`th:nth-child(${index + 1})`);
                if (header) {
                    cell.setAttribute('data-label', header.textContent);
                }
            });
        });
    }
    
    // Ajustar padding do container
    const container = document.querySelector('.users-container');
    if (container) {
        if (width <= 480) {
            container.style.padding = '15px';
            container.style.margin = '15px';
        } else if (width <= 768) {
            container.style.padding = '20px';
            container.style.margin = '20px';
        } else {
            container.style.padding = '30px';
            container.style.margin = '40px 0';
        }
    }
  
    
    // Otimizar para touch
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        const touchElements = document.querySelectorAll('.action-btn, .switch, .back-link');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        });
        
        // Ajustar inputs nos modais
        const formInputs = document.querySelectorAll('.form-control-edit');
        formInputs.forEach(input => {
            input.style.minHeight = '44px';
            if (width <= 768) {
                input.style.fontSize = '16px';
            }
        });
    }
}

// Inicializar a responsividade quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    applyResponsiveStylesUsuarios();
    adjustTableLayoutForScreenSize();
    
    // Adicionar labels de dados para tabela mobile
    setupMobileTable();
    
    // Reajustar quando a janela for redimensionada
    window.addEventListener('resize', function() {
        adjustTableLayoutForScreenSize();
        setupMobileTable();
    });
    
    // Reaplicar estilos se necessário
    window.addEventListener('load', applyResponsiveStylesUsuarios);
});

// Configurar tabela para mobile (cards)
function setupMobileTable() {
    const width = window.innerWidth;
    const table = document.querySelector('.users-table');
    
    if (width <= 768 && table) {
        // Garantir que a tabela esteja em modo card
        table.style.display = 'block';
        table.style.overflowX = 'auto';
        table.style.webkitOverflowScrolling = 'touch';
        
        // Esconder cabeçalho em mobile
        const thead = table.querySelector('thead');
        if (thead) {
            thead.style.display = 'none';
        }
        
        // Adicionar classes para estilo de card
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = 'block';
            row.style.marginBottom = '15px';
            row.style.border = '1px solid #ddd';
            row.style.borderRadius = '8px';
            row.style.overflow = 'hidden';
            row.style.background = 'white';
            
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                cell.style.display = 'flex';
                cell.style.justifyContent = 'space-between';
                cell.style.alignItems = 'center';
                cell.style.padding = '12px 15px';
                cell.style.borderBottom = '1px solid #eee';
                cell.style.textAlign = 'right';
                
                // Remover borda do último item
                if (index === cells.length - 1) {
                    cell.style.borderBottom = 'none';
                }
            });
        });
    } else {
        // Restaurar estilo normal da tabela
        if (table) {
            table.style.display = 'table';
            const thead = table.querySelector('thead');
            if (thead) {
                thead.style.display = 'table-header-group';
            }
            
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                row.style.display = 'table-row';
                row.style.marginBottom = '';
                row.style.border = '';
                row.style.borderRadius = '';
                row.style.overflow = '';
                row.style.background = '';
                
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.display = 'table-cell';
                    cell.style.justifyContent = '';
                    cell.style.alignItems = '';
                    cell.style.padding = '';
                    cell.style.borderBottom = '';
                    cell.style.textAlign = '';
                });
            });
        }
    }
}

// Detectar dispositivo e otimizar
function optimizeUsuariosForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-usuarios-view');
        
        // Otimizar modais para mobile
        const modals = document.querySelectorAll('.modal-content-delete, .modal-content-edit, .modal-content-confirm');
        modals.forEach(modal => {
            modal.classList.add('mobile-optimized-modal');
        });
        
        // Prevenir zoom em inputs no iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.style.fontSize = '16px';
                });
                
                input.addEventListener('blur', function() {
                    this.style.fontSize = '';
                });
            });
        }
    } else {
        document.body.classList.add('desktop-usuarios-view');
    }
}

// Executar otimizações
optimizeUsuariosForMobile();

// Adicionar listener para mudanças de orientação
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        adjustTableLayoutForScreenSize();
        setupMobileTable();
        optimizeUsuariosForMobile();
    }, 100);
});

// Função para melhorar a experiência em dispositivos móveis
function enhanceMobileUsuariosExperience() {
    const width = window.innerWidth;
    
    if (width <= 768) {
        // Adicionar scroll suave para tabela
        const container = document.querySelector('.users-container');
        if (container) {
            container.style.overflowX = 'auto';
            container.style.webkitOverflowScrolling = 'touch';
        }
        
        // Ajustar botões de ação
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.style.margin = '2px';
        });
        
        // Simplificar animações para melhor performance
        const modals = document.querySelectorAll('.modal-content-delete, .modal-content-edit, .modal-content-confirm');
        modals.forEach(modal => {
            modal.style.transition = 'transform 0.2s ease';
        });
    }
}

// Executar otimizações
enhanceMobileUsuariosExperience();

// Função para criar notificação responsiva
function createResponsiveNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `user-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Ajustar posição para mobile
    const width = window.innerWidth;
    if (width <= 480) {
        notification.style.left = '10px';
        notification.style.right = '10px';
        notification.style.bottom = '10px';
        notification.style.textAlign = 'center';
    }
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

    const titleElement = document.querySelector('.page-header h1');
    if (titleElement) {
      const originalTitle = titleElement.textContent;
      titleElement.textContent = '';
      let charIndex = 0;
      
      function typeTitle() {
        if (charIndex < originalTitle.length) {
          titleElement.textContent += originalTitle.charAt(charIndex);
          charIndex++;
          setTimeout(typeTitle, 100);
        }
      }
      
      setTimeout(typeTitle, 10);
    }