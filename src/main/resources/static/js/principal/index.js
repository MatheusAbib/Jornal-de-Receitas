let filterTimeout = null;
let lastFilterValues = {};

async function initializeFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.card-favorite-btn');
    const favorites = await loadFavoritesFromServer();

    favoriteButtons.forEach(button => {
        const recipeId = button.getAttribute('data-recipe-id');

        const isFav = favorites.some(favId => Number(favId) === Number(recipeId));

        const icon = button.querySelector('i');
        if (isFav) {
            button.classList.add('active');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        } else {
            button.classList.remove('active');
            if (icon) {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        }

        if (!button.dataset.hasListener) {
            button.dataset.hasListener = "true";

            button.addEventListener('click', async function (e) {
                e.preventDefault();
                e.stopPropagation();

                const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
                const isLoggedIn = nomeUsuarioElement && nomeUsuarioElement.textContent.trim();

                if (!isLoggedIn) {
                    showNotification('Faça login para favoritar receitas!', false);
                    return;
                }

                if (this.disabled) return;

                const currentIcon = this.querySelector('i');
                const estavaFavorito = this.classList.contains('active');

                this.disabled = true;

                if (currentIcon) {
                    currentIcon.className = 'fas fa-spinner fa-spin';
                }

                try {
                    const success = estavaFavorito
                        ? await removeFavorite(recipeId)
                        : await addFavorite(recipeId);

                    if (success) {
                        if (estavaFavorito) {
                            this.classList.remove('active');

                            if (currentIcon) {
                                currentIcon.className = 'far fa-heart';
                            }

                            showNotification('Receita removida dos favoritos!', true);
                        } else {
                            this.classList.add('active');

                            if (currentIcon) {
                                currentIcon.className = 'fas fa-heart';
                            }

                            showNotification('Receita adicionada aos favoritos!', true);
                        }

                        await updateFavoriteCount();

                        const favTab = document.getElementById('favoritas');

                        if (favTab && favTab.classList.contains('active')) {
                            await loadFavoriteRecipes();
                        }
                    } else {
                        if (currentIcon) {
                            currentIcon.className = estavaFavorito
                                ? 'fas fa-heart'
                                : 'far fa-heart';
                        }
                    }
                } finally {
                    this.disabled = false;
                }
            });
        }
    });

    updateFavoriteCount();
}

async function loadFavoritesFromServer() {
    const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');

    if (!nomeUsuarioElement || !nomeUsuarioElement.textContent.trim()) {
        return [];
    }

    try {
        const response = await fetch('/api/favoritos');

        if (response.ok) {
            const data = await response.json();
            return data.favoritos || [];
        }

        return [];
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        return [];
    }
}

async function addFavorite(recipeId) {
    try {
        const response = await fetch(`/api/favoritos/${recipeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
        return false;
    }
}

async function removeFavorite(recipeId) {
    try {
        const response = await fetch(`/api/favoritos/${recipeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            return true;
        } else {
            console.error('Erro ao remover favorito:', response.status);
            return false;
        }
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
        return false;
    }
}

async function updateFavoriteCount() {
    const favorites = await loadFavoritesFromServer();
    const favoriteCount = document.getElementById('favorite-count');
    if (favoriteCount) {
        favoriteCount.textContent = favorites.length;
    }
}

async function loadFavoriteRecipes() {
    const favoriteContainer = document.getElementById('favorite-recipes');
    const emptyState = document.getElementById('empty-favorites');

    if (!favoriteContainer || !emptyState) return;

    favoriteContainer.innerHTML = '';

    const favorites = await loadFavoritesFromServer();

    if (favorites.length === 0) {
        emptyState.style.display = 'block';
        favoriteContainer.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    favoriteContainer.style.display = 'grid';

    const allRecipeCards = document.querySelectorAll('#salgados-recipes .card, #doces-recipes .card');

    allRecipeCards.forEach(card => {
        const favoriteButton = card.querySelector('.card-favorite-btn');
        if (favoriteButton) {
            const recipeId = favoriteButton.getAttribute('data-recipe-id');
            if (favorites.includes(parseInt(recipeId))) {
                const clonedCard = card.cloneNode(true);
                clonedCard.style.display = 'flex';

                const cloneFavBtn = clonedCard.querySelector('.card-favorite-btn');
                if (cloneFavBtn) {
                    cloneFavBtn.classList.add('active');
                    const icon = cloneFavBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    }

                    cloneFavBtn.addEventListener('click', async function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
                        const isLoggedIn = nomeUsuarioElement && nomeUsuarioElement.textContent.trim();

                        if (!isLoggedIn) {
                            showNotification('Faça login para favoritar receitas!', false);
                            return;
                        }

                        if (this.disabled) return;

                        const currentIcon = this.querySelector('i');

                        this.disabled = true;

                        if (currentIcon) {
                            currentIcon.className = 'fas fa-spinner fa-spin';
                        }

                        try {
                            const success = await removeFavorite(recipeId);

                            if (success) {
                                this.closest('.card').remove();

                                const mainButton = document.querySelector(`.card-favorite-btn[data-recipe-id="${recipeId}"]:not(#favorite-recipes .card-favorite-btn)`);

                                if (mainButton) {
                                    mainButton.classList.remove('active');

                                    const mainIcon = mainButton.querySelector('i');

                                    if (mainIcon) {
                                        mainIcon.className = 'far fa-heart';
                                    }
                                }

                                showNotification('Receita removida dos favoritos!', true);
                                await updateFavoriteCount();

                                const remainingCards = favoriteContainer.querySelectorAll('.card');

                                if (remainingCards.length === 0) {
                                    emptyState.style.display = 'block';
                                    favoriteContainer.style.display = 'none';
                                }
                            } else {
                                if (currentIcon) {
                                    currentIcon.className = 'fas fa-heart';
                                }
                            }
                        } finally {
                            this.disabled = false;
                        }
                    });
                }

                favoriteContainer.appendChild(clonedCard);
            }
        }
    });
}

