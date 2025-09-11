
    
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