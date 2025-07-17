let vendedoresData = [
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

let editingVendorId = null;
let nextId = 11;

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
    renderVendedores();
    updateStats();
    renderVendoresTable();
    setupEventListeners();
});

function setupEventListeners() {
    // Sistema de abas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
    
    // Formulário de cadastro
    document.getElementById('vendedor-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancel-edit').addEventListener('click', cancelEdit);
    
    // Formatação automática do avatar
    document.getElementById('vendor-avatar').addEventListener('input', function(e) {
        e.target.value = e.target.value.toUpperCase();
    });
}

// Sistema de Abas
function switchTab(tabName) {
    // Atualizar botões das abas
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Atualizar conteúdo das abas
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Formulário de Cadastro
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const vendedorData = {
        id: editingVendorId || nextId++,
        nome: formData.get('name').trim(),
        vendas: parseInt(formData.get('sales')),
        meta: parseInt(formData.get('target')),
        avatar: formData.get('avatar').toUpperCase().trim()
    };
    
    // Validações
    if (!vendedorData.nome || !vendedorData.avatar) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    if (vendedorData.avatar.length !== 2) {
        alert('O avatar deve ter exatamente 2 letras.');
        return;
    }
    
    if (vendedorData.vendas < 0 || vendedorData.meta < 1) {
        alert('Vendas e meta devem ser números válidos.');
        return;
    }
    
    // Verificar se já existe vendedor com mesmo nome (exceto se estiver editando)
    const existingVendedor = vendedoresData.find(v => 
        v.nome.toLowerCase() === vendedorData.nome.toLowerCase() && v.id !== vendedorData.id
    );
    
    if (existingVendedor) {
        alert('Já existe um vendedor com este nome.');
        return;
    }
    
    if (editingVendorId) {
        // Editar vendedor existente
        const index = vendedoresData.findIndex(v => v.id === editingVendorId);
        vendedoresData[index] = vendedorData;
        showNotification('Vendedor atualizado com sucesso!', 'success');
    } else {
        // Adicionar novo vendedor
        vendedoresData.push(vendedorData);
        showNotification('Vendedor adicionado com sucesso!', 'success');
    }
    
    // Resetar formulário e atualizar dados
    resetForm();
    renderVendedores();
    updateStats();
    renderVendoresTable();
}

