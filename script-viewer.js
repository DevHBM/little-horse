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

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadVendedoresData();
    // Recarregar dados a cada 5 segundos para capturar mudanças do localStorage
    setInterval(loadVendedoresData, 5000);
    
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

// Carregar dados do arquivo JSON
async function loadVendedoresData() {
    try {
        // Tentar carregar do localStorage primeiro (dados mais recentes do painel admin)
        if (loadFromLocalStorage()) {
            renderVendedores();
            updateStats();
            return;
        }
        
        // Se não houver dados no localStorage, carregar do JSON
        const response = await fetch('./data/vendedores.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        vendedoresData = data.vendedores;
        
        renderVendedores();
        updateStats();
    } catch (error) {
        console.error('Erro ao carregar dados do JSON:', error);
        // Fallback para dados padrão em caso de erro
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
