// Script de Integração com Google Sheets
// Little Horse - Sistema de Corrida dos Vendedores

class SheetsIntegration {
    constructor(sheetId, apiKey = null) {
        this.sheetId = sheetId;
        this.apiKey = apiKey;
        this.csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        this.jsonUrl = apiKey ? 
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:E?key=${apiKey}` : 
            null;
    }

    // Método principal para buscar dados (CSV - sem API key necessária)
    async fetchDataFromCSV() {
        try {
            console.log('📊 Buscando dados da planilha...');
            const response = await fetch(this.csvUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const csvText = await response.text();
            return this.parseCSVToVendedores(csvText);
        } catch (error) {
            console.error('❌ Erro ao buscar dados da planilha:', error);
            throw error;
        }
    }

    // Método alternativo com API (JSON - requer API key)
    async fetchDataFromAPI() {
        if (!this.apiKey) {
            throw new Error('API Key do Google Sheets não fornecida');
        }

        try {
            const response = await fetch(this.jsonUrl);
            const data = await response.json();
            return this.parseAPIToVendedores(data);
        } catch (error) {
            console.error('❌ Erro ao buscar dados via API:', error);
            throw error;
        }
    }

    // Converte CSV para formato de vendedores
    parseCSVToVendedores(csvText) {
        const lines = csvText.split('\n');
        const vendedores = [];
        
        console.log(`📄 Processando ${lines.length} linhas da planilha`);
        
        // Pula a primeira linha (cabeçalho)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const columns = this.parseCSVLine(line);
            if (columns.length >= 3) { // Mínimo: nome, vendas, meta
                const vendedor = {
                    id: i,
                    nome: columns[0] || `Vendedor ${i}`,
                    avatar: columns[1] || this.generateAvatar(columns[0]),
                    vendas: parseInt(columns[2]) || 0,
                    meta: parseInt(columns[3]) || 100
                };
                
                vendedores.push(vendedor);
                console.log(`✅ Vendedor adicionado: ${vendedor.nome} (${vendedor.vendas}/${vendedor.meta})`);
            }
        }
        
        console.log(`🎯 Total de vendedores carregados: ${vendedores.length}`);
        return vendedores;
    }

    // Converte resposta da API para formato de vendedores
    parseAPIToVendedores(apiResponse) {
        if (!apiResponse.values) return [];
        
        const vendedores = [];
        const rows = apiResponse.values;
        
        // Pula a primeira linha (cabeçalho)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length >= 3) {
                vendedores.push({
                    id: i,
                    nome: row[0] || `Vendedor ${i}`,
                    avatar: row[1] || this.generateAvatar(row[0]),
                    vendas: parseInt(row[2]) || 0,
                    meta: parseInt(row[3]) || 100
                });
            }
        }
        
        return vendedores;
    }

    // Parse manual de linha CSV (lida com vírgulas dentro de aspas)
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim().replace(/^"(.*)"$/, '$1'));
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim().replace(/^"(.*)"$/, '$1'));
        return result;
    }

    // Gera avatar automaticamente baseado no nome
    generateAvatar(nome) {
        if (!nome) return 'XX';
        const words = nome.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return nome.substring(0, 2).toUpperCase();
    }

    // Método para testar a conexão
    async testConnection() {
        try {
            const data = await this.fetchDataFromCSV();
            console.log(`✅ Conexão bem-sucedida! ${data.length} vendedores encontrados.`);
            return true;
        } catch (error) {
            console.error('❌ Erro na conexão:', error);
            return false;
        }
    }
}

// Configuração da planilha
const SHEETS_CONFIG = {
    // ID da sua planilha do Google Sheets
    SHEET_ID: '109tr9R9fN0wLBjLYomoXdpTKzUN1C6Fjzafj5GTpRHY',
    
    // Opcional: API Key do Google (para método mais robusto)
    API_KEY: null, // 'SUA_API_KEY_AQUI' se quiser usar
    
    // Intervalo de atualização em milissegundos (2 minutos)
    REFRESH_INTERVAL: 2 * 60 * 1000
};

// Instância global da integração
let sheetsIntegration = null;
let refreshTimer = null;

// Inicializa a integração com Google Sheets
function initSheetsIntegration(sheetId = SHEETS_CONFIG.SHEET_ID, apiKey = SHEETS_CONFIG.API_KEY) {
    if (!sheetId) {
        console.warn('⚠️ ID da planilha não configurado. Usando dados locais.');
        return false;
    }
    
    sheetsIntegration = new SheetsIntegration(sheetId, apiKey);
    console.log('🔗 Integração com Google Sheets inicializada');
    console.log(`📊 Planilha ID: ${sheetId}`);
    return true;
}

// Carrega dados da planilha
async function loadFromSheets() {
    if (!sheetsIntegration) {
        console.warn('⚠️ Integração não inicializada');
        return null;
    }
    
    try {
        const vendedores = await sheetsIntegration.fetchDataFromCSV();
        
        if (vendedores.length > 0) {
            console.log(`✅ ${vendedores.length} vendedores carregados da planilha`);
            return vendedores;
        } else {
            console.warn('⚠️ Nenhum vendedor encontrado na planilha');
            return null;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar planilha:', error);
        return null;
    }
}

// Configura atualização automática
function setupAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
    }
    
    refreshTimer = setInterval(async () => {
        console.log('🔄 Atualizando dados da planilha...');
        const newData = await loadFromSheets();
        if (newData && typeof vendedoresData !== 'undefined') {
            vendedoresData = newData;
            if (typeof renderVendedores === 'function') renderVendedores();
            if (typeof updateStats === 'function') updateStats();
            console.log('✅ Dados atualizados automaticamente');
        }
    }, SHEETS_CONFIG.REFRESH_INTERVAL);
    
    console.log(`⏰ Auto-atualização configurada para ${SHEETS_CONFIG.REFRESH_INTERVAL / 1000}s`);
}

// Testa a conexão com a planilha
async function testSheetsConnection() {
    if (!sheetsIntegration) {
        console.error('❌ Integração não inicializada');
        return false;
    }
    
    return await sheetsIntegration.testConnection();
}

// Exporta para uso global
window.SheetsIntegration = SheetsIntegration;
window.initSheetsIntegration = initSheetsIntegration;
window.loadFromSheets = loadFromSheets;
window.setupAutoRefresh = setupAutoRefresh;
window.testSheetsConnection = testSheetsConnection;
