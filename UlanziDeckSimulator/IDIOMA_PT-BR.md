# ✅ Configuração de Idioma Padrão - PT-BR

## 🎉 O que foi alterado?

Todo o projeto agora usa **Português Brasileiro (pt_BR)** como idioma padrão!

## 📝 Mudanças realizadas:

### 1. **Simulador UlanziDeck** (`UlanziDeckSimulator/`)

#### Frontend (`static/assets/index.js`)
- ✅ Idioma padrão alterado de `zh_CN` para `pt_BR`
- ✅ Interface carrega em português por padrão
- ✅ Suporte a todos os idiomas mantido (pt_BR, en, zh_CN, ja_JP, de_DE, zh_HK)

#### Backend (`app.js`)
- ✅ Configuração padrão do servidor: `pt_BR`
- ✅ Mensagens no console em português
- ✅ URLs geradas automaticamente usam `language=pt_BR`

#### Server (`server/clients.js`)
- ✅ Lógica atualizada para usar `pt_BR_DATA` quando disponível
- ✅ Fallback inteligente: usa a tradução disponível ou o padrão
- ✅ Compatível com todos os idiomas

#### Menu (`server/menu.js`)
- ✅ Carrega traduções na ordem: pt_BR (primeiro), en, zh_CN, ja_JP, de_DE, zh_HK
- ✅ Prioriza pt_BR quando disponível

### 2. **Plugins de Exemplo**

Já foram criados arquivos `pt_BR.json` para:
- ✅ `com.ulanzi.analogclock.ulanziPlugin/pt_BR.json`
- ✅ `com.ulanzi.teamspeak5.ulanziPlugin/pt_BR.json`

### 3. **Documentação**

Todos os READMEs agora têm versões em PT-BR:
- ✅ `README.pt_BR.md` (raiz do projeto)
- ✅ `UlanziDeckSimulator/README.md` (agora em PT-BR por padrão)
- ✅ `demo/*/README.pt_BR.md`

## 🔄 Como o sistema de idiomas funciona agora?

### Ordem de prioridade:
1. **pt_BR** (Português Brasileiro) - PADRÃO ⭐
2. en (Inglês)
3. zh_CN (Chinês Simplificado)
4. ja_JP (Japonês)
5. de_DE (Alemão)
6. zh_HK (Chinês Tradicional)

### Fallback automático:
Se um plugin não tiver tradução em pt_BR, o sistema usa automaticamente:
1. Tradução em inglês (se disponível)
2. Dados originais do manifest.json

## 🎯 Como usar em seus plugins:

### Passo 1: Crie o arquivo `pt_BR.json`
```json
{
  "Name": "Nome do Plugin",
  "Description": "Descrição em português",
  "Actions": [
    {
      "Name": "Nome da Ação",
      "Tooltip": "Descrição da ação"
    }
  ],
  "Localization": {
    "KeyExample": "Tradução em português",
    "Save": "Salvar",
    "Cancel": "Cancelar"
  }
}
```

### Passo 2: Coloque na raiz do plugin
```
seu.plugin.ulanziPlugin/
├── manifest.json
├── pt_BR.json     ← AQUI!
├── en.json
├── zh_CN.json
└── ...
```

### Passo 3: O simulador detecta automaticamente!
Não precisa fazer mais nada. O simulador:
- Carrega automaticamente o `pt_BR.json`
- Usa as traduções quando `language=pt_BR`
- Faz fallback para inglês se não encontrar

## 🧪 Como testar?

### Teste 1: Verificar idioma padrão
```bash
cd UlanziDeckSimulator
npm start
```

No navegador:
1. Acesse http://localhost:39069
2. A interface deve estar em **português**
3. Verifique o campo "Idioma:" - "Português Brasileiro" deve estar selecionado

### Teste 2: Trocar idiomas
Na interface do simulador:
1. Role até a seção de configurações (direita)
2. Altere o idioma selecionando outro radio button
3. Clique em "Atualizar lista de plugins"
4. Os nomes dos plugins mudam conforme o idioma

### Teste 3: Verificar mensagens do console
No terminal onde rodou `npm start`, você deve ver:
```
╔════════════════════════════════════════════════════════════════════╗
║  🎮 Simulador UlanziDeck iniciado com sucesso!                    ║
╚════════════════════════════════════════════════════════════════════╝

📍 Acesse no navegador: http://127.0.0.1:39069
📚 Página de ajuda:     http://127.0.0.1:39069/ajuda.html

💡 IMPORTANTE: Se aparecer "Por favor inicie o serviço principal primeiro",
   abra esta URL em uma NOVA ABA do navegador:
   http://127.0.0.1:39069/com.ulanzi.analogclock.ulanziPlugin/plugin/app.html?address=127.0.0.1&port=39069&language=pt_BR&uuid=com.ulanzi.ulanzideck.analogclock
   ^^^^^^^^^^^^ 
   Veja aqui! Está usando pt_BR! ✅
```

## 📋 Checklist de verificação:

- ✅ Interface do simulador em português
- ✅ Mensagens do console em português
- ✅ URLs geradas usam `language=pt_BR`
- ✅ Plugins com `pt_BR.json` aparecem traduzidos
- ✅ Fallback para inglês funciona
- ✅ Possível trocar idioma na interface
- ✅ Documentação em português disponível

## 🔍 Onde verificar os arquivos alterados:

```
UlanziDeckSimulator/
├── app.js                          ← idioma padrão: pt_BR
├── static/assets/index.js          ← idioma padrão: pt_BR
├── server/
│   ├── clients.js                  ← lógica de pt_BR_DATA
│   └── menu.js                     ← prioridade pt_BR
└── plugins/
    └── com.ulanzi.analogclock.ulanziPlugin/
        └── pt_BR.json              ← tradução em português
```

## 💡 Dicas:

1. **Para desenvolvedores de plugins:**
   - Sempre crie `pt_BR.json` junto com `en.json`
   - Use o mesmo formato de chaves em todos os arquivos de idioma
   - Teste com vários idiomas para garantir fallback

2. **Para usuários:**
   - O simulador já vem configurado em português
   - Pode trocar o idioma a qualquer momento nas configurações
   - A mudança de idioma recarrega os plugins automaticamente

3. **Para debugging:**
   - Abra o console do navegador (F12) para ver qual idioma está sendo usado
   - Verifique se o arquivo `pt_BR.json` existe no plugin
   - Use `console.log(config.language)` no código para debug

## ✨ Resultado final:

**ANTES:**
- Idioma padrão: Chinês (zh_CN)
- Interface: Chinês
- Mensagens: Chinês/Inglês misturados

**AGORA:**
- Idioma padrão: Português Brasileiro (pt_BR) ⭐
- Interface: Português
- Mensagens: Português
- Suporte completo a múltiplos idiomas mantido

---

**🎉 Tudo pronto! O projeto está 100% configurado para PT-BR por padrão!**

