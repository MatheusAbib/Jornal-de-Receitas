document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('recipeForm');
      const imageInput = document.getElementById('imagemFile');
      const imagePreview = document.getElementById('imagePreview');
      const fileText = document.getElementById('fileText');
      const ingredientesContainer = document.getElementById('ingredientesContainer');
      const modoPreparoContainer = document.getElementById('modoPreparoContainer');

      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
          if (!file.type.match('image.*')) {
            showError('imagemError', 'Formato de arquivo não suportado. Use JPG, PNG ou GIF.');
            this.value = '';
            return;
          }
          hideError('imagemError');
          const reader = new FileReader();
          reader.onload = function(e) {
            imagePreview.querySelector('img').src = e.target.result;
            imagePreview.classList.add('active');
            fileText.textContent = file.name;
          }
          reader.readAsDataURL(file);
        } else {
          imagePreview.classList.remove('active');
          fileText.textContent = 'Selecione uma imagem para sua receita';
        }
      });

      function formatarIngrediente(item) {
        const quantidade = item.querySelector('.quantidade-input').value;
        const unidade = item.querySelector('.unidade-select').value;
        const nome = item.querySelector('.ingrediente-nome-input').value;
        
        if (!quantidade || !unidade || !nome) return '';
        
        let quantidadeFormatada = quantidade;
        if (quantidade % 1 === 0) {
          quantidadeFormatada = Math.floor(quantidade);
        } else {
          quantidadeFormatada = quantidade.replace(/\./g, ',');
        }
        
        if (unidade === 'pitada') return `${quantidadeFormatada} pitada${quantidade != 1 ? 's' : ''} de ${nome}`;
        if (unidade === 'fio') return `1 fio de ${nome}`;
        if (unidade === 'unidade') return `${quantidadeFormatada} ${nome}`;
        if (quantidade == 1) return `${quantidadeFormatada} ${unidade} de ${nome}`;
        if (unidade === 'colher (chá)') return `${quantidadeFormatada} colheres (chá) de ${nome}`;
        if (unidade === 'colher (sopa)') return `${quantidadeFormatada} colheres (sopa) de ${nome}`;
        if (unidade === 'xicara') return `${quantidadeFormatada} xícaras (chá) de ${nome}`;
        if (unidade === 'copo') return `${quantidadeFormatada} copos (americano) de ${nome}`;
        
        return `${quantidadeFormatada} ${unidade} de ${nome}`;
      }

      function capitalizar(texto) {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
      }

      function limparPassoInput(input) {
        let valor = input.value.trim();
        valor = valor.replace(/^[\d\-\*\(\)\.]+\s*/, '');
        valor = valor.replace(/^(passo\s*\d+[\:\-\s]*)/i, '');
        input.value = valor.charAt(0).toUpperCase() + valor.slice(1);
      }

      function capitalizarIngrediente(input) {
        input.addEventListener('blur', function() {
          let valor = this.value.trim();
          if (valor) {
            this.value = capitalizar(valor);
          }
        });
      }

      function capitalizarPasso(input) {
        input.addEventListener('blur', function() {
          let valor = this.value.trim();
          if (valor) {
            limparPassoInput(input);
          }
        });
        
        input.addEventListener('input', function() {
          let valor = this.value;
          if (valor.match(/^[\d\-\*\(\)\.]+\s/) || valor.toLowerCase().match(/^passo\s*\d+[\:\-\s]/i)) {
            this.value = valor.replace(/^[\d\-\*\(\)\.]+\s*/, '').replace(/^passo\s*\d+[\:\-\s]*/i, '');
          }
        });
      }

      document.getElementById('addIngrediente').addEventListener('click', function() {
        const div = document.createElement('div');
        div.classList.add('ingrediente-item');
        div.innerHTML = `
          <div class="ingrediente-row">
            <input type="number" class="quantidade-input" placeholder="Quant." step="0.01" value="1">
            <select class="unidade-select">
              <option value="g">gramas (g)</option>
              <option value="kg">quilogramas (kg)</option>
              <option value="ml">mililitros (ml)</option>
              <option value="L">litros (L)</option>
              <option value="colher (chá)">colher (chá)</option>
              <option value="colher (sopa)">colher (sopa)</option>
              <option value="xicara">xícara (chá)</option>
              <option value="copo">copo (americano)</option>
              <option value="unidade">unidade(s)</option>
              <option value="pitada">pitada</option>
              <option value="fio">fio</option>
            </select>
            <input type="text" class="ingrediente-nome-input" placeholder="Nome do ingrediente" required>
            <div class="input-wrapper" style="width: auto;">
              <button type="button" class="remove-btn">×</button>
            </div>
          </div>
        `;
        ingredientesContainer.appendChild(div);
        
        const nomeInput = div.querySelector('.ingrediente-nome-input');
        capitalizarIngrediente(nomeInput);
        
        div.querySelector('.remove-btn').addEventListener('click', function() {
          div.remove();
        });
      });

      document.getElementById('addPasso').addEventListener('click', function() {
        const div = document.createElement('div');
        div.classList.add('passo-item');
        const passoNumero = modoPreparoContainer.querySelectorAll('.passo-item').length + 1;
        div.innerHTML = `
          <div class="input-wrapper">
            <input type="text" class="passo-input" name="modoPreparo[]" placeholder="Passo ${passoNumero}" required>
            <button type="button" class="remove-btn">×</button>
          </div>
        `;
        modoPreparoContainer.appendChild(div);
        
        const passoInput = div.querySelector('.passo-input');
        capitalizarPasso(passoInput);
        
        div.querySelector('.remove-btn').addEventListener('click', function() {
          div.remove();
          const passos = modoPreparoContainer.querySelectorAll('.passo-item');
          passos.forEach((passo, index) => {
            const input = passo.querySelector('.passo-input');
            input.placeholder = `Passo ${index + 1}`;
          });
        });
      });

      function capitalizeFirst(texto) {
        if (!texto) return "";
        return texto.charAt(0).toUpperCase() + texto.slice(1);
      }

      const tituloInput = document.getElementById('titulo');
      tituloInput.addEventListener('blur', function() {
        this.value = capitalizeFirst(this.value.trim());
      });

      const chefInput = document.getElementById('chefe');
      chefInput.addEventListener('blur', function() {
        this.value = capitalizeFirst(this.value.trim());
      });

      document.querySelectorAll('.ingrediente-nome-input').forEach(inp => capitalizarIngrediente(inp));
      document.querySelectorAll('.passo-input').forEach(inp => capitalizarPasso(inp));

      const tempoInput = document.getElementById('tempoPreparo');
      tempoInput.addEventListener('blur', function() {
        let valor = this.value.trim().toLowerCase();
        if (valor && !valor.includes('minuto') && !valor.includes('hora')) {
          let numero = valor.match(/\d+/);
          if (numero) {
            this.value = numero[0] + ' minutos';
          }
        } else if (valor) {
          this.value = capitalizeFirst(valor);
        }
      });

      form.addEventListener('submit', function(e) {
        let isValid = true;

        if (!form.querySelector('#titulo').value.trim()) {
          showError('tituloError');
          isValid = false;
        } else {
          hideError('tituloError');
        }

        if (!tempoInput.value.trim()) {
          showError('tempoError');
          isValid = false;
        } else {
          hideError('tempoError');
        }

        const porcoesInput = form.querySelector('#porcoes');
        if (!porcoesInput.value || porcoesInput.value < 1) {
          showError('porcoesError');
          isValid = false;
        } else {
          hideError('porcoesError');
        }

        const categoriaSelect = form.querySelector('#categoria');
        if (!categoriaSelect.value) {
          showError('categoriaError');
          isValid = false;
        } else {
          hideError('categoriaError');
        }

        if (!chefInput.value.trim()) {
          showError('chefeError');
          isValid = false;
        } else {
          hideError('chefeError');
        }

        const ingredientesItens = ingredientesContainer.querySelectorAll('.ingrediente-item');
        let temIngredientePreenchido = false;
        
        ingredientesItens.forEach(item => {
          const nomeInput = item.querySelector('.ingrediente-nome-input');
          const quantidadeInput = item.querySelector('.quantidade-input');
          if (nomeInput && nomeInput.value.trim() && quantidadeInput && quantidadeInput.value) {
            temIngredientePreenchido = true;
          }
        });

        if (!temIngredientePreenchido) {
          showError('ingredientesError');
          isValid = false;
        } else {
          hideError('ingredientesError');
        }

        const passosItens = modoPreparoContainer.querySelectorAll('.passo-item');
        let temPassoPreenchido = false;
        
        passosItens.forEach(item => {
          const input = item.querySelector('.passo-input');
          if (input && input.value.trim()) {
            temPassoPreenchido = true;
          }
        });

        if (!temPassoPreenchido) {
          showError('modoPreparoError');
          isValid = false;
        } else {
          hideError('modoPreparoError');
        }

        if (imageInput.files[0] && !imageInput.files[0].type.match('image.*')) {
          showError('imagemError');
          isValid = false;
        }

        if (!isValid) {
          e.preventDefault();
          const primeiroErro = form.querySelector('.error-message.show');
          if (primeiroErro) {
            primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          const ingredientesTexto = [];
          ingredientesItens.forEach(item => {
            const texto = formatarIngrediente(item);
            if (texto) ingredientesTexto.push(texto);
          });
          
          const ingredientesHidden = document.createElement('input');
          ingredientesHidden.type = 'hidden';
          ingredientesHidden.name = 'ingredientes';
          ingredientesHidden.value = ingredientesTexto.join('||');
          form.appendChild(ingredientesHidden);
          
          const passosTexto = [];
          passosItens.forEach((item, index) => {
            const input = item.querySelector('.passo-input');
            if (input && input.value.trim()) {
              passosTexto.push(`${index + 1}. ${input.value.trim()}`);
            }
          });
          
          const passosHidden = document.createElement('input');
          passosHidden.type = 'hidden';
          passosHidden.name = 'modoPreparoTexto';
          passosHidden.value = passosTexto.join('||');
          form.appendChild(passosHidden);
          
          const ingredientesInputs = ingredientesContainer.querySelectorAll('.ingrediente-nome-input');
          ingredientesInputs.forEach(input => input.disabled = true);
          
          const quantidadesInputs = ingredientesContainer.querySelectorAll('.quantidade-input');
          quantidadesInputs.forEach(input => input.disabled = true);
          
          const unidadesSelects = ingredientesContainer.querySelectorAll('.unidade-select');
          unidadesSelects.forEach(select => select.disabled = true);
        }
      });

      function showError(id, msg = 'Campo obrigatório') {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = msg;
          el.classList.add('show');
        }
      }
      
      function hideError(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('show');
      }
    });

    document.addEventListener("DOMContentLoaded", () => {
      const notification = document.getElementById("notification");
      if (notification) {
        setTimeout(() => notification.classList.add("show"), 300);
        setTimeout(() => notification.classList.remove("show"), 4300);
      }
    });