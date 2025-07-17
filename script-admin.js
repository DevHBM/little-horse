// Script para painel administrativo - GitHub Pages compatível
let vendedoresData = [];

// Cores para os avatares - Paleta Azul, Vermelho e Branco
const avatarColors = [
    'linear-gradient(45deg, #dc2626, #1d4ed8)',
    'linear-gradient(45deg, #1d4ed8, #dc2626)',
    'linear-gradient(45deg, #ef4444, #2563eb)',
    'linear-gradient(45deg, #2563eb, #ef4444)',
    'linear-gradient(45deg, #b91c1c, #1e40af)',
    'linear-gradient(45deg, #1e40af, #b91c1c)',
    'linear-gradient(45deg, #f87171, #60a5fa)',
    'linear-gradient(45deg, #60a5fa, #f87171)',
    'linear-gradient(45deg, #991b1b, #1e3a8a)',
    'linear-gradient(45deg, #1e3a8a, #991b1b)'
];

// Estado da corrida
let raceStarted = false;
let raceInterval = null;

// Inicialização
function initializeApp() {
    setupTabs();
    loadVendedoresData();
}

// Função para sincronizar dados com localStorage
function syncWithLocalStorage() {
    const dataToSync = {
        vendedores: vendedoresData,
        lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('vendedoresData', JSON.stringify(dataToSync));
    console.log('Dados sincronizados com localStorage');
}

// Função para carregar dados do localStorage se existir
function loadFromLocalStorage() {
    try {
        const storedData = localStorage.getItem('vendedoresData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.vendedores && Array.isArray(parsedData.vendedores)) {
                vendedoresData = parsedData.vendedores;
                console.log('Dados carregados do localStorage');
                return true;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
    }
    return false;
}

// Configuração da planilha (mesma configuração do viewer)
const PLANILHA_CONFIG = {
    // ID da sua planilha do Google Sheets
    SHEET_ID: '109tr9R9fN0wLBjLYomoXdpTKzUN1C6Fjzafj5GTpRHY',
    
    // Se você quiser usar a API (opcional, mais robusto)
    API_KEY: '', // CONFIGURE AQUI SE QUISER USAR API
    
    // Intervalo de atualização automática (em minutos)
    AUTO_REFRESH_MINUTES: 2
};

// Função principal de carregamento de dados (atualizada para incluir planilha)
async function loadVendedoresData() {
    // Prioridade 1: Tentar carregar da planilha
    if (PLANILHA_CONFIG.SHEET_ID && sheetsIntegration) {
        console.log('📊 [ADMIN] Tentando carregar dados da planilha...');
        try {
            const sheetsData = await loadFromSheets();
            if (sheetsData && sheetsData.length > 0) {
                vendedoresData = sheetsData;
                renderVendedores();
                renderVendedoresTable();
                updateStats();
                console.log('✅ [ADMIN] Dados carregados da planilha Google Sheets');
                return;
            }
        } catch (error) {
            console.warn('⚠️ [ADMIN] Erro ao carregar da planilha, tentando localStorage:', error);
        }
    }
    
    // Prioridade 2: Tentar carregar do localStorage
    if (loadFromLocalStorage()) {
        renderVendedores();
        renderVendedoresTable();
        updateStats();
        console.log('💾 [ADMIN] Dados carregados do localStorage');
        return;
    }
    
    // Prioridade 3: Carregar do JSON
    try {
        const response = await fetch('./data/vendedores.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        vendedoresData = data.vendedores;
        
        // Sincronizar com localStorage na primeira carga
        syncWithLocalStorage();
        
        renderVendedores();
        renderVendedoresTable();
        updateStats();
        console.log('📄 [ADMIN] Dados carregados do arquivo JSON');
    } catch (error) {
        console.error('❌ [ADMIN] Erro ao carregar dados do JSON:', error);
        loadDefaultData();
    }
}

function loadDefaultData() {
    vendedoresData = [
        { id: 1, nome: "Carlos Silva", vendas: 85, meta: 100, avatar: "CS" },
        { id: 2, nome: "Ana Santos", vendas: 92, meta: 100, avatar: "AS" },
        { id: 3, nome: "João Pereira", vendas: 78, meta: 100, avatar: "JP" },
        { id: 4, nome: "Maria Oliveira", vendas: 95, meta: 100, avatar: "MO" },
        { id: 5, nome: "Pedro Costa", vendas: 67, meta: 100, avatar: "PC" },
        { id: 6, nome: "Lucia Ferreira", vendas: 88, meta: 100, avatar: "LF" },
        { id: 7, nome: "Roberto Lima", vendas: 73, meta: 100, avatar: "RL" },
        { id: 8, nome: "Fernanda Rocha", vendas: 91, meta: 100, avatar: "FR" },
        { id: 9, nome: "Daniel Martins", vendas: 82, meta: 100, avatar: "DM" },
        { id: 10, nome: "Camila Souza", vendas: 76, meta: 100, avatar: "CS" }
    ];
    
    // Sincronizar dados padrão com localStorage
    syncWithLocalStorage();
    
    renderVendedores();
    renderVendedoresTable();
    updateStats();
    generateJsonForDownload();
}

// Sistema de abas
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active de todas as abas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adiciona active na aba clicada
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

function renderVendedores() {
    const raceLanes = document.getElementById('race-lanes');
    if (!raceLanes) return;
    
    raceLanes.innerHTML = '';

    // Ordenar vendedores por vendas (descendente) para mostrar posições
    const vendedoresOrdenados = [...vendedoresData].sort((a, b) => b.vendas - a.vendas);

    vendedoresOrdenados.forEach((vendedor, index) => {
        const lane = document.createElement('div');
        lane.className = `race-lane position-${index + 1}`;
        lane.id = `lane-${vendedor.id}`;

        const progressPercent = Math.min((vendedor.vendas / vendedor.meta) * 100, 100);
        
        // Função para gerar ícone de classificação
        function getClassificationIcon(position) {
            switch(position) {
                case 1: return '🥇';
                case 2: return '🥈';
                case 3: return '🥉';
                default: return `${position}º`;
            }
        }
        
        const classificationIcon = getClassificationIcon(index + 1);

        lane.innerHTML = `
            <div class="classification-display">
                <span class="classification-icon ${index < 3 ? 'podium' : ''}">${classificationIcon}</span>
            </div>
            <div class="vendor-name">
                <div class="vendor-avatar" style="background: ${avatarColors[index % avatarColors.length]}">
                    ${vendedor.avatar}
                </div>
                ${vendedor.nome}
            </div>
            <div class="progress-container">
                <div class="progress-track ${raceStarted ? 'racing' : ''}" style="width: ${progressPercent}%">
                    <span class="horse">🚗</span>
                </div>
            </div>
            <div class="sales-count">${vendedor.vendas}</div>
            <div class="meta-count">${vendedor.meta}</div>
        `;

        raceLanes.appendChild(lane);
    });
}

// Funções de controle da corrida
function startRace() {
    raceStarted = true;
    raceInterval = setInterval(() => {
        // Simular pequenas atualizações aleatórias
        if (Math.random() > 0.7) {
            const randomVendedor = vendedoresData[Math.floor(Math.random() * vendedoresData.length)];
            if (randomVendedor.vendas < randomVendedor.meta * 1.2) {
                randomVendedor.vendas += Math.floor(Math.random() * 2) + 1;
                renderVendedores();
                renderVendedoresTable();
                updateStats();
                generateJsonForDownload();
                
                // Sincronizar com localStorage em tempo real
                syncWithLocalStorage();
            }
        }
    }, 2000);
    
    renderVendedores();
    updateControlButtons();
}

function pauseRace() {
    raceStarted = false;
    if (raceInterval) {
        clearInterval(raceInterval);
        raceInterval = null;
    }
    renderVendedores();
    updateControlButtons();
}

function resetRace() {
    pauseRace();
    loadVendedoresData();
}

function updateControlButtons() {
    const startBtn = document.getElementById('start-race');
    const pauseBtn = document.getElementById('pause-race');
    
    if (startBtn && pauseBtn) {
        startBtn.disabled = raceStarted;
        pauseBtn.disabled = !raceStarted;
    }
}

function renderVendedoresTable() {
    const tableContainer = document.getElementById('vendors-table');
    if (!tableContainer) return;
    
    if (vendedoresData.length === 0) {
        tableContainer.innerHTML = '<p>Nenhum vendedor cadastrado.</p>';
        return;
    }
    
    let tableHTML = `
        <table class="vendors-table">
            <thead>
                <tr>
                    <th>Avatar</th>
                    <th>Nome</th>
                    <th>Vendas</th>
                    <th>Meta</th>
                    <th>Progress</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    vendedoresData.forEach((vendedor, index) => {
        const progressPercent = Math.min((vendedor.vendas / vendedor.meta) * 100, 100);
        tableHTML += `
            <tr>
                <td>
                    <div class="table-avatar" style="background: ${avatarColors[index % avatarColors.length]}">
                        ${vendedor.avatar}
                    </div>
                </td>
                <td><strong>${vendedor.nome}</strong></td>
                <td>${vendedor.vendas}</td>
                <td>${vendedor.meta}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        <span class="progress-text">${progressPercent.toFixed(1)}%</span>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
}

function updateStats() {
    if (vendedoresData.length === 0) return;
    
    const leader = vendedoresData.reduce((prev, current) => 
        (prev.vendas > current.vendas) ? prev : current
    );
    
    const totalSales = vendedoresData.reduce((sum, vendedor) => sum + vendedor.vendas, 0);
    const totalMetas = vendedoresData.reduce((sum, vendedor) => sum + vendedor.meta, 0);
    
    const leaderElement = document.getElementById('leader');
    const totalSalesElement = document.getElementById('totalSales');
    const totalTargetElement = document.getElementById('totalTarget');
    
    if (leaderElement) {
        leaderElement.textContent = `${leader.nome} (${leader.vendas} vendas)`;
    }
    
    if (totalSalesElement) {
        totalSalesElement.textContent = `${totalSales.toLocaleString()} vendas`;
    }
    
    if (totalTargetElement) {
        totalTargetElement.textContent = `${totalMetas.toLocaleString()} vendas`;
    }
}

// Função para gerar JSON atualizado para download
function generateJsonForDownload() {
    const jsonData = {
        vendedores: vendedoresData
    };
    
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    // Criar link de download automático (opcional)
    const downloadLink = document.getElementById('download-json');
    if (downloadLink) {
        const url = URL.createObjectURL(dataBlob);
        downloadLink.href = url;
        downloadLink.download = 'vendedores.json';
        downloadLink.style.display = 'inline-block';
    }
}

// Função para resetar para os dados originais do JSON
async function resetToOriginalJson() {
    if (confirm('Tem certeza que deseja restaurar os dados originais do JSON? Todas as alterações locais serão perdidas.')) {
        try {
            // Limpar localStorage
            localStorage.removeItem('vendedoresData');
            
            // Carregar dados diretamente do JSON
            const response = await fetch('./data/vendedores.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            vendedoresData = data.vendedores;
            
            // Sincronizar com localStorage
            syncWithLocalStorage();
            
            // Atualizar tudo
            renderVendedores();
            renderVendedoresTable();
            updateStats();
            generateJsonForDownload();
            
            alert('Dados restaurados do JSON original com sucesso!');
        } catch (error) {
            console.error('Erro ao restaurar dados do JSON:', error);
            alert('Erro ao carregar dados do JSON original.');
        }
    }
}

// Função para download do JSON
function downloadJson() {
    generateJsonForDownload();
}

// Event listeners para controles
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar integração com Google Sheets
    if (PLANILHA_CONFIG.SHEET_ID) {
        initSheetsIntegration(PLANILHA_CONFIG.SHEET_ID, PLANILHA_CONFIG.API_KEY);
        console.log('🔗 [ADMIN] Integração com Google Sheets ativada');
        
        // Configurar auto-atualização
        if (PLANILHA_CONFIG.AUTO_REFRESH_MINUTES > 0) {
            const intervalMs = PLANILHA_CONFIG.AUTO_REFRESH_MINUTES * 60 * 1000;
            setInterval(async () => {
                console.log('🔄 [ADMIN] Verificando atualizações na planilha...');
                await loadVendedoresData();
            }, intervalMs);
        }
    }
    
    // Inicializar a aplicação
    initializeApp();
    
    // Controles da corrida
    const startBtn = document.getElementById('start-race');
    const pauseBtn = document.getElementById('pause-race');
    const resetBtn = document.getElementById('reset-race');
    const updateBtn = document.getElementById('update-data');
    
    if (startBtn) startBtn.addEventListener('click', startRace);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseRace);
    if (resetBtn) resetBtn.addEventListener('click', resetRace);
    if (updateBtn) updateBtn.addEventListener('click', loadVendedoresData);
    
    // Verificação periódica para sincronização entre abas
    setInterval(loadVendedoresData, 30000); // A cada 30 segundos
    
    // Escutar mudanças no localStorage de outras abas
    window.addEventListener('storage', function(e) {
        if (e.key === 'vendedoresData') {
            console.log('🔄 [ADMIN] Mudança detectada no localStorage de outra aba');
            loadVendedoresData();
        }
    });
});

// Funções para integração com Google Sheets
async function testSheetsConnection() {
    const statusDiv = document.getElementById('sheets-status');
    statusDiv.style.display = 'block';
    statusDiv.style.backgroundColor = '#3b82f6';
    statusDiv.style.color = 'white';
    statusDiv.innerHTML = '🔄 Testando conexão...';
    
    try {
        if (!sheetsIntegration) {
            throw new Error('Integração não inicializada');
        }
        
        const success = await sheetsIntegration.testConnection();
        
        if (success) {
            statusDiv.style.backgroundColor = '#10b981';
            statusDiv.innerHTML = '✅ Conexão bem-sucedida! A planilha está acessível.';
        } else {
            statusDiv.style.backgroundColor = '#ef4444';
            statusDiv.innerHTML = '❌ Erro na conexão. Verifique se a planilha está pública.';
        }
    } catch (error) {
        statusDiv.style.backgroundColor = '#ef4444';
        statusDiv.innerHTML = `❌ Erro: ${error.message}`;
    }
    
    // Limpar status após 5 segundos
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

async function loadFromSheetsManual() {
    const statusDiv = document.getElementById('sheets-status');
    statusDiv.style.display = 'block';
    statusDiv.style.backgroundColor = '#3b82f6';
    statusDiv.style.color = 'white';
    statusDiv.innerHTML = '📊 Carregando dados da planilha...';
    
    try {
        const sheetsData = await loadFromSheets();
        
        if (sheetsData && sheetsData.length > 0) {
            vendedoresData = sheetsData;
            
            // Atualizar tudo
            renderVendedores();
            renderVendedoresTable();
            updateStats();
            
            // Sincronizar com localStorage
            syncWithLocalStorage();
            
            statusDiv.style.backgroundColor = '#10b981';
            statusDiv.innerHTML = `✅ ${sheetsData.length} vendedores carregados da planilha!`;
        } else {
            statusDiv.style.backgroundColor = '#f59e0b';
            statusDiv.innerHTML = '⚠️ Nenhum vendedor encontrado na planilha.';
        }
    } catch (error) {
        statusDiv.style.backgroundColor = '#ef4444';
        statusDiv.innerHTML = `❌ Erro ao carregar: ${error.message}`;
    }
    
    // Limpar status após 5 segundos
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}