function editVendedor(id) {
    const vendedor = vendedoresData.find(v => v.id === id);
    if (!vendedor) return;
    
    editingVendorId = id;
    
    // Preencher formulário
    document.getElementById('vendor-name').value = vendedor.nome;
    document.getElementById('vendor-avatar').value = vendedor.avatar;
    document.getElementById('vendor-sales').value = vendedor.vendas;
    document.getElementById('vendor-target').value = vendedor.meta;
    
    // Atualizar interface
    document.getElementById('form-btn-text').textContent = '✏️ Atualizar Vendedor';
    document.getElementById('cancel-edit').style.display = 'inline-block';
    
    // Mudar para aba de cadastro
    switchTab('register');
    
    // Scroll para o formulário
    document.getElementById('vendedor-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteVendedor(id) {
    const vendedor = vendedoresData.find(v => v.id === id);
    if (!vendedor) return;
    
    if (confirm(`Tem certeza que deseja excluir o vendedor "${vendedor.nome}"?`)) {
        vendedoresData = vendedoresData.filter(v => v.id !== id);
        renderVendedores();
        updateStats();
        renderVendoresTable();
        showNotification('Vendedor excluído com sucesso!', 'success');
    }
}

function cancelEdit() {
    resetForm();
}

function resetForm() {
    editingVendorId = null;
    document.getElementById('vendedor-form').reset();
    document.getElementById('form-btn-text').textContent = '➕ Adicionar Vendedor';
    document.getElementById('cancel-edit').style.display = 'none';
}

function renderVendoresTable() {
    const tableContainer = document.getElementById('vendors-table');
    
    if (vendedoresData.length === 0) {
        tableContainer.innerHTML = '<p style="text-align: center; color: #666;">Nenhum vendedor cadastrado.</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'vendors-table';
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Avatar</th>
                <th>Nome</th>
                <th>Vendas</th>
                <th>Meta</th>
                <th>Progresso</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            ${vendedoresData.map((vendedor, index) => `
                <tr>
                    <td>
                        <div class="vendor-avatar" style="background: ${avatarColors[index % avatarColors.length]}; width: 30px; height: 30px; font-size: 12px;">
                            ${vendedor.avatar}
                        </div>
                    </td>
                    <td>${vendedor.nome}</td>
                    <td>${vendedor.vendas}</td>
                    <td>${vendedor.meta}</td>
                    <td>${Math.round((vendedor.vendas / vendedor.meta) * 100)}%</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-small btn-edit" onclick="editVendedor(${vendedor.id})" title="Editar">
                                ✏️
                            </button>
                            <button class="btn-small btn-delete" onclick="deleteVendedor(${vendedor.id})" title="Excluir">
                                🗑️
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    // Adicionar à página
    document.body.appendChild(notification);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// CSS para animação de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);

function renderVendedores() {
    const raceLanes = document.getElementById('race-lanes');
    raceLanes.innerHTML = '';

    // Ordenar vendedores por vendas (descendente) para mostrar posições
    const vendedoresOrdenados = [...vendedoresData].sort((a, b) => b.vendas - a.vendas);

    vendedoresOrdenados.forEach((vendedor, index) => {
        const lane = document.createElement('div');
        lane.className = `race-lane position-${index + 1}`;
        lane.id = `lane-${vendedor.id}`;

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
                    <span class="horse">🏃</span>
                </div>
            </div>
            <div class="sales-count">${vendedor.vendas}</div>
            <div class="target-count">${vendedor.meta}</div>
        `;

        raceLanes.appendChild(lane);
    });
}

function updateVendedorDisplay(vendedor) {
    const lane = document.getElementById(`lane-${vendedor.id}`);
    if (lane) {
        const progressTrack = lane.querySelector('.progress-track');
        const salesCount = lane.querySelector('.sales-count');
        
        const progressPercent = Math.min((vendedor.vendas / vendedor.meta) * 100, 100);
        
        progressTrack.style.width = `${progressPercent}%`;
        salesCount.textContent = vendedor.vendas;
        
        // Reorganizar se necessário
        setTimeout(() => {
            renderVendedores();
        }, 1000);
    }
}

function updateStats() {
    // Encontrar o líder
    const leader = vendedoresData.reduce((prev, current) => 
        (prev.vendas > current.vendas) ? prev : current
    );
    
    // Calcular totais
    const totalSales = vendedoresData.reduce((sum, vendedor) => sum + vendedor.vendas, 0);
    const totalTarget = vendedoresData.reduce((sum, vendedor) => sum + vendedor.meta, 0);
    
    // Atualizar display
    document.getElementById('leader').textContent = `${leader.nome} (${leader.vendas} vendas)`;
    document.getElementById('totalSales').textContent = `${totalSales.toLocaleString()} vendas`;
    document.getElementById('totalTarget').textContent = `${totalTarget.toLocaleString()} vendas`;
}

// Função para simular chamada à API (futura implementação)
async function fetchVendedoresFromAPI() {
    try {
        // Placeholder para futura implementação da API
        // const response = await fetch('/api/vendedores');
        // const data = await response.json();
        // vendedoresData = data;
        
        console.log('Função preparada para integração com API');
        return vendedoresData;
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
        return vendedoresData; // Fallback para dados locais
    }
}

// Função para enviar dados para API (futura implementação)
async function sendDataToAPI(data) {
    try {
        // Placeholder para futura implementação da API
        // const response = await fetch('/api/vendedores', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // });
        // return await response.json();
        
        console.log('Dados preparados para envio à API:', data);
        return { success: true };
    } catch (error) {
        console.error('Erro ao enviar dados para API:', error);
        return { success: false, error };
    }
}

// Função para simular pequenas atualizações automáticas
function simulateAutoUpdates() {
    const shouldUpdate = Math.random() > 0.8; // 20% de chance
    if (shouldUpdate && vendedoresData.length > 0) {
        const randomVendedor = vendedoresData[Math.floor(Math.random() * vendedoresData.length)];
        const incremento = Math.floor(Math.random() * 2) + 1;
        randomVendedor.vendas = Math.min(randomVendedor.vendas + incremento, randomVendedor.meta + 10);
        
        renderVendedores();
        updateStats();
        renderVendoresTable();
    }
}

// Auto-atualização a cada 30 segundos
setInterval(simulateAutoUpdates, 30000);

// Adicionar efeitos sonoros (opcional)
function playSuccessSound() {
    // Placeholder para efeitos sonoros
    console.log('🔊 Som de sucesso!');
}

function playRaceSound() {
    // Placeholder para efeitos sonoros
    console.log('🔊 Som de corrida!');
}