function showNotification(message, isSuccess = false) {
    const notification = document.createElement('div');
    notification.className = 'user-notification';
    notification.innerHTML = `
      <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      ${message}
    `;

    if (isSuccess) {
        notification.classList.add('success');
    } else {
        notification.classList.add('error');
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', function () {
    initializeCarousel();

    let currentRecipeToDelete = null;
    let currentDeleteButton = null;

    function initializeDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.card-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                const recipeId = this.getAttribute('data-recipe-id');
                const recipeTitle = this.getAttribute('data-recipe-title');
                const recipeChefe = this.getAttribute('data-recipe-chefe');

                currentRecipeToDelete = recipeId;
                currentDeleteButton = this;

                openDeleteModal(recipeTitle, recipeChefe);
            });
        });
    }

    function openDeleteModal(recipeTitle, recipeChefe) {
        const modal = document.getElementById('deleteModal');
        const recipeNameElement = document.getElementById('recipeNameToDelete');
        const chefeInfoContainer = document.getElementById('chefeInfoContainer');
        const chefeNameElement = document.getElementById('chefeNameToDelete');

        if (modal && recipeNameElement) {
            recipeNameElement.textContent = `"${recipeTitle}"`;

            if (recipeChefe && recipeChefe.trim()) {
                chefeNameElement.textContent = recipeChefe;
                chefeInfoContainer.style.display = 'block';
            } else {
                chefeInfoContainer.style.display = 'none';
            }

            modal.style.zIndex = '2000';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';

            currentRecipeToDelete = null;
            currentDeleteButton = null;
        }
    }

    function setupDeleteModal() {
        const modal = document.getElementById('deleteModal');
        const closeBtn = document.querySelector('.close-delete-modal');
        const cancelBtn = document.querySelector('.delete-modal .cancel');
        const confirmBtn = document.querySelector('.delete-modal .confirm');

        if (closeBtn) {
            closeBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                closeDeleteModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                closeDeleteModal();
            });
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', async function () {
                if (currentRecipeToDelete && currentDeleteButton) {
                    this.disabled = true;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Excluindo...';

                    await deleteRecipe(currentRecipeToDelete, currentDeleteButton);
                    closeDeleteModal();

                    this.disabled = false;
                    this.innerHTML = '<i class="fas fa-trash"></i> Excluir';
                }
            });
        }

        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    closeDeleteModal();
                }
            });
        }
    }

    async function deleteRecipe(recipeId, buttonElement) {
        try {
            const response = await fetch(`/rejeitar/${recipeId}`, {
                method: 'POST'
            });

            if (response.ok) {
                const card = buttonElement.closest('.card');
                if (card) {
                    card.style.animation = 'fadeOut 0.3s ease forwards';

                    setTimeout(() => {
                        card.remove();
                        showDeleteNotification('Receita excluída com sucesso!', true);

                        updateCardCount();
                    }, 300);
                }

                const favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
                const updatedFavorites = favorites.filter(id => id !== recipeId);
                localStorage.setItem('recipeFavorites', JSON.stringify(updatedFavorites));
                updateFavoriteCount();

                const favTab = document.getElementById('favoritas');
                if (favTab && favTab.classList.contains('active')) {
                    loadFavoriteRecipes();
                }
            } else {
                console.error('Erro ao excluir receita:', response.status);
                showDeleteNotification('Erro ao excluir receita', false);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            showDeleteNotification('Erro de conexão', false);
        }
    }

    function updateCardCount() {
        const cards = document.querySelectorAll('#all-recipes .card');
        console.log(`Restam ${cards.length} receitas`);
    }

    function showDeleteNotification(message, isSuccess) {
        const notification = document.createElement('div');
        notification.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: ${isSuccess ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : '#e74c3c'};
      color: white; padding: 12px 20px; border-radius: 50px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000; display: flex; align-items: center; gap: 10px;
      opacity: 0; transform: translateY(20px); transition: all 0.3s ease;
    `;
        notification.innerHTML = `<i class="fas ${isSuccess ? 'fa-check' : 'fa-exclamation'}"></i> ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateY(0)'; }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
    document.head.appendChild(style);

    initializeDeleteButtons();
    setupDeleteModal();

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }

            if (tabId === 'favoritas') {
                loadFavoriteRecipes();
            } else {
                const allRecipeCards = document.querySelectorAll('#salgados-recipes .card, #doces-recipes .card');
                allRecipeCards.forEach(card => {
                    card.style.display = 'flex';
                });
            }
        });
    });

    initializeFavoriteButtons();
    updateFavoriteCount();

    document.addEventListener('pollingUpdated', async function () {
        await initializeFavoriteButtons();
        await updateFavoriteCount();
        updateCategoryCounts();
        await atualizarContadorNotificacoes();
    });

    function setupFilterWithDelay() {
        const nomeInput = document.getElementById('nome');
        const categoriaSelect = document.getElementById('categoria');
        const porcoesInput = document.getElementById('porcoes');

        const searchStatus = document.createElement('div');
        searchStatus.id = 'searchStatus';
        searchStatus.style.cssText = `
      text-align: center;
      padding: 10px;
      color: var(--light-text);
      font-style: italic;
      display: none;
    `;

        const filterForm = document.getElementById('filterForm');
        if (filterForm) {
            filterForm.parentNode.insertBefore(searchStatus, filterForm.nextSibling);
        }

        function showSearchStatus(message) {
            searchStatus.textContent = message;
            searchStatus.style.display = 'block';
        }

        function hideSearchStatus() {
            searchStatus.style.display = 'none';
        }

        function applyFilterWithDelay() {
            if (filterTimeout) {
                clearTimeout(filterTimeout);
            }

            const currentValues = {
                nome: nomeInput ? nomeInput.value.toLowerCase().trim() : '',
                categoria: categoriaSelect ? categoriaSelect.value : '',
                porcoes: porcoesInput ? porcoesInput.value : ''
            };

            const hasChanged = JSON.stringify(currentValues) !== JSON.stringify(lastFilterValues);

            if (!hasChanged) return;

            lastFilterValues = { ...currentValues };

            showSearchStatus('Procurando receita...');

            filterTimeout = setTimeout(() => {
                filtrarReceitasComCategoria(currentValues);
                hideSearchStatus();
            }, 1000);
        }

        function filtrarReceitasComCategoria(filtros = {}) {
            const { nome = '', categoria = '', porcoes = '' } = filtros;

            const salgadosCards = document.querySelectorAll('#salgados-recipes .card');
            const docesCards = document.querySelectorAll('#doces-recipes .card');

            let salgadosVisiveis = 0;
            let docesVisiveis = 0;
            let totalVisiveis = 0;

            const salgadosSection = document.getElementById('salgados-section');
            const docesSection = document.getElementById('doces-section');
            const salgadosEmpty = document.getElementById('salgados-empty');
            const docesEmpty = document.getElementById('doces-empty');

            const filtroCategoriaAtivo = categoria !== '';

            if (!filtroCategoriaAtivo) {
                if (salgadosSection) salgadosSection.style.display = 'block';
                if (docesSection) docesSection.style.display = 'block';
            } else {
                if (categoria === 'SALGADO') {
                    if (salgadosSection) salgadosSection.style.display = 'block';
                    if (docesSection) docesSection.style.display = 'none';
                } else if (categoria === 'DOCE') {
                    if (salgadosSection) salgadosSection.style.display = 'none';
                    if (docesSection) docesSection.style.display = 'block';
                }
            }

            salgadosCards.forEach(card => {
                const titulo = card.querySelector('h2')?.innerText.toLowerCase() || '';
                const porcoesElement = card.querySelector('.card-meta span:nth-child(2) span');
                const porcoesReceita = porcoesElement ? parseInt(porcoesElement.innerText) : 0;

                let mostrar = true;

                if (nome && !titulo.includes(nome.toLowerCase())) {
                    mostrar = false;
                }

                if (categoria && categoria !== 'SALGADO') {
                    mostrar = false;
                }

                if (porcoes && porcoesReceita !== parseInt(porcoes)) {
                    mostrar = false;
                }

                if (mostrar) {
                    card.style.display = 'flex';
                    salgadosVisiveis++;
                    totalVisiveis++;
                } else {
                    card.style.display = 'none';
                }
            });

            docesCards.forEach(card => {
                const titulo = card.querySelector('h2')?.innerText.toLowerCase() || '';
                const porcoesElement = card.querySelector('.card-meta span:nth-child(2) span');
                const porcoesReceita = porcoesElement ? parseInt(porcoesElement.innerText) : 0;

                let mostrar = true;

                if (nome && !titulo.includes(nome.toLowerCase())) {
                    mostrar = false;
                }

                if (categoria && categoria !== 'DOCE') {
                    mostrar = false;
                }

                if (porcoes && porcoesReceita !== parseInt(porcoes)) {
                    mostrar = false;
                }

                if (mostrar) {
                    card.style.display = 'flex';
                    docesVisiveis++;
                    totalVisiveis++;
                } else {
                    card.style.display = 'none';
                }
            });

            const salgadosCount = document.getElementById('salgados-count');
            const docesCount = document.getElementById('doces-count');
            const salgadosEmptyText = document.getElementById('salgados-empty-text');
            const docesEmptyText = document.getElementById('doces-empty-text');

            if (salgadosCount) {
                salgadosCount.textContent = `${salgadosVisiveis} receita${salgadosVisiveis !== 1 ? 's' : ''}`;
            }

            if (docesCount) {
                docesCount.textContent = `${docesVisiveis} receita${docesVisiveis !== 1 ? 's' : ''}`;
            }

            if (salgadosEmpty && salgadosSection && salgadosSection.style.display !== 'none') {
                if (salgadosVisiveis === 0) {
                    salgadosEmpty.style.display = 'block';
                    if (salgadosEmptyText) {
                        salgadosEmptyText.textContent = categoria === 'SALGADO'
                            ? 'Não há receitas salgadas com os filtros aplicados.'
                            : 'Não há receitas salgadas disponíveis.';
                    }
                } else {
                    salgadosEmpty.style.display = 'none';
                }
            }

            if (docesEmpty && docesSection && docesSection.style.display !== 'none') {
                if (docesVisiveis === 0) {
                    docesEmpty.style.display = 'block';
                    if (docesEmptyText) {
                        docesEmptyText.textContent = categoria === 'DOCE'
                            ? 'Não há receitas doces com os filtros aplicados.'
                            : 'Não há receitas doces disponíveis.';
                    }
                } else {
                    docesEmpty.style.display = 'none';
                }
            }

            if (searchStatus && totalVisiveis === 0) {
                const hasFilters = nome || categoria || porcoes;
                if (hasFilters) {
                    showSearchStatus('Nenhuma receita encontrada com esses filtros.');
                    setTimeout(() => {
                        if (searchStatus.textContent.includes('Nenhuma receita')) {
                            hideSearchStatus();
                        }
                    }, 2000);
                }
            } else if (searchStatus) {
                hideSearchStatus();
            }
        }

        if (nomeInput) {
            nomeInput.addEventListener('input', applyFilterWithDelay);
        }

        if (categoriaSelect) {
            categoriaSelect.addEventListener('change', applyFilterWithDelay);
        }

        if (porcoesInput) {
            porcoesInput.addEventListener('input', applyFilterWithDelay);
        }

        const aplicarFiltros = document.getElementById('aplicarFiltros');
        if (aplicarFiltros) {
            aplicarFiltros.addEventListener('click', function () {
                if (filterTimeout) {
                    clearTimeout(filterTimeout);
                }

                showSearchStatus('Aplicando filtros...');

                const currentValues = {
                    nome: nomeInput ? nomeInput.value.toLowerCase().trim() : '',
                    categoria: categoriaSelect ? categoriaSelect.value : '',
                    porcoes: porcoesInput ? porcoesInput.value : ''
                };

                filtrarReceitasComCategoria(currentValues);
                setTimeout(hideSearchStatus, 500);
            });
        }

        const limparFiltros = document.getElementById('limparFiltros');
        if (limparFiltros) {
            limparFiltros.addEventListener('click', function () {
                if (filterTimeout) {
                    clearTimeout(filterTimeout);
                }

                if (nomeInput) nomeInput.value = '';
                if (categoriaSelect) categoriaSelect.value = '';
                if (porcoesInput) porcoesInput.value = '';

                lastFilterValues = {};

                const salgadosCards = document.querySelectorAll('#salgados-recipes .card');
                const docesCards = document.querySelectorAll('#doces-recipes .card');

                salgadosCards.forEach(card => card.style.display = 'flex');
                docesCards.forEach(card => card.style.display = 'flex');

                const salgadosSection = document.getElementById('salgados-section');
                const docesSection = document.getElementById('doces-section');

                if (salgadosSection) salgadosSection.style.display = 'block';
                if (docesSection) docesSection.style.display = 'block';

                const salgadosEmpty = document.getElementById('salgados-empty');
                const docesEmpty = document.getElementById('doces-empty');

                if (salgadosEmpty) salgadosEmpty.style.display = 'none';
                if (docesEmpty) docesEmpty.style.display = 'none';

                const salgadosCount = document.getElementById('salgados-count');
                const docesCount = document.getElementById('doces-count');

                if (salgadosCount) {
                    salgadosCount.textContent = `${salgadosCards.length} receita${salgadosCards.length !== 1 ? 's' : ''}`;
                }

                if (docesCount) {
                    docesCount.textContent = `${docesCards.length} receita${docesCards.length !== 1 ? 's' : ''}`;
                }

                showSearchStatus('Filtros limpos! Mostrando todas as receitas.');
                setTimeout(hideSearchStatus, 1000);
            });
        }

        const filterFormElement = document.getElementById('filterForm');
        if (filterFormElement) {
            filterFormElement.addEventListener('submit', function (e) {
                e.preventDefault();
            });
        }
    }

    setupFilterWithDelay();

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLoginModal();
            closeDeleteModal();
            closeLogoutModal();
            fecharModalUsuario();
        }
    });
});

