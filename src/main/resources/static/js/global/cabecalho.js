function verificarUsuarioAutenticado() {
    const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
    const estaLogado = nomeUsuarioElement && nomeUsuarioElement.textContent.trim();

    if (estaLogado) {
        const userIcon = document.getElementById('userIcon');

        if (userIcon) {
            userIcon.style.cursor = 'pointer';
            userIcon.title = 'Ver meu perfil';
        }
    }
}

function configurarIconeUsuario() {
    const userIcon = document.getElementById('userIcon');
    const nomeUsuarioElement = document.querySelector('.newspaper-subtitle span');
    const estaLogado = nomeUsuarioElement && nomeUsuarioElement.textContent.trim();

    if (userIcon && estaLogado) {
        userIcon.style.display = 'inline-flex';
        userIcon.style.cursor = 'pointer';
        userIcon.title = 'Ver meu perfil';

        userIcon.onclick = function () {
            abrirModalUsuarioSimples();
        };

    } else if (userIcon) {
        userIcon.style.display = 'none';
    }
}

function setupStickyHeader() {
    const header = document.querySelector('.header-full-width');
    const contentWrapper = document.querySelector('.content-wrapper');

    if (!header || !contentWrapper) return;

    const OFFSET = 65; 

    let ultimaAltura = 0;

    function updateHeaderPadding() {
        const alturaAtual = header.offsetHeight;

        if (alturaAtual === ultimaAltura) return;

        ultimaAltura = alturaAtual;

        contentWrapper.style.marginTop = (alturaAtual - OFFSET) + 'px';
    }

    function handleScroll() {
        const scrollTop =
            window.pageYOffset ||
            document.documentElement.scrollTop;

        if (scrollTop > 150) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        requestAnimationFrame(updateHeaderPadding);
    }

    updateHeaderPadding();

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(updateHeaderPadding);
    }

    window.addEventListener('load', updateHeaderPadding);

    let resizeTimeout;

    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(
            updateHeaderPadding,
            200
        );
    });

    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {

            window.requestAnimationFrame(function () {
                handleScroll();
                ticking = false;
            });

            ticking = true;
        }
    });

    header.addEventListener('transitionend', function (e) {
        if (
            e.propertyName === 'padding-top' ||
            e.propertyName === 'padding' ||
            e.propertyName === 'padding-bottom'
        ) {
            requestAnimationFrame(updateHeaderPadding);
        }
    });

    if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(updateHeaderPadding);
        observer.observe(header);
    }

    setTimeout(
        updateHeaderPadding,
        100
    );
}

function detectMobile() {
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
            .test(navigator.userAgent)
    ) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.add('desktop-device');
    }
}


function setupCabecalhoCliente() {
    const titleElement = document.querySelector('.newspaper-title');

    if (titleElement && window.innerWidth > 828) {

        const originalTitle = titleElement.textContent.trim();

        titleElement.textContent = '';

        let charIndex = 0;

        function typeTitle() {
            if (charIndex < originalTitle.length) {

                titleElement.textContent +=
                    originalTitle.charAt(charIndex);

                charIndex++;

                setTimeout(typeTitle, 150);
            }
        }

        typeTitle();
    }

    const dateElement =
        document.getElementById('newspaperDate');

    if (dateElement) {
        const today = new Date();

        const meses = [
            'janeiro',
            'fevereiro',
            'março',
            'abril',
            'maio',
            'junho',
            'julho',
            'agosto',
            'setembro',
            'outubro',
            'novembro',
            'dezembro'
        ];

        const dia = today.getDate();
        const mes = meses[today.getMonth()];
        const ano = today.getFullYear();

        dateElement.textContent =
            `${dia} de ${mes} de ${ano}`;
    }

    verificarUsuarioAutenticado();
    configurarIconeUsuario();
    setupStickyHeader();
    detectMobile();
}


