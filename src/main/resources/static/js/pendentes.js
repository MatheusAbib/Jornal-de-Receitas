  function confirmAction(action, button) {
      event.preventDefault();
      const form = button.closest('form');
      const formAction = form.getAttribute('action');
      
      if (action === 'approve') {
        document.getElementById('approveForm').setAttribute('action', formAction);
        openModal('approveModal');
      } else if (action === 'reject') {
        document.getElementById('rejectForm').setAttribute('action', formAction);
        openModal('rejectModal');
      }
      
      return false;
    }
    
    // Abrir modal
    function openModal(modalId) {
      document.getElementById(modalId).classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    
    // Fechar modal
    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
      document.body.style.overflow = 'auto';
    }
    
    // Fechar modal ao clicar fora dele
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });
    });
    
    // Adicionar animações de entrada para os cards
    document.addEventListener('DOMContentLoaded', function() {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card, index) => {
        card.style.animationDelay = `${0.1 + (index * 0.1)}s`;
      });
    });
    
    // Função para toggle da sidebar
    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('show');
    }
    
    // Fechar sidebar ao clicar fora dela
    document.addEventListener('click', function(event) {
      const sidebar = document.getElementById('sidebar');
      const menuIcon = document.querySelector('.menu-icon');
      
      if (!sidebar.contains(event.target) && !menuIcon.contains(event.target) && sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
      }
    });