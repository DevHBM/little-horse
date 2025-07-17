# 🚀 Deploy no GitHub Pages

## Como configurar no GitHub Pages

### 1. Estrutura de Arquivos para GitHub Pages
```
little-horse/
├── index.html              # Visualização pública (página principal)
├── panel-admin-of-master.html  # Painel administrativo
├── styles.css              # Estilos compartilhados
├── script-viewer.js        # Script para visualização
├── script-admin.js         # Script para administração
├── data/
│   └── vendedores.json     # Dados dos vendedores (ESTÁTICO)
├── package.json
└── README.md
```

### 2. Preparação do Repositório

1. **Crie um repositório no GitHub**
2. **Faça upload de todos os arquivos**
3. **Ative o GitHub Pages**:
   - Vá em Settings → Pages
   - Source: Deploy from a branch
   - Branch: main (ou master)
   - Folder: / (root)

### 3. URLs de Acesso

Após ativar o GitHub Pages, você terá:

- **Visualização Pública**: `https://seuusuario.github.io/nome-do-repo/`
- **Painel Admin**: `https://seuusuario.github.io/nome-do-repo/panel-admin-of-master.html`

### 4. Como Atualizar os Dados

#### Opção A: Edição Manual do JSON
1. Edite diretamente o arquivo `data/vendedores.json` no GitHub
2. Faça commit das alterações
3. As mudanças aparecerão automaticamente no site

#### Opção B: Usando o Painel Administrativo
1. Acesse o painel administrativo
2. Faça as alterações desejadas
3. Clique em "Gerar JSON para Download"
4. Baixe o arquivo `vendedores.json`
5. Substitua o arquivo `data/vendedores.json` no repositório
6. Faça commit da alteração

### 5. Estrutura do JSON

```json
{
  "vendedores": [
    {
      "id": 1,
      "nome": "Nome do Vendedor",
      "vendas": 85,
      "meta": 100,
      "avatar": "NV"
    }
  ]
}
```

### 6. Vantagens desta Abordagem

✅ **Totalmente Estático**: Funciona perfeitamente no GitHub Pages  
✅ **Sem Servidor**: Não precisa de backend ou banco de dados  
✅ **Atualizações Simples**: Apenas substitua o arquivo JSON  
✅ **Versionamento**: Todo o histórico fica no Git  
✅ **Gratuito**: GitHub Pages é gratuito para repositórios públicos  

### 7. Limitações e Soluções

#### Limitação: Dados não persistem automaticamente
**Solução**: Use o sistema de download/upload do JSON

#### Limitação: Atualizações em tempo real entre dispositivos
**Solução**: Para uso profissional, considere integrar com uma API

#### Limitação: Sem autenticação
**Solução**: Para proteger o painel admin, use GitHub Pages com repositório privado ou adicione autenticação

### 8. Dicas Importantes

1. **Sempre faça backup** do arquivo JSON antes de grandes alterações
2. **Teste localmente** antes de fazer deploy
3. **Use nomes de arquivos em minúsculas** para melhor compatibilidade
4. **O cache do GitHub Pages** pode demorar alguns minutos para atualizar

### 9. Exemplo de Workflow

```bash
# 1. Clone o repositório
git clone https://github.com/seuusuario/nome-do-repo.git

# 2. Faça alterações no arquivo JSON
# Edite data/vendedores.json

# 3. Commit e push
git add .
git commit -m "Atualizar dados de vendas"
git push origin main

# 4. Aguarde alguns minutos para o GitHub Pages atualizar
```

### 10. Monitoramento

Para acompanhar as atualizações:
- Vá em Actions no GitHub para ver o status do deploy
- O site atualiza automaticamente após cada commit
- Use as ferramentas de desenvolvedor do navegador para verificar se o JSON está carregando

---

**🎯 Pronto! Sua corrida de vendas está no ar com GitHub Pages!**