function toggleSidebarCliente() {
    const nav =
        document.getElementById('headerNav');

    const overlay =
        document.getElementById('headerNavOverlay');

    if (nav) {

        const isOpening =
            !nav.classList.contains('open');

        nav.classList.toggle('open');

        if (overlay) {
            overlay.classList.toggle('open');
        }

        if (isOpening) {

            const scrollbarWidth =
                window.innerWidth -
                document.documentElement.clientWidth;

            document.body.style.overflow = 'hidden';

            document.body.style.paddingRight =
                scrollbarWidth + 'px';

        } else {

            document.body.style.overflow = 'auto';

            document.body.style.paddingRight = '';
        }
    }
}

function closeSidebarCliente() {
    const nav =
        document.getElementById('headerNav');

    const overlay =
        document.getElementById('headerNavOverlay');

    if (nav) {

        nav.classList.remove('open');

        if (overlay) {
            overlay.classList.remove('open');
        }

        document.body.style.overflow = 'auto';

        document.body.style.paddingRight = '';
    }
}

function setupSidebarCliente() {
    const menuToggle =
        document.getElementById('menuToggle');

    const overlay =
        document.getElementById('headerNavOverlay');

    const closeBtn =
        document.getElementById('headerNavClose');

    if (menuToggle) {
        menuToggle.addEventListener(
            'click',
            toggleSidebarCliente
        );
    }

    if (overlay) {
        overlay.addEventListener(
            'click',
            closeSidebarCliente
        );
    }

    if (closeBtn) {
        closeBtn.addEventListener(
            'click',
            closeSidebarCliente
        );
    }
}

function abrirSidebarAdmin() {
    const sidebar =
        document.getElementById('adminSidebar');

    const overlay =
        document.getElementById('adminSidebarOverlay');

    const toggle =
        document.getElementById('adminSidebarToggle');

    if (!sidebar) return;

    sidebar.classList.add('open');

    if (overlay) {
        overlay.classList.add('open');
    }

    if (toggle) {
        toggle.classList.add('hidden');
    }

    document.body.style.overflow = 'hidden';
}

function fecharSidebarAdmin() {
    const sidebar =
        document.getElementById('adminSidebar');

    const overlay =
        document.getElementById('adminSidebarOverlay');

    const toggle =
        document.getElementById('adminSidebarToggle');

    if (!sidebar) return;

    sidebar.classList.remove('open');

    if (overlay) {
        overlay.classList.remove('open');
    }

    if (toggle) {
        toggle.classList.remove('hidden');
    }

    document.body.style.overflow = 'auto';
}

function setupSidebarAdmin() {
    const toggle =
        document.getElementById('adminSidebarToggle');

    const overlay =
        document.getElementById('adminSidebarOverlay');

    const closeBtn =
        document.getElementById('adminSidebarClose');

    if (toggle) {
        toggle.addEventListener(
            'click',
            abrirSidebarAdmin
        );
    }

    if (overlay) {
        overlay.addEventListener(
            'click',
            fecharSidebarAdmin
        );
    }

    if (closeBtn) {
        closeBtn.addEventListener(
            'click',
            fecharSidebarAdmin
        );
    }

    const links =
        document.querySelectorAll(
            '.admin-sidebar-nav a'
        );

    links.forEach(link => {
        link.addEventListener(
            'click',
            function () {
                if (window.innerWidth <= 768) {
                    fecharSidebarAdmin();
                }
            }
        );
    });
}


let quantidadeNotificacoesAnterior = null;
let ultimoIdNotificacao = null;

