# 🏇 Little Horse - Corrida de Vendas

Uma aplicação web interativa que visual## 🔧 Desenvolvimento Local

```bash
# Instalar dependências (opcional)
npm install

# Servidor de desenvolvimento
npm start

# Ou abrir diretamente no navegador
# Abra index.html para visualização
# Abra panel-admin-of-master.html para administração
```

## 🚀 Deploy no GitHub Pages

Este projeto está **totalmente otimizado para GitHub Pages**! 

### Configuração Rápida:
1. **Fork ou clone** este repositório
2. **Ative GitHub Pages** nas configurações do repositório
3. **Acesse** `https://seuusuario.github.io/nome-do-repo/`

### Links de Acesso:
- **🏁 Corrida Pública**: `/` (página principal)
- **⚙️ Painel Admin**: `/panel-admin-of-master.html`

📖 **Guia completo**: Veja `DEPLOY.md` para instruções detalhadas de deploy e atualização de dados.nho da equipe de vendas como uma corrida de cavalos emocionante!

## 📋 Estrutura do Projeto

O projeto agora está dividido em duas interfaces principais:

### 🏁 **index.html** - Visualização Pública da Corrida
- **Propósito**: Interface simplificada para exibir a corrida em tempo real
- **Público**: Equipe de vendas, gestores, displays públicos
- **Características**:
  - Visualização em tempo real das posições dos vendedores
  - Animações de cavalos correndo
  - Estatísticas automáticas (líder atual, total de vendas)
  - Auto-atualização a cada 5 segundos
  - Sincronização automática com dados do painel administrativo

### ⚙️ **panel-admin-of-master.html** - Painel Administrativo
- **Propósito**: Interface completa para gerenciar dados dos vendedores
- **Público**: Administradores, gerentes de vendas
- **Características**:
  - Cadastro e edição de vendedores
  - Definição de metas individuais
  - Controle manual da corrida
  - Gerenciamento completo dos dados

## 🚀 Como Usar

### Para Visualização Pública (index.html)
1. Abra o arquivo `index.html` em qualquer navegador
2. A corrida será exibida automaticamente
3. Os dados são atualizados automaticamente se houver conexão com o painel administrativo

### Para Administração (panel-admin-of-master.html)
1. Abra o arquivo `panel-admin-of-master.html` em um navegador
2. Use a aba "📝 Cadastro" para gerenciar vendedores
3. Use a aba "🏁 Corrida" para visualizar e controlar
4. As alterações são automaticamente sincronizadas com a visualização pública

## 🔄 Sincronização de Dados

O sistema utiliza um **arquivo JSON estático** (`data/vendedores.json`) que é perfeito para GitHub Pages:

### Como Funciona
- **Visualização Pública** (`index.html`): Lê dados do arquivo JSON a cada 30 segundos
- **Painel Administrativo** (`panel-admin-of-master.html`): Permite editar dados e gerar novo JSON
- **Sincronização**: Baixe o JSON atualizado do painel admin e substitua no repositório

### Para GitHub Pages
1. **Faça alterações** no painel administrativo
2. **Baixe o JSON** atualizado usando o botão "📥 Baixar vendedores.json"
3. **Substitua** o arquivo `data/vendedores.json` no seu repositório GitHub
4. **Commit** as alterações - o site atualiza automaticamente

### Para Desenvolvimento Local
- As duas interfaces podem ser usadas simultaneamente
- Mudanças são refletidas automaticamente entre as abas

## 📊 Dados Padrão

O sistema inclui 10 vendedores de exemplo:
1. Carlos Silva - 85 vendas
2. Ana Santos - 92 vendas
3. João Pereira - 78 vendas
4. Maria Oliveira - 95 vendas
5. Pedro Costa - 67 vendas
6. Lucia Ferreira - 88 vendas
7. Roberto Lima - 73 vendas
8. Fernanda Rocha - 91 vendas
9. Daniel Martins - 82 vendas
10. Camila Souza - 76 vendas

## 🎨 Design e Animações

- **Paleta de Cores**: Azul, vermelho e branco (tema patriótico moderno)
- **Animações**: Cavalos correndo, efeitos shimmer nas barras de progresso
- **Responsivo**: Funciona perfeitamente em desktops, tablets e smartphones
- **Acessibilidade**: Contrastes adequados e navegação clara

## � Desenvolvimento Local

```bash
# Instalar dependências (opcional)
npm install

# Servidor de desenvolvimento
npm start

# Ou abrir diretamente no navegador
# Abra index.html para visualização
# Abra panel-admin-of-master.html para administração
```

## � Preparado para API

O código está estruturado para fácil integração com APIs:
- Funções async/await já implementadas
- Separação clara entre dados e visualização
- Endpoint placeholders prontos para configuração

## 📁 Arquivos Principais

- **index.html**: Interface pública simplificada
- **panel-admin-of-master.html**: Painel administrativo completo
- **script-viewer.js**: Script simplificado para visualização
- **script.js**: Script completo com funcionalidades administrativas
- **styles.css**: Estilos compartilhados entre as interfaces

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Grid, Flexbox, Animações CSS
- **JavaScript ES6+**: Programação moderna com async/await
- **LocalStorage**: Sincronização de dados entre interfaces
- **Responsive Design**: Layout adaptável para todos os dispositivos

## 📱 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Navegadores móveis modernos

## 🚀 Próximas Funcionalidades

- [ ] Integração com APIs de CRM
- [ ] WebSockets para atualizações em tempo real
- [ ] Dashboard de analytics histórico
- [ ] Sistema de notificações
- [ ] Ranking mensal/anual
- [ ] Exportação de relatórios em PDF
- [ ] Autenticação e permissões de usuário

---

**Desenvolvido com ❤️ para motivar equipes de vendas!**