function initializeCarousel(indiceInicial) {
  const carousel = document.querySelector('.carousel-inner');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');

  if (items.length === 0) {
    return;
  }

  let currentIndex = (typeof indiceInicial === 'number' && indiceInicial >= 0 && indiceInicial < items.length)
    ? indiceInicial
    : 0;

  const totalItems = items.length;

  function updateCarousel() {
    if (carousel) {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    const indicadoresAtuais = document.querySelectorAll('.carousel-indicator');
    indicadoresAtuais.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });

    const itensAtuais = document.querySelectorAll('.carousel-item');
    itensAtuais.forEach((item, index) => {
      item.classList.toggle('active', index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
  }

  function irParaSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  if (nextBtn) {
    const novo = nextBtn.cloneNode(true);
    nextBtn.replaceWith(novo);
    novo.addEventListener('click', nextSlide);
  }

  if (prevBtn) {
    const novo = prevBtn.cloneNode(true);
    prevBtn.replaceWith(novo);
    novo.addEventListener('click', prevSlide);
  }

  const indicadores = document.querySelectorAll('.carousel-indicator');
  indicadores.forEach((indicator, index) => {
    const novo = indicator.cloneNode(true);
    indicator.replaceWith(novo);
    novo.addEventListener('click', () => irParaSlide(index));
  });

  if (window.carouselInterval) {
    clearInterval(window.carouselInterval);
  }

  window.carouselInterval = setInterval(nextSlide, 5000);

  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer && !carouselContainer.dataset.hoverListener) {
    carouselContainer.dataset.hoverListener = 'true';
    carouselContainer.addEventListener('mouseenter', () => clearInterval(window.carouselInterval));
    carouselContainer.addEventListener('mouseleave', () => {
      clearInterval(window.carouselInterval);
      window.carouselInterval = setInterval(nextSlide, 5000);
    });
  }

  updateCarousel();
}

function applyResponsiveStyles() {
    if (document.getElementById('responsive-styles')) return;

    const style = document.createElement('style');
    style.id = 'responsive-styles';
    style.innerHTML = `

    @media (max-width: 480px) {
      :root {
        --header-padding: 10px;
        --font-scale: 0.8;
      }

      .tab-buttons {
        display: flex;
        justify-content: space-between;
      }

      body {
        padding: 0 15px;
      }

      .header-container {
        padding: 10px 15px;
      }

      .newspaper-subtitle {
        display: none;
      }

      .newspaper-price,
      .newspaper-volume {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        margin: 10px auto;
        width: fit-content;
      }

      .menu-icon,
      .user-icon {
        font-size: 1.3rem;
        height: 30px;
        width: 30px;
      }

      .nav-links {
        flex-direction: column;
        gap: 10px;
        margin: 20px 0;
      }

      .nav-links a {
        padding: 12px 15px;
        font-size: 0.9rem;
        justify-content: center;
      }

      .carousel-container {
        display: none;
      }

      .carousel-caption h3 {
        font-size: 1.5rem;
      }

      .carousel-caption p {
        font-size: 0.9rem;
        padding: 0 10px;
      }

      .carousel-control {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }

      .news-item {
        padding: 18px;
        min-height: 180px;
      }

      .news-description {
        font-size: 0.9rem;
      }

      .news-title {
        font-size: 1.1rem;
      }

      .filter-group input {
        padding: 10px 10px 10px 40px;
      }

      .filter-buttons {
        margin-top: 0;
        gap: 0;
      }

      .news-icon {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
        margin-right: 12px;
      }

      .recipe-filters {
        padding: 15px;
        margin: 20px 0 0 0;
      }

      .recipe-filters h3 {
        font-size: 1.3rem;
      }

      #filterForm {
        grid-template-columns: 1fr;
      }

      .receitas {
        grid-template-columns: 1fr !important;
        gap: 20px;
        margin: 30px 0;
      }

      .card {
        margin-bottom: 15px;
      }

      .card-image {
        height: 180px;
      }

      .card-content {
        padding: 15px;
      }

      .card h2 {
        font-size: 1.4rem;
      }

      .card-actions {
        flex-direction: row;
        gap: 10px;
      }

      .card-link,
      .card-favorite {
        justify-content: center;
      }

      .section-title h2 {
        font-size: 1.6rem;
      }

      .classifieds {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .advertisement {
        padding: 25px 15px;
      }

      .advertisement h2 {
        font-size: 1.6rem;
      }

      .footer-content {
        grid-template-columns: 1fr;
        gap: 25px;
        text-align: left;
      }

      .user-info-grid {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .form-input {
        font-size: 0.9rem;
        padding: 10px;
      }

      .modal-content-user {
        width: 95% !important;
        max-width: 95% !important;
        margin: 10px auto !important;
        border-radius: 10px !important;
      }

      .modal-content-user .modal-body {
        padding: 15px !important;
        max-height: calc(90vh - 120px) !important;
      }

      .modal-content-user .form-input {
        font-size: 16px !important;
      }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .header-container {
        padding: 15px 20px;
      }

      .newspaper-subtitle {
        display: none;
      }

      .nav-links {
        gap: 15px;
        flex-wrap: wrap;
      }

      .nav-links a {
        padding: 12px 20px;
        font-size: 1rem;
      }

      .carousel-caption h3 {
        font-size: 1.8rem;
      }

      .receitas {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 25px;
      }

      .recipe-filters {
        padding: 20px;
      }

      #filterForm {
        grid-template-columns: repeat(2, 1fr);
      }

      .classifieds {
        grid-template-columns: repeat(2, 1fr);
      }

      .modal-content-user,
      .modal-content-login,
      .modal-content-logout,
      .modal-content-delete {
        width: 90% !important;
        max-width: 500px !important;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .newspaper-title {
        font-size: 2rem;
      }

      .newspaper-date{
        display: none;
      }

      .newspaper-price{
        display: none;
      }

      .newspaper-title::before,
      .newspaper-title::after {
        display: none;
      }

      .header-user-profile,
      .header-logout-btn {
        padding: 4px 14px;
      }

      .receitas {
        grid-template-columns: repeat(2, 1fr) !important;
      }

      .carousel-container {
        height: 400px;
      }

      .classifieds {
        grid-template-columns: repeat(2, 1fr);
      }

      .footer-content {
        grid-template-columns: repeat(3, 1fr);
      }

      .modal-content-user {
        max-width: 70% !important;
      }
    }

    @media (min-width: 900px) and (max-width: 1200px) {
      .form-row {
        gap: 0;
        display: flex;
        flex-direction: column;
      }

      .newspaper-title {
        font-size: 3rem;
      }

      .receitas {
        grid-template-columns: repeat(3, 1fr) !important;
      }

      .classifieds {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .tab-button .badge {
        padding: 2px 6px;
        font-size: 0.6rem;
      }

      .tab-buttons {
        display: flex;
        align-items: stretch;
        flex-direction: row;
        flex-wrap: nowrap;
      }

      .tab-button {
        text-align: center;
        font-size: 0.7rem;
        gap: 3px;
      }

      .recipe-count {
        display: none;
      }

      .modal-actions,
      .modal-actions-delete {
        flex-direction: column;
      }

      .modal-actions button,
      .modal-actions-delete button {
        width: 100%;
        margin-bottom: 10px;
      }

      .card-meta {
        flex-wrap: wrap;
        gap: 10px;
      }

      .carousel-controls {
        padding: 0 5px;
      }

      .carousel-control {
        width: 45px;
        height: 45px;
        font-size: 1.5rem;
      }

      .carousel-indicators {
        bottom: 10px;
      }

      .carousel-indicator {
        width: 10px;
        height: 10px;
      }

      .social-links {
        flex-wrap: wrap;
        justify-content: left;
      }

      .modal-content-user {
        max-height: 80vh !important;
        overflow-y: auto !important;
        margin: 5% auto !important;
      }

      .modal-content-user .modal-body {
        max-height: calc(80vh - 100px) !important;
        overflow-y: auto !important;
      }

      .modal-content-user .user-info-grid {
        display: flex !important;
        flex-direction: column !important;
        gap: 15px !important;
      }

      .modal {
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }

      .modal-content-user {
        position: relative !important;
        transform: none !important;
        top: 45px !important;
      }

      body {
        max-width: 100% !important;
        overflow-x: hidden !important;
        padding: 0 !important;
      }

      .header-full-width {
        width: 100% !important;
        left: 0 !important;
        right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }

    @media (max-width: 768px) and (orientation: landscape) {
      .carousel-container {
        height: 300px;
      }

      .nav-links {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .newspaper-title {
        font-size: 2.2rem;
      }
    }

    @media (min-width: 1400px) {
      body {
        max-width: 1400px;
        margin: 0 auto;
      }
    }

    @media print {
      .header-full-width,
      .nav-links,
      .carousel-container,
      .advertisement,
      .modal,
      .sidebar,
      .menu-icon,
      .user-icon,
      .card-favorite,
      .card-delete,
      .carousel-controls,
      .social-links,
      .footer-bottom {
        display: none !important;
      }

      body {
        background: white;
        color: black;
      }

      .card,
      .news-item,
      .classified-item {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ddd;
      }
    }

    @media (max-width: 992px) {
      .carousel-container {
        height: 400px;
      }
    }

    @media (max-width: 768px) {
      .classifieds-section .section-title p {
        font-size: 0.85rem;
      }

      .nav-links {
        flex-direction: column;
        gap: 10px;
        margin: 20px 0;
      }

      .nav-links a {
        padding: 12px 18px;
        font-size: 0.85rem;
        justify-content: center;
      }

      .tab-buttons {
        gap: 8px;
      }

      .tab-button {
        padding: 10px 16px;
        font-size: 0.85rem;
      }

      .recipe-filters {
        padding: 20px;
      }

      .recipe-filters h3 {
        font-size: 1.1rem;
      }

      #filterForm {
        grid-template-columns: 1fr;
      }

      .filter-buttons {
        flex-direction: column;
        gap: 10px;
      }

      #filterForm button {
        width: 100%;
      }

      .empty-state {
        padding: 40px 20px;
      }

      .empty-state i {
        font-size: 3rem;
      }

      .empty-state h2 {
        font-size: 1.3rem;
      }

      .content-wrapper {
        padding: 25px 5px !important;
      }

      .header-container {
        padding: 15px !important;
      }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .recipe-filters {
        padding: 20px;
      }

      #filterForm {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .carousel-container {
        height: 400px;
      }
    }

    @media (max-width: 768px) and (orientation: landscape) {
      .carousel-container {
        height: 300px;
      }

      .nav-links {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }

    @media print {
      .header-full-width,
      .nav-links,
      .carousel-container,
      .modal,
      .sidebar,
      .menu-icon,
      .user-icon,
      .card-favorite,
      .card-delete,
      .carousel-controls,
      .social-links,
      .footer-bottom {
        display: none !important;
      }

      body {
        background: white;
        color: black;
      }

      .card,
      .news-item,
      .classified-item {
        break-inside: avoid;
        box-shadow: none;
        border: 1px solid #ddd;
      }
    }

    @media (max-width: 768px) {
      .minhas-receitas-wrapper {
        padding: 0;
        margin-top: 0;
      }

      .minhas-receitas-header {
        display: none;
      }

      .minhas-receitas-header h1 {
        font-size: 1.15rem;
      }

      .minhas-receitas-header h1 i {
        font-size: 1rem;
      }

      .minhas-receitas-header p {
        font-size: 0.85rem;
      }

      .minhas-receitas-tabs {
        gap: 0;
        margin: 0 0 20px;
      }

      .minhas-tab {
        padding: 10px 14px;
        font-size: 0.7rem;
        flex: 1;
        justify-content: center;
      }

      .minhas-receitas-grid {
        grid-template-columns: 1fr 1fr !important;
        gap: 10px;
      }

      .minha-receita-card {
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
      }

      .minha-receita-imagem {
        height: 130px;
      }

      .status-badge {
        top: 8px;
        right: 8px;
        font-size: 0.6rem;
        padding: 4px 8px;
        gap: 4px;
      }

      .status-badge i {
        font-size: 0.6rem;
      }

      .minha-receita-info {
        padding: 12px 12px 14px;
      }

      .minha-receita-info h3 {
        font-size: 0.9rem;
        margin-bottom: 8px;
      }

      .minha-receita-meta {
        font-size: 0.7rem;
        gap: 6px;
        margin-bottom: 12px;
        padding-bottom: 10px;
      }

      .minha-receita-actions a,
      .minha-receita-actions button {
        min-width: 100%;
        padding: 8px 10px;
        font-size: 0.65rem;
      }

      .minhas-receitas-tabs {
        align-items: normal;
      }
    }

    @media (max-width: 480px) {
      .minhas-tab {
        padding: 8px 10px;
        font-size: 0.65rem;
      }

      .tab-count{
      display: none;
      }

      .minhas-tab i {
        font-size: 0.8rem;
      }

      .minha-receita-imagem {
        height: 110px;
      }

      .minha-receita-info h3 {
        font-size: 0.85rem;
      }

      .minha-receita-meta {
        font-size: 0.65rem;
      }
    }

    @media (max-width: 992px) {
      .carousel-container {
        min-height: 400px;
      }

      .carousel-caption h3 {
        font-size: 2rem;
      }

      .carousel-caption p {
        font-size: 1rem;
      }
    }

    @media (max-width: 768px) {
      .carousel-container {
        min-height: 300px;
        margin: 20px 0;
        border-radius: 4px;
      }

      .carousel-caption {
        padding: 20px 15px;
      }

      .carousel-caption h3 {
        font-size: 1.4rem;
        letter-spacing: 0.5px;
      }

      .carousel-caption p {
        font-size: 0.9rem;
        margin: 6px auto;
      }

      .carousel-control {
        width: 42px;
        height: 42px;
        font-size: 1rem;
      }

      .carousel-controls {
        padding: 0 12px;
      }

      .carousel-indicators {
        bottom: 14px;
        gap: 8px;
      }

      .carousel-indicator {
        width: 24px;
        height: 5px;
      }

      .carousel-indicator.active {
        width: 36px;
      }
    }

    @media (max-width: 480px) {
      .carousel-container {
        min-height: 240px;
      }

      .carousel-caption h3 {
        font-size: 1.15rem;
      }

      .carousel-caption p {
        font-size: 0.82rem;
      }

      .carousel-control {
        width: 36px;
        height: 36px;
        font-size: 0.85rem;
      }

      .carousel-controls {
        padding: 0 8px;
      }
    }

    @media (max-width: 768px) and (orientation: landscape) {
      .carousel-container {
        min-height: 260px;
      }
    }

    @media (min-width: 769px) and (max-width: 980px) {
      .content-wrapper {
        padding: 0 10px !important;
      }

      .newspaper-header {
        padding: 15px 10px !important;
      }
    }

    @media (min-width: 981px) and (max-width: 1440px) {
      .content-wrapper,
      .header-full-width.scrolled {
        padding: 0 30px !important;
      }
    }

    @media (max-width: 768px) {
      .receitas-section .receitas,
      #favorite-recipes {
        grid-template-columns: 1fr 1fr !important;
        gap: 10px;
        margin: 24px 0;
      }

      .receitas-section .card,
      #favorite-recipes .card {
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
      }

      .receitas-section .card-image,
      #favorite-recipes .card-image {
        height: 120px;
      }

      .receitas-section .card-content,
      #favorite-recipes .card-content {
        padding: 12px 12px 14px;
      }

      .receitas-section .card-titulo,
      #favorite-recipes .card-titulo {
        font-size: 0.95rem;
        margin-bottom: 8px;
      }

      .receitas-section .card-meta,
      #favorite-recipes .card-meta {
        gap: 6px;
        margin-bottom: 0;
        padding-bottom: 6px;
      }

      .receitas-section .card-meta-row {
        gap: 8px;
      }

      .receitas-section .card-meta-item,
      #favorite-recipes .card-meta-item {
        font-size: 0.72rem;
        gap: 4px;
      }

      .receitas-section .card-meta-item i,
      #favorite-recipes .card-meta-item i {
        font-size: 0.7rem;
      }

      .receitas-section .card-link,
      #favorite-recipes .card-link {
        font-size: 0.68rem;
        padding: 8px 10px;
        letter-spacing: 0.5px;
      }

      .receitas-section .card-link i,
      #favorite-recipes .card-link i {
        font-size: 0.7em;
      }

      .receitas-section .card-delete,
      #favorite-recipes .card-delete {
        width: 34px;
        height: 34px;
        font-size: 0.8rem;
      }

      .receitas-section .card-favorite-btn,
      #favorite-recipes .card-favorite-btn {
        width: 32px;
        height: 32px;
        font-size: 0.85rem;
      }

      .card-badge-categoria {
        font-size: 0.6rem;
        padding: 4px 10px;
        letter-spacing: 1px;
      }

      .receitas-section .category-title {
        font-size: 1.1rem;
        gap: 8px;
      }

      .receitas-section .category-title i {
        font-size: 0.95rem;
      }

      .receitas-section .recipe-count {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .receitas-section .card-meta-row {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-start;
        align-content: flex-start;
        align-items: normal;
      }

      span#chef {
        display: none;
      }

      .receitas-section .receitas,
      #favorite-recipes {
        grid-template-columns: 1fr 1fr !important;
        gap: 5px;
      }

      .card-badge-categoria {
        display: none;
      }

      .receitas-section .card-image,
      #favorite-recipes .card-image {
        min-height: 100px !important;
      }

      .receitas-section .card-content,
      #favorite-recipes .card-content {
        padding: 10px 10px 12px;
      }

      .receitas-section .card-titulo,
      #favorite-recipes .card-titulo {
        font-size: 0.75rem;
        margin-bottom: 6px;
      }

      .receitas-section .card-meta-item,
      #favorite-recipes .card-meta-item {
        font-size: 0.7rem;
      }

      .receitas-section .card-link,
      #favorite-recipes .card-link {
        font-size: 0.62rem;
        padding: 7px 8px;
      }

      .receitas-section .card-favorite-btn,
      #favorite-recipes .card-favorite-btn {
        width: 28px;
        height: 28px;
        font-size: 0.8rem;
      }
    }

    @media(max-width: 378px){
    .minhas-receitas-tabs{
      flex-direction: column;
      }
          .admin-recipe-tabs a span{
    display: none;
    }
    .admin-table-header .count {
        font-size: 0.7rem !important;
    }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .receitas-section .receitas,
      #favorite-recipes {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 26px;
      }
    }

    @media (min-width: 1025px) and (max-width: 1200px) {
      .receitas-section .receitas,
      #favorite-recipes {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .classifieds-section .classified-description {
        display: none;
      }

      .classifieds-section .classified-meta span {
        gap: 4px;
        font-size: 0.72rem;
      }

      .classifieds-section .classified-meta {
        margin: 0 0 10px;
        padding-bottom: 10px;
        gap: 8px;
        border-bottom: 1px dashed rgba(139, 0, 0, 0.2);
      }

      .classifieds-section .classifieds {
        grid-template-columns: 1fr 1fr !important;
        gap: 5px;
        margin: 0;
      }

      .classifieds-section .classified-item {
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
      }

      .classifieds-section .classified-image {
        height: 130px;
        min-height: 100px !important;
      }

      .classifieds-section .classified-image-content {
        padding: 10px 12px;
      }

      .classifieds-section .classified-image-content h3 {
        font-size: 0.95rem;
        line-height: 1.2;
      }

      .classifieds-section .classified-content {
        padding: 10px 12px 12px;
      }

      .classifieds-section .classified-meta {
        margin-bottom: 10px;
        padding-bottom: 10px;
      }

      .classifieds-section .section-title {
        margin: 40px 0 20px;
      }

      .classifieds-section .section-title h2 {
        font-size: 1.2rem;
      }

      .classifieds-section .classified-actions {
        flex-wrap: wrap;
      }

      .classifieds-section .classified-link {
        font-size: 0.5rem;
        padding: 6px 8px;
        letter-spacing: 0.5px;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .classifieds-section .classifieds {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }
    }

    @media (max-width: 1100px) {
      .info-card {
        max-width: 360px;
      }
    }

    @media (max-width: 900px) {
      .main-layout {
        flex-direction: column-reverse;
        gap: 25px;
      }

      .info-card {
        position: relative;
        top: 0;
        max-width: 100%;
        width: 100%;
      }

      .form-container {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .receita-topbar {
        height: 56px;
        padding: 0 15px;
        gap: 12px;
      }

      .receita-topbar-back {
        padding: 6px 16px;
        font-size: 0.75rem;
        gap: 6px;
        box-shadow: 2px 2px 0 rgba(139, 0, 0, 0.15);
      }

      .receita-topbar-back-text-full {
        display: none;
      }

      .receita-topbar-back-text-short {
        display: inline;
      }

      .receita-topbar-title {
        display: none;
      }

      .main-layout {
        padding: 65px 5px 5px;
        gap: 20px;
      }

      .recipe-form {
        padding: 24px 20px;
        border: none;
        border-radius: 4px;
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
      }

      .info-card {
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .form-group {
        margin-bottom: 18px;
      }

      .form-group label {
        font-size: 0.8rem;
      }

      .form-control {
        padding: 11px 14px;
        font-size: 0.9rem;
      }

      .ingrediente-row {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
        padding: 12px;
        background: rgba(212, 175, 55, 0.04);
        border-radius: 4px;
        border: 1px solid rgba(139, 0, 0, 0.1);
      }

      .quantidade-input,
      .unidade-select,
      .ingrediente-nome-wrapper {
        width: 100%;
        min-width: 0;
      }

      .ingrediente-nome-wrapper .remove-btn,
      .input-wrapper .remove-btn {
        width: 30px;
        height: 30px;
        font-size: 15px;
      }

      .submit-button {
        padding: 14px;
        font-size: 0.9rem;
      }

      .info-header {
        padding: 16px;
      }

      .info-header h3 {
        font-size: 1rem;
      }

      .info-body {
        padding: 16px;
      }

      .info-section {
        margin-bottom: 18px;
        padding-bottom: 12px;
      }

      .info-section h4 {
        font-size: 0.78rem;
      }

      .info-section p,
      .info-section li {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .receita-topbar {
        height: 54px;
        padding: 0 12px;
        gap: 10px;
      }

      .receita-topbar-title {
        font-size: 0.75rem;
      }

      .recipe-form {
        padding: 20px 14px;
      }

      .recipe-form::before {
        height: 3px;
      }

      .form-group label {
        font-size: 0.75rem;
        gap: 4px;
      }

      .form-group label i {
        font-size: 0.8rem;
        width: 14px;
      }

      .form-control {
        padding: 10px 12px;
        font-size: 0.88rem;
      }

      .file-input-label {
        align-items: stretch;
        gap: 10px;
        padding: 12px;
      }

      .file-input-text {
        font-size: 0.65rem;
        white-space: normal;
      }

      .file-input-button {
        font-size: 0.8rem;
        width: 38px;
        height: 38px;
      }

      #addIngrediente,
      #addPasso {
        width: 100%;
        justify-content: center;
        padding: 10px;
        font-size: 0.75rem;
      }

      .ingrediente-row {
        padding: 10px;
      }

      .quantidade-input,
      .unidade-select,
      .ingrediente-nome-input {
        padding: 10px 12px;
        font-size: 0.85rem;
      }

      .passo-input {
        padding: 10px 42px 10px 12px;
        font-size: 0.85rem;
      }

      .ingrediente-nome-wrapper .remove-btn,
      .input-wrapper .remove-btn {
        width: 26px;
        height: 26px;
        font-size: 14px;
      }

      .submit-button {
        padding: 13px;
        font-size: 0.85rem;
      }

      .info-header h3 {
        font-size: 0.9rem;
        gap: 8px;
      }

      .info-header i {
        font-size: 0.9rem;
      }

      .info-body {
        padding: 14px;
      }

      .info-section h4 {
        font-size: 0.72rem;
      }

      .user-notification {
        left: 15px;
        right: 15px;
        bottom: 15px;
        font-size: 0.75rem;
        padding: 10px 14px;
        justify-content: center;
      }
    }

    @media (max-width: 992px) {
      .detalhe-hero {
        grid-template-columns: 1fr;
        min-height: auto;
      }

      .detalhe-info-actions {
        top: 20px;
        right: 30px;
      }

      .detalhe-image {
        min-height: 320px;
        height: 320px;
        border-right: none;
        border-bottom: 2px solid var(--header-color);
      }

      .detalhe-info {
        padding: 30px;
      }

      .detalhe-titulo {
        font-size: 2rem;
      }

      .detalhe-body {
        grid-template-columns: 1fr;
        padding: 30px;
        gap: 40px;
      }

      .detalhe-section {
        padding: 0;
      }

      .detalhe-section:first-child {
        border-right: none;
        border-bottom: 1px dashed rgba(139, 0, 0, 0.2);
        padding-bottom: 30px;
      }
    }

    @media (max-width: 768px) {
      .detalhe-badge-categoria {
        display: none;
      }

      .detalhe-topbar {
        height: 56px;
        padding: 0 15px;
        gap: 12px;
        justify-content: space-between;
      }

      .detalhe-topbar-back {
        padding: 6px 16px;
        font-size: 0.75rem;
        gap: 6px;
        box-shadow: 2px 2px 0 rgba(139, 0, 0, 0.15);
      }

      .detalhe-topbar-back-text-full {
        display: none;
      }

      .detalhe-topbar-back-text-short {
        display: inline;
      }

      .detalhe-topbar-title {
        font-size: 0.85rem;
      }

      .detalhe-container {
        padding: 70px 5px 0;
      }

      .detalhe-card {
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
        border: 1px solid var(--header-color);
      }

      .detalhe-image {
        min-height: 260px;
        height: 260px;
      }

      .detalhe-info {
        padding: 22px 20px;
      }

      .detalhe-info-header {
        flex-direction: column;
        align-items: stretch;
        gap: 14px;
        display: flex;
      }

      .detalhe-info-actions {
        position: static;
        width: 100%;
      }

      .detalhe-favorite-btn,
      .detalhe-print-btn {
        flex: 1;
        min-width: 0;
        padding: 10px 12px;
        font-size: 0.72rem;
      }

      .detalhe-titulo {
        font-size: 1.7rem;
        margin-bottom: 15px;
      }

      .detalhe-meta {
        gap: 6px;
      }

      .detalhe-meta-item {
        font-size: 0.75rem;
        padding: 4px 11px;
      }

      .detalhe-body {
        padding: 25px 20px;
        gap: 30px;
      }

      .detalhe-section:first-child {
        padding-bottom: 25px;
      }

      .detalhe-section-header {
        gap: 10px;
        margin-bottom: 18px;
        padding-bottom: 12px;
      }

      .detalhe-section-header i {
        font-size: 1rem;
      }

      .detalhe-section-header h2 {
        font-size: 0.95rem;
      }

      .detalhe-section-count {
        font-size: 0.65rem;
        padding: 3px 10px;
      }

      .detalhe-ingrediente-item {
        padding: 10px 14px;
        gap: 12px;
      }

      .detalhe-ingrediente-text {
        font-size: 0.88rem;
      }

      .detalhe-ingrediente-checkbox {
        width: 20px;
        height: 20px;
      }

      .detalhe-preparo-item {
        padding: 13px 15px;
        gap: 13px;
      }

      .detalhe-preparo-number {
        min-width: 28px;
        height: 28px;
        font-size: 0.78rem;
      }

      .detalhe-preparo-text {
        font-size: 0.88rem;
      }
    }

    @media (max-width: 480px) {
      .detalhe-topbar {
        height: 54px;
        padding: 0 12px;
        gap: 10px;
      }

      .detalhe-topbar-title {
        font-size: 0.75rem;
      }

      .detalhe-image {
        min-height: 220px;
        height: 220px;
      }

      .detalhe-info {
        padding: 20px 16px;
      }

      .detalhe-badge-categoria {
        font-size: 0.65rem;
        padding: 5px 12px;
      }

      .detalhe-titulo {
        font-size: 1.4rem;
      }

      .detalhe-meta-item {
        font-size: 0.7rem;
        padding: 4px 10px;
      }

      .detalhe-meta-item i {
        font-size: 0.8rem;
      }

      .detalhe-body {
        padding: 20px 16px;
        gap: 25px;
      }

      .detalhe-section-header h2 {
        font-size: 0.9rem;
      }

      .detalhe-section-header i {
        font-size: 0.9rem;
      }

      .detalhe-section-count {
        font-size: 0.6rem;
        padding: 3px 8px;
      }

      .detalhe-ingrediente-item {
        padding: 9px 12px;
        gap: 10px;
      }

      .detalhe-ingrediente-text {
        font-size: 0.85rem;
      }

      .detalhe-preparo-item {
        padding: 11px 12px;
        gap: 11px;
      }

      .detalhe-preparo-number {
        min-width: 24px;
        height: 24px;
        font-size: 0.72rem;
      }

      .detalhe-preparo-text {
        font-size: 0.85rem;
        line-height: 1.5;
      }

      .detalhe-favorite-btn,
      .detalhe-print-btn {
        padding: 9px 10px;
        font-size: 0.68rem;
        gap: 5px;
      }
    }

    @media print {
      .detalhe-topbar,
      .detalhe-badge-categoria,
      .sidebar,
      .sidebar-overlay,
      .header-full-width,
      .newspaper-footer,
      .modal {
        display: none !important;
      }

      .detalhe-container {
        padding: 0;
      }

      .detalhe-card {
        box-shadow: none;
        border: none;
      }

      .detalhe-hero {
        background: white;
      }

      .detalhe-image {
        min-height: 200px;
      }
    }

    @media (max-width: 996px) {
      .newspaper-header {
        padding: 20px 0;
      }

      .header-nav {
            margin-top: 10px;
      }

      .newspaper-subtitle{
      font-size: 0.85rem;
      }

      .header-nav a {
        padding: 10px 14px;
        font-size: 0.75rem;
      }

      .newspaper-title {
        font-size: 2.8rem;
      }

      .newspaper-title::before,
      .newspaper-title::after {
        font-size: 2rem;
      }

      .newspaper-title::before {
        left: -25px;
      }

      .newspaper-title::after {
        right: -25px;
      }

      .header-full-width.scrolled .newspaper-title {
        padding: 0;
        font-size: 1.3rem;
      }

      .header-full-width.scrolled .newspaper-title::before,
      .header-full-width.scrolled .newspaper-title::after {
        font-size: 1.4rem;
      }
    }

    @media (max-width: 768px) {
      #page-loader {
        backdrop-filter: blur(25px);
        background: none;
      }

      .header-container {
        padding: 12px 15px;
      }

      .newspaper-header {
        padding: 0;
      }

      .header-right,
      .newspaper-price,
      .newspaper-date,
      .header-logout-btn,
      .header-notification-btn,
      .header-user-desktop {
        display: none;
      }

      .header-center {
        justify-content: flex-end;
        gap: 0;
      }

      .header-greeting {
        text-align: center;
      }

      .newspaper-title {
        padding: 0;
        font-size: 1.15rem;
        letter-spacing: 1px;
        text-shadow: none;
      }

      .newspaper-title::before,
      .newspaper-title::after{
        display: none;
      }

      .header-notification-desktop,
      .header-notification-nav,
      .header-notification-btn {
        display: none !important;
      }

      .header-nav.open .header-notification-sidebar {
        display: inline-flex !important;
      }

      .header-nav.open .header-notification-nav,
      .header-nav.open .header-notification-desktop {
        display: none !important;
      }

      .menu-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        padding: 0;
        flex-shrink: 0;
        color: white;
        font-size: 1.3rem;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.06);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        transition: all 0.25s ease;
      }

      .header-nav {
        position: fixed;
        top: 0;
        left: -5px;
        z-index: 2000;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: 8px;
        width: 280px;
        max-width: 85%;
        height: 100vh;
        margin: 0;
        padding: 18px;
        overflow-y: auto;
        flex-wrap: nowrap;
        background: #fff;
        border: none;
        border-right: 2px solid var(--header-color);
        box-shadow: 4px 0 0 rgba(139, 0, 0, 0.15);
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .header-nav.open {
        transform: translateX(0);
      }

      .header-nav a {
        justify-content: flex-start;
        padding: 14px 18px;
        color: var(--header-color);
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: transparent;
        border: 2px solid var(--header-color);
        transform: none;
      }

      .header-nav a i {
        color: var(--header-color);
        opacity: 1;
      }

      .header-nav a.active {
        color: var(--header-color);
        background: var(--accent-color);
        border-color: var(--accent-color);
      }

      .header-nav a.active i {
        color: var(--header-color);
      }

      .header-nav.open .header-nav-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 14px;
        margin-bottom: 12px;
        border-bottom: 2px solid var(--header-color);
      }

      .header-nav.open .header-nav-title {
        display: block;
        margin: 0;
        color: var(--header-color);
        font-family: 'DM Serif Display', serif;
        font-size: 1.2rem;
        font-weight: 800;
        line-height: 1.1;
        text-transform: uppercase;
        letter-spacing: 2px;
      }

      .header-nav.open .header-nav-close {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        color: var(--header-color);
        font-size: 1.8rem;
        line-height: 1;
        cursor: pointer;
        background: none;
        border: none;
        opacity: 0.7;
        transition: all 0.3s ease;
      }

      .header-nav .header-user-profile,
      .header-nav .header-user-mobile,
      .header-nav .header-notification-sidebar,
      .header-nav .header-logout-sidebar {
        display: inline-flex !important;
        width: 100%;
        min-height: 46px;
        height: auto;
        padding: 14px 18px;
        box-sizing: border-box;
        justify-content: flex-start;
        color: var(--header-color);
        font-weight: 700;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background: transparent;
        border: 2px solid var(--header-color);
        border-radius: 4px;
        transform: none;
      }

      .header-nav .header-user-profile i,
      .header-nav .header-user-profile span,
      .header-nav .header-user-mobile i,
      .header-nav .header-notification-sidebar i,
      .header-nav .header-logout-sidebar i {
        color: var(--header-color);
      }

      .header-nav .header-notification-sidebar .notification-sidebar-badge {
        display: inline-flex;
      }

      .header-full-width.scrolled .header-nav {
        max-height: none;
        padding: 18px;
        overflow-y: auto;
        opacity: 1;
        background: #fff;
        border: none;
        border-right: 2px solid var(--header-color);
      }

      .header-full-width.scrolled .header-nav:not(.open) {
        transform: translateX(-100%);
      }

      .header-full-width.scrolled .header-nav.open {
        transform: translateX(0);
      }

      .header-full-width.scrolled .header-nav.open .header-user-mobile,
      .header-full-width.scrolled .header-nav.open .header-notification-sidebar,
      .header-full-width.scrolled .header-nav.open .header-logout-sidebar {
        display: inline-flex !important;
      }

      .header-full-width.scrolled .header-nav.open .header-user-profile {
        display: inline-flex !important;
        font-size: 0.85rem;
        font-weight: 700;
      }

      .header-full-width.scrolled .newspaper-title {
        font-size: 1.15rem;
      }

      .header-full-width.scrolled .newspaper-title::before,
      .header-full-width.scrolled .newspaper-title::after {
        display: none;
      }

      .header-full-width.scrolled .newspaper-date,
      .header-full-width.scrolled .newspaper-price {
        display: none;
      }
    }

    @media (min-width: 900px) and (max-width: 1200px) {
      .header-full-width.scrolled .newspaper-title {
        font-size: 1.5rem;
      }
    }

    @media (min-width: 769px) {
      .header-full-width.scrolled .header-nav.open .header-user-mobile,
      .header-full-width.scrolled .header-nav.open .header-notification-sidebar,
      .header-full-width.scrolled .header-nav.open .header-logout-sidebar,
      .header-full-width.scrolled .header-nav.open .header-notification-nav {
        display: none !important;
      }
    }

    @media (max-width: 480px) {
      .header-container {
        padding: 10px 12px;
      }

      .header-full-width.scrolled .newspaper-title {
        font-size: 1.1rem;
      }

      .menu-icon {
        width: 34px;
        height: 34px;
        font-size: 1.15rem;
      }

      .header-nav a {
        padding: 12px 16px;
      }
    }

    @media (max-width: 768px) {
      .admin-table-header .count {
        font-size: 0.9rem;
      }

      .admin-recipe-tabs {
        align-items: stretch;
        gap: 6px;
        margin-bottom: 15px;
        overflow-x: visible;
      }

      .admin-recipe-tabs a {
        min-width: 0;
        flex: none;
        padding: 8px 10px;
        font-size: 0.65rem;
      }

      .admin-rejection-reason {
        font-size: 0.78rem;
        padding: 10px 12px;
      }

      .admin-cards-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .admin-cards-scroll {
        padding: 15px;
      }

      .admin-recipe-image {
        height: 180px;
      }

      .admin-recipe-content {
        padding: 18px;
      }

      .admin-recipe-content h2 {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 480px) {

      .admin-cards-grid {
        gap: 16px;
      }

      .admin-cards-scroll {
        padding: 5px;
      }

      .admin-recipe-image {
        height: 160px;
      }

      .admin-recipe-content {
        padding: 15px;
      }

      .admin-recipe-content h2 {
        font-size: 1.1rem;
      }

      .admin-btn {
        padding: 9px 12px;
        font-size: 0.78rem;
      }
    }

    @media (max-width: 768px) {
      .minhas-tab:hover {
        color: var(--light-text);
        background: transparent;
      }

      .minha-receita-card:hover {
        box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15);
      }

      .minha-receita-card:hover .minha-receita-imagem img {
        transform: none;
      }

      .btn-ver:hover {
        background: var(--header-color);
        border-color: var(--header-color);
        transform: none;
        box-shadow: none;
      }

      .btn-motivo:hover {
        background: #fff;
        color: #e67e22;
        transform: none;
        box-shadow: none;
      }

      .btn-excluir:hover {
        background: #fff;
        color: var(--rejected-color);
        transform: none;
        box-shadow: none;
      }

      .receita-topbar-back:hover {
        background: transparent;
        color: white;
        border-color: rgba(255, 255, 255, 0.25);
        transform: none;
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
      }

      .tempo-toggle-btn:hover {
        background: #fff;
        color: var(--header-color);
      }

      .tempo-toggle-btn:hover i {
        color: var(--accent-color);
      }

      .file-input-label:hover {
        border-color: rgba(139, 0, 0, 0.3);
        background: #faf8f5;
      }

      .file-input-label:hover .file-input-button {
        background: var(--header-color);
      }

      .submit-button:hover {
        background: var(--header-color);
        color: #fff;
        border: 2px solid var(--header-color);
      }

      #addIngrediente:hover,
      #addPasso:hover {
        color: var(--accent-color);
        background-color: white;
        border: 2px solid var(--accent-color);
      }

      .remove-btn:hover {
        background: var(--rejected-color);
      }

      .tab-button:hover {
        color: var(--light-text);
        background: transparent;
      }

      #aplicarFiltros:hover {
        background: var(--header-color);
      }

      #limparFiltros:hover {
        transform: none;
      }

      .receitas-section .card:hover,
      #favorite-recipes .card:hover {
        transform: none;
        box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15);
      }

      .receitas-section .card-favorite-btn:hover,
      #favorite-recipes .card-favorite-btn:hover {
        background: #fff;
        color: var(--header-color);
      }

      .receitas-section .card-link:hover,
      #favorite-recipes .card-link:hover {
        background: var(--header-color);
        color: #fff;
      }

      .receitas-section .card-link:hover i,
      #favorite-recipes .card-link:hover i {
        transform: none;
      }

      .receitas-section .card-delete:hover,
      #favorite-recipes .card-delete:hover {
        background: #fff;
        color: var(--header-color);
        border-color: var(--header-color);
      }

      .detalhe-topbar-back:hover {
        background: transparent;
        color: white;
        border-color: rgba(255, 255, 255, 0.25);
        transform: none;
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
      }

      .detalhe-favorite-btn:hover,
      .detalhe-print-btn:hover {
        transform: none;
        box-shadow: 3px 3px 0 rgba(139, 0, 0, 0.15);
      }
        
        .receitas-section .card-favorite-btn.active:hover{
            background: var(--favorite-color);
            color: #fff;
        }

      .detalhe-print-btn:hover {
        background: #fff;
        color: var(--light-text);
        border-color: transparent;
        box-shadow: none;
      }

      .detalhe-ingrediente-item:hover {
        border-color: rgba(139, 0, 0, 0.15);
        transform: none;
      }

      .detalhe-preparo-item:hover {
        border-color: rgba(139, 0, 0, 0.15);
        transform: none;
      }

      .classifieds-section .classified-item:hover {
        transform: none;
        box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15);
      }

      .classifieds-section .classified-link:hover {
        background: var(--header-color);
        color: #fff;
      }

      .classifieds-section .classified-link:hover i {
        transform: none;
      }

      .carousel-control:hover {
        background: #fff;
        color: var(--header-color);
        transform: none;
        box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.25);
      }

      .admin-recipe-card:hover {
        box-shadow: 4px 4px 0 rgba(139, 0, 0, 0.15);
      }

      .admin-recipe-card:hover .admin-recipe-image img {
        transform: none;
        filter: saturate(0.95);
      }

      .admin-btn-view:hover {
        background: #fff;
        color: var(--header-color);
        transform: none;
        box-shadow: 2px 2px 0 rgba(139, 0, 0, 0.15);
      }

      .admin-btn-approve:hover {
        background: #fff;
        color: #27ae60;
        transform: none;
        box-shadow: 2px 2px 0 rgba(139, 0, 0, 0.15);
      }

      .admin-btn-reject:hover {
        background: #fff;
        color: var(--rejected-color, #8b0000);
        transform: none;
        box-shadow: 2px 2px 0 rgba(139, 0, 0, 0.15);
      }

      .admin-recipe-tabs a:hover {
        color: var(--light-text);
        background: transparent;
      }

      .action-btn.btn-view:hover {
        transform: none;
      }

      .header-nav a:hover {
        color: white;
        background: transparent;
        border-color: rgba(255, 255, 255, 0.25);
        transform: none;
        box-shadow: none;
      }

      .header-nav a:hover i {
        color: white;
        opacity: 0.9;
      }

      .header-nav a.active:hover {
        color: var(--header-color);
        background: var(--accent-color);
        border-color: var(--accent-color);
        transform: none;
        box-shadow: none;
      }

      .header-user-profile:hover,
      .header-logout-btn:hover,
      .header-notification-btn:hover {
        color: white;
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.25);
        transform: none;
        box-shadow: none;
      }

      .header-full-width.scrolled .menu-icon:hover {
        color: white;
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .header-nav.open .header-nav-close:hover {
        opacity: 0.7;
        transform: none;
      }

      .header-full-width.scrolled .header-nav.open > a:hover {
        color: var(--header-color);
        background: transparent;
        border-color: var(--header-color);
      }

      .header-full-width.scrolled .header-nav.open > a:hover i {
        color: var(--header-color);
      }

      .header-full-width.scrolled .header-nav.open .header-user-profile:hover {
        color: var(--header-color);
        background: transparent;
        border-color: var(--header-color);
        transform: none;
        box-shadow: none;
      }

      .header-full-width.scrolled .header-nav.open .header-user-profile:hover i,
      .header-full-width.scrolled .header-nav.open .header-user-profile:hover span {
        color: var(--header-color);
      }

      .header-nav .header-user-profile:hover,
      .header-nav .header-user-mobile:hover,
      .header-nav .header-notification-sidebar:hover,
      .header-nav .header-logout-sidebar:hover {
        color: var(--header-color);
        background: transparent;
        border-color: var(--header-color);
      }

      .header-nav .header-user-profile:hover i,
      .header-nav .header-user-profile:hover span,
      .header-nav .header-user-mobile:hover i,
      .header-nav .header-notification-sidebar:hover i,
      .header-nav .header-logout-sidebar:hover i {
        color: var(--header-color);
      }

      .menu-icon:hover {
        color: white;
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .admin-sidebar-nav a:hover {
        color: var(--header-color);
        background: transparent;
        border-color: var(--header-color);
      }

      .admin-sidebar-nav a:hover i {
        color: var(--header-color);
      }

      .admin-sidebar-btn:hover {
        color: var(--header-color);
        background: transparent;
        border-color: var(--header-color);
      }

      .admin-sidebar-btn:hover i {
        color: var(--header-color);
      }

      .admin-sidebar-btn-sair:hover,
      .admin-sidebar-btn-sair:hover i {
        color: var(--header-color);
        background: transparent;
        border-color: var(--header-color);
      }

      .admin-sidebar-toggle:hover {
        color: white;
        background: none;
        border-color: white;
      }
    }
  `;

    document.head.appendChild(style);
}

function adjustLayoutForScreenSize() {
    const width = window.innerWidth;

    const receitasContainer = document.getElementById('all-recipes');
    if (receitasContainer) {
        if (width <= 480) {
            receitasContainer.style.gridTemplateColumns = '1fr';
        } else if (width <= 768) {
            receitasContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else if (width <= 1024) {
            receitasContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            receitasContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
        }
    }

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        if (width <= 480) {
            carouselContainer.style.height = '250px';
        } else if (width <= 768) {
            carouselContainer.style.height = '350px';
        } else if (width <= 1024) {
            carouselContainer.style.height = '400px';
        } else {
            carouselContainer.style.height = '500px';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    applyResponsiveStyles();
    adjustLayoutForScreenSize();

    window.addEventListener('resize', adjustLayoutForScreenSize);

    window.addEventListener('load', applyResponsiveStyles);
});

function showPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.remove('hidden');
        loader.style.display = 'flex';
    }
}

function hidePageLoader() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    showPageLoader();

    window.addEventListener('load', function () {
        setTimeout(hidePageLoader, 600);
    });

    setTimeout(hidePageLoader, 3000);
});

document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.includes('#') &&
        link.href.startsWith(window.location.origin) &&
        !link.hasAttribute('target')) {
        showPageLoader();
    }
});

function updateCategoryCounts() {
    const salgadosCards = document.querySelectorAll('#salgados-recipes .card');
    const docesCards = document.querySelectorAll('#doces-recipes .card');

    const salgadosCount = document.getElementById('salgados-count');
    const docesCount = document.getElementById('doces-count');
    const noRecipesMessage = document.getElementById('no-recipes-message');

    if (salgadosCount) {
        salgadosCount.textContent = `${salgadosCards.length} receita${salgadosCards.length !== 1 ? 's' : ''}`;
    }

    if (docesCount) {
        docesCount.textContent = `${docesCards.length} receita${docesCards.length !== 1 ? 's' : ''}`;
    }

    if (noRecipesMessage) {
        const totalReceitas = salgadosCards.length + docesCards.length;
        noRecipesMessage.style.display = totalReceitas === 0 ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setTimeout(updateCategoryCounts, 500);
});