async function atualizarContadorNotificacoes() {
    const badge =
        document.getElementById('notificationBadge');

    const navBadge =
        document.getElementById('notificationNavBadge');

    const sidebarBadge =
        document.getElementById('notificationSidebarBadge');

    if (
        !badge &&
        !navBadge &&
        !sidebarBadge
    ) {
        return;
    }

    try {
        const response =
            await fetch('/api/notificacoes/contador');

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        const quantidade =
            Number(data.quantidade || 0);

        const responseNotificacoes =
            await fetch('/api/notificacoes');

        if (responseNotificacoes.ok) {
            const dataNotificacoes =
                await responseNotificacoes.json();

            const notificacoes =
                dataNotificacoes.notificacoes || [];

            if (notificacoes.length > 0) {
                const maiorId =
                    Math.max(
                        ...notificacoes.map(notificacao =>
                            Number(notificacao.id)
                        )
                    );

                if (ultimoIdNotificacao !== null) {
                    const novasNotificacoes =
                        notificacoes.filter(
                            notificacao =>
                                Number(notificacao.id) >
                                ultimoIdNotificacao
                        );

                    const possuiNotificacaoQueDeveAvisar =
                        novasNotificacoes.some(
                            notificacao =>
                                notificacao.tipo !== 'FAVORITOU' &&
                                notificacao.tipo !== 'DESFAVORITOU'
                        );

                    if (possuiNotificacaoQueDeveAvisar) {
                        mostrarNovaNotificacao();
                    }
                }

                ultimoIdNotificacao = maiorId;
            }
        }

        quantidadeNotificacoesAnterior =
            quantidade;

        const texto =
            quantidade > 99
                ? '99+'
                : quantidade;

        if (quantidade > 0) {
            if (badge) {
                badge.textContent = texto;
                badge.style.display = 'flex';
            }

            if (navBadge) {
                navBadge.textContent = texto;
                navBadge.style.display = 'inline-flex';
            }

            if (sidebarBadge) {
                sidebarBadge.textContent = texto;
                sidebarBadge.style.display = 'inline-flex';
            }
        } else {
            if (badge) {
                badge.style.display = 'none';
            }

            if (navBadge) {
                navBadge.style.display = 'none';
            }

            if (sidebarBadge) {
                sidebarBadge.style.display = 'none';
            }
        }
    } catch (error) {
        console.error(
            'Erro ao buscar notificações:',
            error
        );
    }
}

function mostrarNotificacaoPerfil(message, type) {
    const notif =
        document.createElement('div');

    notif.className =
        `user-notification ${type}`;

    notif.innerHTML =
        type === 'success'
            ? `<i class="fas fa-check-circle"></i> ${message}`
            : `<i class="fas fa-exclamation-circle"></i> ${message}`;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('show');
    }, 10);

    setTimeout(() => {
        notif.classList.remove('show');

        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 3000);
}

function mostrarNovaNotificacao() {
    const notif =
        document.createElement('div');

    notif.className =
        'user-notification nova-notificacao';

    notif.innerHTML = `
        <i class="fas fa-bell"></i>
        Nova notificação
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('show');
    }, 10);

    setTimeout(() => {

        notif.classList.remove('show');

        setTimeout(() => {
            notif.remove();
        }, 300);

    }, 3000);
}

async function carregarNotificacoes() {
    const body =
        document.getElementById('notificacoesModalBody');

    const loader =
        body?.querySelector('.modal-loader');

    if (!body) return;

    if (loader) {
        loader.classList.remove('is-hidden');
    }

    try {
        const response =
            await fetch('/api/notificacoes');

        if (!response.ok) {
            throw new Error('Erro ao buscar notificações');
        }

        const data =
            await response.json();

        const notificacoes =
            data.notificacoes || [];

        body.querySelectorAll(
            '.notificacao-item, .notificacoes-vazia'
        ).forEach(elemento => elemento.remove());

        if (notificacoes.length === 0) {
            const vazia =
                document.createElement('div');

            vazia.className =
                'notificacoes-vazia';

            vazia.innerHTML = `
                <i class="fas fa-bell-slash"></i>
                <h3>Nenhuma notificação</h3>
                <p>Você não possui novas notificações.</p>
            `;

            body.appendChild(vazia);
        } else {
            notificacoes.forEach(notificacao => {
                const item =
                    document.createElement('div');

                item.className =
                    'notificacao-item';

                if (!notificacao.lida) {
                    item.classList.add('nao-lida');
                }

                const icone =
                    obterIconeNotificacao(
                        notificacao.tipo
                    );

                const dataFormatada =
                    formatarDataNotificacao(
                        notificacao.dataHora
                    );

                item.innerHTML = `
                    <div class="notificacao-icon">
                        <i class="${icone}"></i>
                    </div>

                    <div class="notificacao-info">
                        <p class="notificacao-mensagem">
                            ${escaparHtml(notificacao.mensagem)}
                        </p>

                        <span class="notificacao-data">
                            ${dataFormatada}
                        </span>
                    </div>

                    ${
                        !notificacao.lida
                            ? '<span class="notificacao-nao-lida-indicador"></span>'
                            : ''
                    }
                `;

                if (!notificacao.lida) {
                    item.addEventListener(
                        'click',
                        function () {
                            marcarNotificacaoComoLida(
                                notificacao.id,
                                item
                            );
                        }
                    );
                }

                body.appendChild(item);
            });
        }

    } catch (error) {
        console.error(
            'Erro ao carregar notificações:',
            error
        );

        body.querySelectorAll(
            '.notificacao-item, .notificacoes-vazia'
        ).forEach(elemento => elemento.remove());

        const erro =
            document.createElement('div');

        erro.className =
            'notificacoes-vazia';

        erro.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Erro ao carregar</h3>
            <p>Não foi possível carregar suas notificações.</p>
        `;

        body.appendChild(erro);

    } finally {
        if (loader) {
            loader.classList.add('is-hidden');
        }
    }
}

