/**
 * Funções para gerenciar os gráficos do dashboard da Kolibra Solutions
 */

// Inicializar gráficos do dashboard
function initDashboardCharts() {
    // Verificar se há dados de vendas
    const vendas = getVendas();
    
    if (vendas.length === 0) {
        // Se não houver vendas, mostrar mensagens de "sem dados"
        document.querySelectorAll('.no-data-message').forEach(el => {
            el.style.display = 'flex';
        });
        
        // Ocultar gráficos
        document.querySelectorAll('.chart-container canvas').forEach(el => {
            el.style.display = 'none';
        });
        
        // Atualizar estatísticas com valores zerados
        updateDashboardStats({
            receitaTotal: 0,
            vendasTotal: 0,
            clientesAtivos: 0,
            projetosAtivos: 0
        });
        
        return;
    }
    
    // Ocultar mensagens de "sem dados"
    document.querySelectorAll('.no-data-message').forEach(el => {
        el.style.display = 'none';
    });
    
    // Mostrar gráficos
    document.querySelectorAll('.chart-container canvas').forEach(el => {
        el.style.display = 'block';
    });
    
    // Calcular estatísticas
    const stats = calculateDashboardStats(vendas);
    
    // Atualizar estatísticas no dashboard
    updateDashboardStats(stats);
    
    // Inicializar gráficos
    initVendasPorServicoChart(vendas);
    initVendasPorSegmentoChart(vendas);
    
    // Atualizar lista de atividades recentes
    updateAtividadesRecentes(vendas);
}

// Calcular estatísticas para o dashboard
function calculateDashboardStats(vendas) {
    // Calcular receita total
    const receitaTotal = vendas.reduce((total, venda) => total + venda.valor, 0);
    
    // Contar total de vendas
    const vendasTotal = vendas.length;
    
    // Obter clientes únicos
    const clientesUnicos = [...new Set(vendas.map(venda => venda.cliente))];
    const clientesAtivos = clientesUnicos.length;
    
    // Contar projetos em andamento
    const projetosAtivos = vendas.filter(venda => venda.status === 'Em andamento').length;
    
    return {
        receitaTotal,
        vendasTotal,
        clientesAtivos,
        projetosAtivos
    };
}

// Atualizar estatísticas no dashboard
function updateDashboardStats(stats) {
    // Atualizar valores
    document.querySelector('.stats-card:nth-child(1) .stats-value').textContent = KolibraUtils.formatCurrency(stats.receitaTotal);
    document.querySelector('.stats-card:nth-child(2) .stats-value').textContent = stats.vendasTotal;
    document.querySelector('.stats-card:nth-child(3) .stats-value').textContent = stats.clientesAtivos;
    document.querySelector('.stats-card:nth-child(4) .stats-value').textContent = stats.projetosAtivos;
    
    // Definir metas (valores fictícios para demonstração)
    const metaReceita = 10000;
    const metaVendas = 10;
    const metaRetencao = 100; // 100% de retenção
    const metaConclusao = 100; // 100% de conclusão
    
    // Calcular percentuais
    const percentualReceita = stats.receitaTotal > 0 ? Math.min(Math.round((stats.receitaTotal / metaReceita) * 100), 100) : 0;
    const percentualVendas = stats.vendasTotal > 0 ? Math.min(Math.round((stats.vendasTotal / metaVendas) * 100), 100) : 0;
    const percentualRetencao = stats.clientesAtivos > 0 ? Math.min(Math.round(metaRetencao), 100) : 0;
    const percentualConclusao = stats.projetosAtivos > 0 ? Math.min(Math.round(metaConclusao / 2), 100) : 0;
    
    // Atualizar percentuais
    document.querySelector('.stats-card:nth-child(1) .progress-percentage').textContent = percentualReceita + '%';
    document.querySelector('.stats-card:nth-child(2) .progress-percentage').textContent = percentualVendas + '%';
    document.querySelector('.stats-card:nth-child(3) .progress-percentage').textContent = percentualRetencao + '%';
    document.querySelector('.stats-card:nth-child(4) .progress-percentage').textContent = percentualConclusao + '%';
    
    // Atualizar barras de progresso
    document.querySelector('.stats-card:nth-child(1) .progress-value').style.width = percentualReceita + '%';
    document.querySelector('.stats-card:nth-child(2) .progress-value').style.width = percentualVendas + '%';
    document.querySelector('.stats-card:nth-child(3) .progress-value').style.width = percentualRetencao + '%';
    document.querySelector('.stats-card:nth-child(4) .progress-value').style.width = percentualConclusao + '%';
}

