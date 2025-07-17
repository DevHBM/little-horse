// Script simplificado para visualização da corrida (consumindo dados do JSON)
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

// Configuração da planilha (CONFIGURE AQUI)
const PLANILHA_CONFIG = {
    // ID da sua planilha do Google Sheets
    SHEET_ID: '109tr9R9fN0wLBjLYomoXdpTKzUN1C6Fjzafj5GTpRHY',
    
    // Se você quiser usar a API (opcional, mais robusto)
    API_KEY: '', // CONFIGURE AQUI SE QUISER USAR API
    
    // Intervalo de atualização automática (em minutos)
    AUTO_REFRESH_MINUTES: 2
};

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar integração com planilhas se configurada
    if (PLANILHA_CONFIG.SHEET_ID) {
        initSheetsIntegration(PLANILHA_CONFIG.SHEET_ID, PLANILHA_CONFIG.API_KEY);
        console.log('🔗 Integração com Google Sheets ativada');
        
        // Configurar auto-atualização
        if (PLANILHA_CONFIG.AUTO_REFRESH_MINUTES > 0) {
            const intervalMs = PLANILHA_CONFIG.AUTO_REFRESH_MINUTES * 60 * 1000;
            setInterval(async () => {
                console.log('🔄 Verificando atualizações na planilha...');
                await loadVendedoresData();
            }, intervalMs);
        }
    }
    
    // Carregar dados iniciais
    await loadVendedoresData();
    
    // Recarregar dados a cada 30 segundos para capturar mudanças do localStorage
    setInterval(loadVendedoresData, 30000);
    
    // Escutar mudanças no localStorage de outras abas
    window.addEventListener('storage', function(e) {
        if (e.key === 'vendedoresData') {
            loadVendedoresData();
        }
    });
});

// Função para carregar dados do localStorage se existir
function loadFromLocalStorage() {
    try {
        const storedData = localStorage.getItem('vendedoresData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.vendedores && Array.isArray(parsedData.vendedores)) {
                vendedoresData = parsedData.vendedores;
                console.log('Dados carregados do localStorage para visualização');
                return true;
            }
        }
    } catch (error) {
        console.error('Erro ao carregar do localStorage:', error);
    }
    return false;
}

// Função principal de carregamento de dados
async function loadVendedoresData() {
    // Prioridade 1: Tentar carregar da planilha
    if (PLANILHA_CONFIG.SHEET_ID && sheetsIntegration) {
        console.log('📊 Tentando carregar dados da planilha...');
        try {
            const sheetsData = await loadFromSheets();
            if (sheetsData && sheetsData.length > 0) {
                vendedoresData = sheetsData;
                renderVendedores();
                updateStats();
                console.log('✅ Dados carregados da planilha Google Sheets');
                return;
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar da planilha, tentando localStorage:', error);
        }
    }
    
    // Prioridade 2: Tentar localStorage (sincronização com painel admin)
    if (loadFromLocalStorage()) {
        console.log('💾 Dados carregados do localStorage');
        renderVendedores();
        updateStats();
        return;
    }
    
    // Prioridade 3: Tentar arquivo JSON
    try {
        const response = await fetch('./data/vendedores.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        vendedoresData = data.vendedores || data;
        renderVendedores();
        updateStats();
        console.log('📄 Dados carregados do arquivo JSON');
    } catch (error) {
        console.error('❌ Erro ao carregar JSON:', error);
        // Prioridade 4: Dados padrão
        loadDefaultData();
    }
}

// Dados padrão caso o JSON não esteja disponível
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
    
    renderVendedores();
    updateStats();
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

        // Calcular progresso baseado na meta individual do vendedor
        const progressPercent = Math.min((vendedor.vendas / vendedor.meta) * 100, 100);

        lane.innerHTML = `
            <div class="vendor-name">
                <div class="vendor-avatar" style="background: ${avatarColors[index % avatarColors.length]}">
                    ${vendedor.avatar}
                </div>
                ${vendedor.nome}
            </div>
            <div class="progress-container">
                <div class="progress-track racing" style="width: ${progressPercent}%">
                    <span class="horse">🚗</span>
                </div>
            </div>
            <div class="sales-count">${vendedor.vendas}</div>
        `;

        raceLanes.appendChild(lane);
    });
}

function updateStats() {
    if (vendedoresData.length === 0) return;
    
    // Encontrar o líder
    const leader = vendedoresData.reduce((prev, current) => 
        (prev.vendas > current.vendas) ? prev : current
    );
    
    // Calcular total de vendas
    const totalSales = vendedoresData.reduce((sum, vendedor) => sum + vendedor.vendas, 0);
    
    // Atualizar display
    const leaderElement = document.getElementById('leader');
    const totalSalesElement = document.getElementById('totalSales');
    
    if (leaderElement) {
        leaderElement.textContent = `${leader.nome} (${leader.vendas} vendas)`;
    }
    
    if (totalSalesElement) {
        totalSalesElement.textContent = `${totalSales.toLocaleString()} vendas`;
    }
}

// Função para simular pequenas atualizações automáticas nos dados
function simulateProgressUpdates() {
    const shouldUpdate = Math.random() > 0.85; // 15% de chance
    if (shouldUpdate && vendedoresData.length > 0) {
        const randomVendedor = vendedoresData[Math.floor(Math.random() * vendedoresData.length)];
        const incremento = Math.floor(Math.random() * 2) + 1; // 1 ou 2 vendas
        
        // Só incrementa se não ultrapassar muito a meta
        if (randomVendedor.vendas < randomVendedor.meta * 1.2) {
            randomVendedor.vendas += incremento;
            
            renderVendedores();
            updateStats();
            
            console.log(`${randomVendedor.nome} fez ${incremento} nova(s) venda(s)! Total: ${randomVendedor.vendas}`);
        }
    }
}

// Simular progresso a cada 45 segundos
setInterval(simulateProgressUpdates, 45000);