function obterIconeNotificacao(tipo) {
    switch (tipo) {

        case 'FAVORITOU':
            return 'fas fa-heart';

        case 'DESFAVORITOU':
            return 'fas fa-heart-broken';

        case 'NOVA_RECEITA':
            return 'fas fa-utensils';

        case 'RECEITA_APROVADA':
            return 'fas fa-check-circle';

        case 'RECEITA_REJEITADA':
            return 'fas fa-times-circle';

        default:
            return 'fas fa-bell';
    }
}

function formatarDataNotificacao(dataHora) {
    if (!dataHora) return '';

    const data =
        new Date(dataHora);

    if (Number.isNaN(data.getTime())) {
        return '';
    }

    return data.toLocaleString(
        'pt-BR',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    );
}

function escaparHtml(texto) {
    const div =
        document.createElement('div');

    div.textContent =
        texto || '';

    return div.innerHTML;
}


async function excluirTodasNotificacoes() {
    try {
        const response = await fetch('/api/notificacoes/excluir-todas', {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir notificações');
        }

        await carregarNotificacoes();
        await atualizarContadorNotificacoes();

        mostrarNotificacaoPerfil(
            'Todas as notificações foram excluídas',
            'success'
        );

    } catch (error) {
        console.error('Erro ao excluir todas as notificações:', error);

        mostrarNotificacaoPerfil(
            'Erro ao excluir notificações',
            'error'
        );
    }
}

async function marcarNotificacaoComoLida(
    id,
    elemento
) {
    try {

        const response =
            await fetch(
                `/api/notificacoes/${id}/ler`,
                {
                    method: 'PATCH'
                }
            );

        if (!response.ok) {
            throw new Error(
                'Erro ao marcar notificação como lida'
            );
        }

        elemento.classList.remove(
            'nao-lida'
        );

        const indicador =
            elemento.querySelector(
                '.notificacao-nao-lida-indicador'
            );

        if (indicador) {
            indicador.remove();
        }

        await atualizarContadorNotificacoes();

    } catch (error) {

        console.error(
            'Erro ao marcar notificação como lida:',
            error
        );
    }
}

async function marcarTodasNotificacoesComoLidas() {
    try {

        const response =
            await fetch(
                '/api/notificacoes/ler-todas',
                {
                    method: 'PATCH'
                }
            );

        if (!response.ok) {
            throw new Error(
                'Erro ao marcar notificações como lidas'
            );
        }

        await carregarNotificacoes();
        await atualizarContadorNotificacoes();

    } catch (error) {

        console.error(
            'Erro ao marcar todas as notificações como lidas:',
            error
        );
    }
}

function configurarNotificacoes() {
    const botaoDesktop =
        document.getElementById(
            'notificationButton'
        );

    const botaoSidebar =
        document.querySelector(
            '.header-notification-sidebar'
        );

    const modal =
        document.getElementById(
            'notificacoesModal'
        );

    const fechar =
        document.getElementById(
            'notificacoesModalClose'
        );

    const marcarTodas =
        document.getElementById(
            'marcarTodasNotificacoes'
        );

    const excluirTodas =
    document.getElementById(
        'excluirTodasNotificacoes'
    );

    if (!modal) return;

    async function abrirNotificacoes(event) {

        if (event) {
            event.preventDefault();
        }

        modal.classList.add('show');

        document.body.style.overflow =
            'hidden';

        await carregarNotificacoes();
        await atualizarContadorNotificacoes();
    }

    function fecharNotificacoes() {

        modal.classList.remove('show');

        document.body.style.overflow =
            'auto';
    }

    if (botaoDesktop) {
        botaoDesktop.addEventListener(
            'click',
            abrirNotificacoes
        );
    }

    if (botaoSidebar) {
        botaoSidebar.addEventListener(
            'click',
            abrirNotificacoes
        );
    }

    if (fechar) {
        fechar.addEventListener(
            'click',
            fecharNotificacoes
        );
    }

    if (marcarTodas) {
        marcarTodas.addEventListener(
            'click',
            marcarTodasNotificacoesComoLidas
        );
    }

    if (excluirTodas) {
        excluirTodas.addEventListener(
            'click',
            excluirTodasNotificacoes
        );
    }

    modal.addEventListener(
        'click',
        function (event) {
            if (event.target === modal) {
                fecharNotificacoes();
            }
        }
    );

    atualizarContadorNotificacoes();
}

function openAdminPerfilModal() {
    const modal =
        document.getElementById(
            'adminPerfilModal'
        );

    if (!modal) return;

    const erro =
        document.getElementById(
            'adminPerfilErro'
        );

    erro.style.display =
        'none';

    fetch('/perfil/usuario-logado')
        .then(r => r.json())
        .then(data => {

            document.getElementById(
                'adminPerfilNome'
            ).value =
                data.usuario.nome || '';

            document.getElementById(
                'adminPerfilEmail'
            ).value =
                data.usuario.email || '';

            document.getElementById(
                'adminPerfilSenha'
            ).value = '';

            document.getElementById(
                'adminPerfilConfirmarSenha'
            ).value = '';

            modal.style.display =
                'block';

            document.body.style.overflow =
                'hidden';
        })
        .catch(() => {

            erro.textContent =
                'Erro ao carregar dados do perfil.';

            erro.style.display =
                'block';
        });
}

function closeAdminPerfilModal() {
    const modal =
        document.getElementById(
            'adminPerfilModal'
        );

    if (!modal) return;

    modal.style.display =
        'none';

    document.body.style.overflow =
        'auto';
}

function salvarAdminPerfil(event) {
    event.preventDefault();

    const nome =
        document.getElementById(
            'adminPerfilNome'
        ).value.trim();

    const email =
        document.getElementById(
            'adminPerfilEmail'
        ).value.trim();

    const senha =
        document.getElementById(
            'adminPerfilSenha'
        ).value;

    const confirmarSenha =
        document.getElementById(
            'adminPerfilConfirmarSenha'
        ).value;

    const erro =
        document.getElementById(
            'adminPerfilErro'
        );

    if (
        senha &&
        senha !== confirmarSenha
    ) {
        erro.textContent =
            'As senhas não coincidem.';

        erro.style.display =
            'block';

        return;
    }

    const dados = {
        nome,
        email
    };

    if (senha) {
        dados.senha = senha;
        dados.confirmarSenha =
            confirmarSenha;
    }

    fetch('/perfil/editar', {
        method: 'POST',
        headers: {
            'Content-Type':
                'application/json'
        },
        body: JSON.stringify(dados)
    })
        .then(r => r.json())
        .then(data => {

            if (
                data.message &&
                data.message.includes('sucesso')
            ) {

                closeAdminPerfilModal();

                sessionStorage.setItem(
                    'perfilAtualizado',
                    '1'
                );

                window.location.reload();

            } else {

                erro.textContent =
                    data.message ||
                    'Erro ao salvar.';

                erro.style.display =
                    'block';
            }
        })
        .catch(() => {

            erro.textContent =
                'Erro ao salvar.';

            erro.style.display =
                'block';
        });
}


function configurarLoaderNavegacao() {
    const elementos = document.querySelectorAll(
        '.header-full-width a, .header-full-width button, .header-full-width [role="button"], .admin-sidebar a, .admin-sidebar button, .admin-sidebar [role="button"], .sidebar a, .sidebar button, .sidebar [role="button"]'
    );

    elementos.forEach(elemento => {
        if (elemento.dataset.loaderConfigurado) return;

        elemento.dataset.loaderConfigurado = 'true';

        elemento.addEventListener('click', function (event) {

          if (
            elemento.classList.contains('sidebar-close') ||
            elemento.classList.contains('header-nav-close') ||
            elemento.classList.contains('admin-sidebar-close') ||
            elemento.id === 'menuToggle' ||
            elemento.id === 'adminSidebarToggle' ||
            elemento.id === 'notificationButton' ||
            elemento.onclick?.toString().includes('openLogoutModal') ||
            elemento.onclick?.toString().includes('openAdminPerfilModal') ||
            elemento.onclick?.toString().includes('abrirModalUsuarioSimples') ||
            elemento.getAttribute('onclick')?.includes('openLogoutModal') ||
            elemento.getAttribute('onclick')?.includes('openAdminPerfilModal') ||
            elemento.getAttribute('onclick')?.includes('abrirModalUsuarioSimples')
        ) {
            return;
        }

            const link = elemento.closest('a');

            if (link && link.getAttribute('href') === '#') {
                return;
            }

            sessionStorage.setItem('page-loader-force', 'true');

            const icon = elemento.querySelector('i');

            if (icon) {
                icon.dataset.loaderOriginalClass = icon.className;
                icon.className = 'fas fa-spinner fa-spin';
            } else {
                elemento.dataset.loaderOriginalContent = elemento.innerHTML;
                elemento.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }

            elemento.style.pointerEvents = 'none';
        });
    });
}

function verificarNotificacaoPerfil() {
    if (
        sessionStorage.getItem(
            'perfilAtualizado'
        ) === '1'
    ) {

        sessionStorage.removeItem(
            'perfilAtualizado'
        );

        setTimeout(() => {

            const notif =
                document.createElement('div');

            notif.className =
                'user-notification success';

            notif.innerHTML =
                '<i class="fas fa-check-circle"></i> Perfil atualizado com sucesso!';

            document.body.appendChild(notif);

            setTimeout(() => {
                notif.classList.add('show');
            }, 10);

            setTimeout(() => {

                notif.classList.remove('show');

                setTimeout(() => {
                    notif.remove();
                }, 300);

            }, 3000);

        }, 300);
    }
}

document.addEventListener(
    'click',
    function (e) {

        const modal =
            document.getElementById(
                'adminPerfilModal'
            );

        if (e.target === modal) {
            closeAdminPerfilModal();
        }
    }
);

document.addEventListener(
    'keydown',
    function (e) {

        if (e.key === 'Escape') {

            closeSidebarCliente();
            fecharSidebarAdmin();
            closeAdminPerfilModal();
        }
    }
);

document.addEventListener(
    'DOMContentLoaded',
    function () {
        const isAdmin =
            document.querySelector(
                '.admin-sidebar'
            );

        if (isAdmin) {
            setupSidebarAdmin();
        } else {
            setupCabecalhoCliente();
            setupSidebarCliente();
        }

        configurarNotificacoes();
        configurarLoaderNavegacao();
        verificarNotificacaoPerfil();
    }
);