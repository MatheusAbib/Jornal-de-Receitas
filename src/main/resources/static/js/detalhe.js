  document.addEventListener('DOMContentLoaded', function() {
      const checkboxes = document.querySelectorAll('.ingredient-checkbox');
      
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const label = this.nextElementSibling;
          if (this.checked) {
            label.style.color = 'var(--light-text)';
            label.style.textDecoration = 'line-through';
          } else {
            label.style.color = '';
            label.style.textDecoration = '';
          }
        });
      });
      
      const sectionTitle = document.querySelector('.section-title');
      if (sectionTitle && sectionTitle.textContent.includes('Ingredientes')) {
        sectionTitle.style.cursor = 'pointer';
        sectionTitle.title = 'Clique para marcar/desmarcar todos os ingredientes';
        sectionTitle.addEventListener('click', function() {
          const allChecked = Array.from(checkboxes).every(cb => cb.checked);
          checkboxes.forEach(cb => {
            cb.checked = !allChecked;
            cb.dispatchEvent(new Event('change'));
          });
        });
      }
    });