    
    
    // Variáveis para o modal de exclusão
    let currentDeleteId = null;
    
    // Abrir modal de exclusão
    function openDeleteModal(button) {
      const userId = button.getAttribute('data-id');
      const userName = button.getAttribute('data-nome');
      const userEmail = button.getAttribute('data-email');
      
      // Preencher informações no modal
      document.getElementById('modal-user-id').textContent = userId;
      document.getElementById('modal-user-nome').textContent = userName;
      document.getElementById('modal-user-email').textContent = userEmail;
      
      // Configurar o formulário de exclusão
      document.getElementById('deleteForm').action = `/usuarios/excluir/${userId}`;
      
      // Exibir o modal
      document.getElementById('deleteModal').style.display = 'block';
    }
    
    // Fechar modal de exclusão
    function closeDeleteModal() {
      document.getElementById('deleteModal').style.display = 'none';
    }
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(event) {
      const modal = document.getElementById('deleteModal');
      if (event.target === modal) {
        closeDeleteModal();
      }
    });
    
    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeDeleteModal();
      }
    });

function openEditModal(button) {
    document.getElementById('edit-id').value = button.getAttribute('data-id');
    document.getElementById('edit-nome').value = button.getAttribute('data-nome');
    document.getElementById('edit-email').value = button.getAttribute('data-email');
    document.getElementById('edit-cpf').value = button.getAttribute('data-cpf');
    document.getElementById('edit-telefone').value = button.getAttribute('data-telefone');
    document.getElementById('edit-genero').value = button.getAttribute('data-genero');

    // Limpar os campos de senha
    document.getElementById('edit-senha').value = '';
    document.getElementById('edit-confirmar-senha').value = '';

    document.getElementById('editForm').action = `/usuarios/editar/${button.getAttribute('data-id')}`;
    document.getElementById('editModal').style.display = 'block';
}


function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Fechar modal ao clicar fora dele
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});

document.getElementById('editForm').addEventListener('submit', function(event) {
    const senha = document.getElementById('edit-senha').value;
    const confirmar = document.getElementById('edit-confirmar-senha').value;
    
    if(senha !== confirmar) {
        event.preventDefault();
        alert('Nova senha e confirmação não coincidem!');
    }
});

function applyEditFormStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
    /* Variáveis e reset */
    :root {
        --main-bg-color: #f8f5f0;
        --header-color: #a52a2a;
        --accent-color: #d4af37;
        --secondary-accent: #c19b76;
        --rejected-color: #e74c3c;
        --text-color: #333;
        --light-text: #777;
        --border-color: #8b4513;
        --card-bg: #fefdf9;
        --input-bg: #fff;
        --shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        --transition: all 0.3s ease;
    }

  #editForm {
        padding: 20px 0;
        border-radius: 15px;
        max-width: 650px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    /* Form rows */
    #editForm .form-row {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }

    #editForm .form-row .form-group {
        flex: 1;
        min-width: 200px;
        display: flex;
        flex-direction: column;
    }

    #editForm .form-group label {
        font-weight: 600;
        color: var(--header-color);
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    #editForm .form-group input,
    #editForm .form-group select {
        width: 100%;
        padding: 12px 18px;
        border: 2px solid #e8e1d3;
        border-radius: 10px;
        font-size: 1rem;
        background: var(--input-bg);
        color: var(--text-color);
        transition: var(--transition);
    }

    #editForm .form-group input:focus,
    #editForm .form-group select:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
    }

    #editForm .form-group input::placeholder {
        color: var(--light-text);
    }

    /* Modal footer buttons */
    #editForm .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 15px;
        margin-top: 15px;
    }

    #editForm .modal-btn {
        padding: 12px 20px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: var(--transition);
    }

    #editForm .modal-btn-cancel {
        background: #ccc;
        color: #333;
    }

    #editForm .modal-btn-cancel:hover {
        background: #aaa;
    }

    #editForm .modal-btn-confirm {
        background: var(--header-color);
        color: white;
    }

    #editForm .modal-btn-confirm:hover {
        background: #8b0000;
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(165, 42, 42, 0.3);
    }

.notification {
    position: fixed;
    top: 20px; /* Mais próximo do topo */
    right: 20px;
    background: var(--accent-color);
    color: var(--header-color);
    padding: 15px 25px;
    border-radius: 12px;
    box-shadow: var(--shadow);
    font-weight: 600;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transform: translateY(-50px);
    transition: all 0.5s ease;
    z-index: 9999;
}


    .notification.show {
        opacity: 1;
        transform: translateY(0);
    }

    .notification.hide {
        opacity: 0;
        transform: translateY(-50px);
    }

    .notification i {
        font-size: 1.2rem;
    }

    /* Responsividade */
    @media (max-width: 768px) {
        #editForm {
            padding: 20px 20px;
        }

        #editForm .form-row {
            flex-direction: column;
        }
    }
    `;
    document.head.appendChild(style);
}

// Chamar o CSS assim que a página carregar
window.addEventListener('DOMContentLoaded', applyEditFormStyles);

// Intercepta o submit do form de edição
document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault(); // impede o envio imediato
    const senha = document.getElementById('edit-senha').value;
    const confirmar = document.getElementById('edit-confirmar-senha').value;

    if(senha !== confirmar) {
        alert('Nova senha e confirmação não coincidem!');
        return;
    }

    // Abrir modal de confirmação
    document.getElementById('confirmSaveModal').style.display = 'block';
});

function closeConfirmSaveModal() {
    document.getElementById('confirmSaveModal').style.display = 'none';
}

// Função que realmente envia o form
function submitEditForm() {
    closeConfirmSaveModal();
    document.getElementById('editForm').submit();
}

// Fechar modal clicando fora
window.addEventListener('click', function(event) {
    const modal = document.getElementById('confirmSaveModal');
    if(event.target === modal) {
        closeConfirmSaveModal();
    }
});