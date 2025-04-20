/**
 * Funções JavaScript comuns para o Dashboard da Kolibra Solutions
 */

// Verificar autenticação
function checkAuth() {
    if (!localStorage.getItem('kolibra_logged_in') && !sessionStorage.getItem('kolibra_logged_in')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Definir nome do usuário
function setUserInfo() {
    const username = localStorage.getItem('kolibra_username') || sessionStorage.getItem('kolibra_username') || 'Admin';
    document.getElementById('user-name').textContent = username;
    document.getElementById('user-avatar').textContent = username.charAt(0).toUpperCase();
}

// Configurar toggle da sidebar
function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
        });
    }
}

// Configurar submenus
function setupSubmenus() {
    const menuItems = document.querySelectorAll('.menu-item[data-toggle]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const submenuId = this.getAttribute('data-toggle');
            this.classList.toggle('expanded');
        });
    });
}

// Configurar logout
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('kolibra_logged_in');
        localStorage.removeItem('kolibra_username');
        sessionStorage.removeItem('kolibra_logged_in');
        sessionStorage.removeItem('kolibra_username');
        window.location.href = 'login.html';
    });
}

// Gerar logo placeholder se a imagem não existir
function setupLogoPlaceholder() {
    const logoPlaceholder = document.getElementById('logo-placeholder');
    logoPlaceholder.onerror = function() {
        this.onerror = null;
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDAgMTBDMjMuNDMgMTAgMTAgMjMuNDMgMTAgNDBDMTAgNTYuNTcgMjMuNDMgNzAgNDAgNzBDNTYuNTcgNzAgNzAgNTYuNTcgNzAgNDBDNzAgMjMuNDMgNTYuNTcgMTAgNDAgMTBaIiBmaWxsPSIjMDA0NDk0Ii8+PHBhdGggZD0iTTUwIDI1TDMwIDQwTDUwIDU1VjI1WiIgZmlsbD0iI0ZGN0YwMCIvPjwvc3ZnPg==';
    };
}

// Configurar navegação entre páginas
function setupNavigation() {
    document.querySelectorAll('.menu-item, .submenu-item, .quick-action').forEach(item => {
        if (item.dataset.page) {
            item.addEventListener('click', function() {
                const page = this.dataset.page;
                if (page === 'dashboard') {
                    window.location.href = 'dashboard.html';
                } else if (page === 'registro-vendas') {
                    window.location.href = 'registro-vendas.html';
                } else if (page === 'metas') {
                    window.location.href = 'metas.html';
                } else {
                    // Mostrar mensagem para páginas não implementadas
                    alert('Esta funcionalidade está em desenvolvimento e será implementada em breve.');
                }
            });
        } else {
            // Adicionar alerta para itens de menu sem página definida
            if (!item.classList.contains('menu-item') || !item.hasAttribute('data-toggle')) {
                item.addEventListener('click', function(e) {
                    alert('Esta funcionalidade está em desenvolvimento e será implementada em breve.');
                });
            }
        }
    });
}

// Inicializar componentes comuns
function initCommonComponents() {
    if (!checkAuth()) return;
    
    setUserInfo();
    setupSidebar();
    setupSubmenus();
    setupLogout();
    setupLogoPlaceholder();
    setupNavigation();
}

// Formatar valor monetário
function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Obter data atual formatada para input date
function getCurrentDateFormatted() {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
}

// Calcular data futura (em dias)
function getFutureDateFormatted(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// Mostrar alerta
function showAlert(message, type = 'success', duration = 3000) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type}`;
    alertContainer.style.position = 'fixed';
    alertContainer.style.top = '20px';
    alertContainer.style.right = '20px';
    alertContainer.style.zIndex = '9999';
    alertContainer.style.minWidth = '300px';
    alertContainer.style.padding = '15px 20px';
    alertContainer.style.borderRadius = '10px';
    alertContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    alertContainer.style.opacity = '0';
    alertContainer.style.transform = 'translateY(-20px)';
    alertContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    alertContainer.textContent = message;
    
    document.body.appendChild(alertContainer);
    
    // Mostrar alerta com animação
    setTimeout(() => {
        alertContainer.style.opacity = '1';
        alertContainer.style.transform = 'translateY(0)';
    }, 10);
    
    // Remover alerta após duração
    setTimeout(() => {
        alertContainer.style.opacity = '0';
        alertContainer.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            document.body.removeChild(alertContainer);
        }, 300);
    }, duration);
}

// Exportar funções
window.KolibraUtils = {
    checkAuth,
    setUserInfo,
    setupSidebar,
    setupSubmenus,
    setupLogout,
    setupLogoPlaceholder,
    setupNavigation,
    initCommonComponents,
    formatCurrency,
    formatDate,
    getCurrentDateFormatted,
    getFutureDateFormatted,
    showAlert
};