// Inicializar gráfico de vendas por serviço
function initVendasPorServicoChart(vendas) {
    // Agrupar vendas por serviço
    const vendasPorServico = {};
    
    vendas.forEach(venda => {
        if (vendasPorServico[venda.servico]) {
            vendasPorServico[venda.servico] += venda.valor;
        } else {
            vendasPorServico[venda.servico] = venda.valor;
        }
    });
    
    // Preparar dados para o gráfico
    const labels = Object.keys(vendasPorServico);
    const data = Object.values(vendasPorServico);
    
    // Cores para o gráfico
    const backgroundColors = [
        'rgba(0, 68, 148, 0.7)',
        'rgba(255, 127, 0, 0.7)',
        'rgba(76, 175, 80, 0.7)',
        'rgba(33, 150, 243, 0.7)',
        'rgba(255, 193, 7, 0.7)',
        'rgba(156, 39, 176, 0.7)',
        'rgba(233, 30, 99, 0.7)',
        'rgba(0, 188, 212, 0.7)'
    ];
    
    // Configurar gráfico
    const ctx = document.getElementById('servicosChart').getContext('2d');
    
    // Destruir gráfico existente se houver
    if (window.servicosChart) {
        window.servicosChart.destroy();
    }
    
    // Criar novo gráfico
    window.servicosChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return label + ': ' + KolibraUtils.formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Inicializar gráfico de vendas por segmento
function initVendasPorSegmentoChart(vendas) {
    // Agrupar vendas por segmento
    const vendasPorSegmento = {};
    
    vendas.forEach(venda => {
        if (vendasPorSegmento[venda.segmento]) {
            vendasPorSegmento[venda.segmento] += venda.valor;
        } else {
            vendasPorSegmento[venda.segmento] = venda.valor;
        }
    });
    
    // Preparar dados para o gráfico
    const labels = Object.keys(vendasPorSegmento);
    const data = Object.values(vendasPorSegmento);
    
    // Cores para o gráfico
    const backgroundColors = [
        'rgba(0, 68, 148, 0.7)',
        'rgba(255, 127, 0, 0.7)',
        'rgba(76, 175, 80, 0.7)',
        'rgba(33, 150, 243, 0.7)',
        'rgba(255, 193, 7, 0.7)'
    ];
    
    // Configurar gráfico
    const ctx = document.getElementById('segmentosChart').getContext('2d');
    
    // Destruir gráfico existente se houver
    if (window.segmentosChart) {
        window.segmentosChart.destroy();
    }
    
    // Criar novo gráfico
    window.segmentosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Receita por Segmento',
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderWidth: 0,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        font: {
                            family: "'Poppins', sans-serif"
                        },
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw || 0;
                            return label + ': ' + KolibraUtils.formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// Atualizar lista de atividades recentes
function updateAtividadesRecentes(vendas) {
    const activityList = document.querySelector('.activity-list');
    
    // Limpar lista atual
    activityList.innerHTML = '';
    
    // Se não houver vendas, mostrar mensagem
    if (vendas.length === 0) {
        const noDataMessage = document.createElement('div');
        noDataMessage.className = 'no-data-message';
        noDataMessage.innerHTML = `
            <i class="fas fa-history"></i>
            <p>Nenhuma atividade recente</p>
            <a href="registro-vendas.html" class="btn btn-primary btn-sm">Iniciar Atividades</a>
        `;
        activityList.appendChild(noDataMessage);
        return;
    }
    
    // Ordenar vendas por data (mais recentes primeiro)
    const vendasRecentes = [...vendas].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);
    
    // Adicionar atividades à lista
    vendasRecentes.forEach(venda => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        // Definir ícone com base no serviço
        let iconClass = 'primary';
        if (venda.servico.includes('Marketing')) {
            iconClass = 'success';
        } else if (venda.servico.includes('Design')) {
            iconClass = 'info';
        } else if (venda.servico.includes('Suporte')) {
            iconClass = 'warning';
        } else if (venda.servico.includes('Desenvolvimento')) {
            iconClass = 'accent';
        }
        
        activityItem.innerHTML = `
            <div class="activity-icon ${iconClass}">
                <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">Venda de ${venda.servico}</div>
                <div class="activity-subtitle">Cliente: ${venda.cliente} - ${KolibraUtils.formatCurrency(venda.valor)}</div>
            </div>
            <div class="activity-time">${formatTimeAgo(venda.timestamp)}</div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Formatar tempo relativo
function formatTimeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
        return 'Agora mesmo';
    } else if (diffMin < 60) {
        return `${diffMin} min atrás`;
    } else if (diffHour < 24) {
        return `${diffHour} h atrás`;
    } else if (diffDay < 30) {
        return `${diffDay} dias atrás`;
    } else {
        return KolibraUtils.formatDate(date);
    }
}

// Função para obter vendas do localStorage
function getVendas() {
    const vendas = localStorage.getItem('kolibra_vendas');
    return vendas ? JSON.parse(vendas) : [];
}
