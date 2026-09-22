(function () {

    const INTERVALO_POLLING_MS = 5000;

    function obterIdReceita(card) {
        return card
            .querySelector('.card-favorite-btn')
            ?.dataset.recipeId;
    }

    function obterDadosReceita(card) {
        return {
            id: obterIdReceita(card),
            html: card.querySelector('.card-content')?.innerHTML || '',
            imagem: card.querySelector('.card-image img')?.getAttribute('src') || ''
        };
    }

    function atualizarListaReceitas(elementoAtual, elementoNovo) {

        const cardsAtuais = new Map();

        elementoAtual.querySelectorAll('.card').forEach(card => {

            const id = obterIdReceita(card);

            if (id) {
                cardsAtuais.set(id, card);
            }

        });

        const cardsNovos = [
            ...elementoNovo.querySelectorAll('.card')
        ];

        const idsNovos = new Set();

        cardsNovos.forEach(cardNovo => {

            const id = obterIdReceita(cardNovo);

            if (!id) return;

            idsNovos.add(id);

            const cardAtual = cardsAtuais.get(id);

            if (!cardAtual) {

                elementoAtual.appendChild(
                    cardNovo.cloneNode(true)
                );

                return;
            }

            const dadosAtuais = obterDadosReceita(cardAtual);
            const dadosNovos = obterDadosReceita(cardNovo);

            if (
                dadosAtuais.html !== dadosNovos.html ||
                dadosAtuais.imagem !== dadosNovos.imagem
            ) {

                const favoritoAtivo = cardAtual
                    .querySelector('.card-favorite-btn')
                    ?.classList.contains('active');

                cardAtual.innerHTML = cardNovo.innerHTML;

                const novoBotaoFavorito = cardAtual
                    .querySelector('.card-favorite-btn');

                if (favoritoAtivo && novoBotaoFavorito) {
                    novoBotaoFavorito.classList.add('active');
                }

            }

        });

        cardsAtuais.forEach((card, id) => {

            if (!idsNovos.has(id)) {
                card.remove();
            }

        });

    }

    async function atualizarSilenciosamente() {

        try {

            const response = await fetch(window.location.href, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) return;

            const htmlText = await response.text();

            const parser = new DOMParser();
            const novoDoc = parser.parseFromString(
                htmlText,
                'text/html'
            );

            let houveAlteracao = false;

            const listas = [
                'salgados-recipes',
                'doces-recipes'
            ];

            listas.forEach(id => {

                const elementoAtual = document.getElementById(id);
                const elementoNovo = novoDoc.getElementById(id);

                if (!elementoAtual || !elementoNovo) return;

                const estadoAtual = [
                    ...elementoAtual.querySelectorAll('.card')
                ].map(obterDadosReceita);

                const estadoNovo = [
                    ...elementoNovo.querySelectorAll('.card')
                ].map(obterDadosReceita);

                if (
                    JSON.stringify(estadoAtual) !==
                    JSON.stringify(estadoNovo)
                ) {

                    atualizarListaReceitas(
                        elementoAtual,
                        elementoNovo
                    );

                    houveAlteracao = true;

                }

            });

            const elementosSimples = [
                'salgados-count',
                'doces-count',
                'salgados-empty',
                'doces-empty',
                'no-recipes-message'
            ];

            elementosSimples.forEach(id => {

                const elementoAtual =
                    document.getElementById(id);

                const elementoNovo =
                    novoDoc.getElementById(id);

                if (!elementoAtual || !elementoNovo) return;

                if (
                    elementoAtual.innerHTML.trim() !==
                    elementoNovo.innerHTML.trim()
                ) {

                    elementoAtual.innerHTML =
                        elementoNovo.innerHTML;

                    houveAlteracao = true;

                }

            });

                      const carrosselAtual = document.querySelector('.carousel-inner');
            const carrosselNovo = novoDoc.querySelector('.carousel-inner');

            if (carrosselAtual && carrosselNovo) {

                const itensAtuais = [
                    ...carrosselAtual.querySelectorAll('.carousel-item')
                ].map(item => ({
                    html: item.innerHTML.trim(),
                    img: item.querySelector('img')?.getAttribute('src') || ''
                }));

                const itensNovos = [
                    ...carrosselNovo.querySelectorAll('.carousel-item')
                ].map(item => ({
                    html: item.innerHTML.trim(),
                    img: item.querySelector('img')?.getAttribute('src') || ''
                }));

                if (JSON.stringify(itensAtuais) !== JSON.stringify(itensNovos)) {

                    const indicadorAtivo = document.querySelector('.carousel-indicator.active');
                    const indicadoresTodos = document.querySelectorAll('.carousel-indicator');
                    const indiceAtual = Array.from(indicadoresTodos).indexOf(indicadorAtivo);

                    carrosselAtual.innerHTML = carrosselNovo.innerHTML;

                    const indicadoresAtual = document.querySelector('.carousel-indicators');
                    const indicadoresNovo = novoDoc.querySelector('.carousel-indicators');

                    if (indicadoresAtual && indicadoresNovo) {
                        indicadoresAtual.innerHTML = indicadoresNovo.innerHTML;
                    }

                    if (typeof initializeCarousel === 'function') {
                        initializeCarousel(indiceAtual >= 0 ? indiceAtual : 0);
                    }

                    houveAlteracao = true;

                }

            }

            if (houveAlteracao) {

                if (typeof initImageLoaders === 'function') {
                    initImageLoaders();
                }

                document.dispatchEvent(
                    new CustomEvent('pollingUpdated', {
                        detail: {
                            document: novoDoc
                        }
                    })
                );

            }

        } catch (error) {

            console.error(
                'Erro durante o polling:',
                error
            );

        }

    }

    setInterval(
        atualizarSilenciosamente,
        INTERVALO_POLLING_MS
    );

})();