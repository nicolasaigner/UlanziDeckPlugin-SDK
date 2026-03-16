# 🔍 DEBUG DO PROPERTY INSPECTOR - Console do Navegador

## 🐛 Problema: Config Não Salva

O Property Inspector não está salvando a configuração. Vamos usar o console do navegador para descobrir o que está acontecendo!

---

## 📋 PASSO A PASSO DE DEBUG

### 1. Limpar Tudo

```powershell
cd C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\plugins\com.ulanzi.samsungmonitor.ulanziPlugin

Remove-Item plugin-debug.log, config.json -ErrorAction SilentlyContinue
```

### 2. Build Já Feito

✅ 48.6 KB com debug extensivo no inspector.html

### 3. Reiniciar UlanziDeck

**IMPORTANTE:** Fechar completamente e abrir novamente!

### 4. Iniciar Logs do Plugin

```powershell
.\view-logs.ps1
```

### 5. Arrastar Ação para Tecla

Arraste "Mute/Unmute" para uma tecla

### 6. Abrir Console do Navegador no Property Inspector

**PASSO CRÍTICO!** O Property Inspector é uma página HTML, então podemos ver o console do navegador!

#### Como Abrir o Console:

**Opção 1: Atalho de Teclado**
- Com o Property Inspector aberto, pressione **F12**

**Opção 2: Menu do UlanziDeck**
- (Se houver opção) Clique direito no Property Inspector → Inspecionar

**Opção 3: DevTools**
- Se o UlanziDeck usa Electron/CEF, pode ter opção de DevTools

### 7. Verificar Console do Navegador

**Você DEVE ver estas mensagens ao abrir o Property Inspector:**

```
========================================
Samsung Monitor Inspector: Iniciando...
$UD disponível? true
========================================
Tentando conectar ao WebSocket...
Comando connect enviado
Elementos HTML encontrados: { form: true, statusIndicator: true, ... }
========================================
Samsung Monitor Inspector: CONECTADO AO WEBSOCKET!
Dados da conexão: {context: "com.ulanzi.ulanzideck.samsungmonitor.mute___1__1234"}
Context recebido: com.ulanzi.ulanzideck.samsungmonitor.mute___1__1234
========================================
```

**Se aparecer ERRO:**

```
❌ ERRO: $UD não está definido!
```
ou
```
⚠️ AVISO: Context não foi recebido na conexão!
```

---

### 8. Preencher Campos e Salvar

1. Preencha **Device ID** e **Token**
2. Clique em **"💾 Salvar Configurações"**

### 9. Verificar Console ao Clicar em Salvar

**Você DEVE ver:**

```
========================================
🔘 BOTÃO SALVAR CLICADO!
========================================
Context atual: com.ulanzi.ulanzideck.samsungmonitor.mute___1__1234
$UD disponível? true
sendParamFromPlugin disponível? true
Valores dos campos:
- Device ID: 5adfc20a-5821-753b-c496-c99fca7f802a
- Token: ***586a
Config para enviar: { deviceId: "5adf...", token: "***586a" }
✅ Context existe, enviando...
Chamando: $UD.sendParamFromPlugin(config, context)
✅ sendParamFromPlugin executado sem erro!
Config enviada: {deviceId: "5adf...", token: "0295..."}
Context usado: com.ulanzi.ulanzideck.samsungmonitor.mute___1__1234
========================================
```

**Se aparecer ERRO:**

```
❌ Context não encontrado!
```
ou
```
❌ ERRO ao enviar: [mensagem de erro]
```

---

### 10. Verificar Logs do Plugin (Terminal)

**Nos logs do plugin (view-logs.ps1), você DEVE ver:**

```
Samsung Monitor Plugin: Parâmetros recebidos do plugin
Samsung Monitor Plugin: Context: com.ulanzi.ulanzideck...
Samsung Monitor Plugin: Param: {"deviceId":"5adf...","token":"0295..."}
Samsung Monitor Plugin: ===== ATUALIZANDO CONFIGURAÇÕES GLOBAIS =====
Config: Configuração salva no arquivo
Samsung Monitor Plugin: ✅ Device ID salvo no config.json
Samsung Monitor Plugin: ✅ Token salvo no config.json
```

---

## 🔍 Análise de Problemas

### ❌ Problema 1: $UD não está definido

**Mensagem:**
```
ERRO: $UD não está definido! Bibliotecas não foram carregadas.
```

**Causa:** As bibliotecas `ulanzideckApi.js` não foram carregadas

**Solução:**
1. Verificar se os arquivos existem em `libs/js/`
2. Verificar se os caminhos `<script src="../../libs/js/...">` estão corretos
3. Verificar se há erros 404 na aba Network do console

---

### ❌ Problema 2: Context não foi recebido

**Mensagem:**
```
⚠️ AVISO: Context não foi recebido na conexão!
```

**Causa:** O evento `onConnected` não está recebendo o context

**Possível:**
- UUID incorreto no `$UD.connect()`
- Plugin não está rodando
- WebSocket não conectou

**Verificar:**
1. Plugin está rodando? (Gerenciador de Tarefas)
2. Logs do plugin mostram "Conectado ao UlanziDeck"?
3. UUID está correto? `com.ulanzi.ulanzideck.samsungmonitor.mute`

---

### ❌ Problema 3: sendParamFromPlugin não funciona

**Mensagem:**
```
❌ ERRO ao enviar: [erro]
```

**Causa:** Método não existe ou falhou

**Verificar:**
1. Versão do `ulanzideckApi.js` está correta?
2. Método `sendParamFromPlugin` aceita 2 parâmetros?
3. Ver mensagem de erro completa no console

---

### ❌ Problema 4: Plugin não recebe parâmetros

**Console mostra tudo OK, mas logs do plugin não mostram nada**

**Causa:** WebSocket não está realmente conectado ou mensagem não está sendo enviada

**Verificar:**
1. Aba Network do console → Ver se há WebSocket ativo
2. Ver mensagens WebSocket (frame enviado/recebido)
3. UUID do plugin e inspector são compatíveis?

---

## 📸 O Que Me Enviar

Se ainda não funcionar, me envie:

### 1. Screenshot do Console do Navegador

**Ao abrir Property Inspector:**
- Todas as mensagens de inicialização
- Se aparecem erros vermelhos

**Ao clicar em Salvar:**
- Todas as mensagens do clique
- Se há erros

### 2. Cópia dos Logs do Plugin

```powershell
cat plugin-debug.log | Select-String "Samsung Monitor" | Select-Object -Last 50
```

### 3. Informações do Ambiente

- Versão do UlanziDeck
- Sistema Operacional
- Se há antivírus bloqueando WebSocket

---

## 🎯 Checklist de Verificação

**No Console do Navegador (F12):**
- [ ] Console abre quando pressiono F12?
- [ ] Aparece "$UD disponível? true"?
- [ ] Aparece "CONECTADO AO WEBSOCKET!"?
- [ ] Context tem valor (não é null/undefined)?
- [ ] Ao clicar Salvar, aparece "BOTÃO SALVAR CLICADO"?
- [ ] Aparece "sendParamFromPlugin executado sem erro"?
- [ ] Não há erros vermelhos no console?

**Nos Logs do Plugin:**
- [ ] Aparece "Parâmetros recebidos do plugin"?
- [ ] Aparece "===== ATUALIZANDO CONFIGURAÇÕES GLOBAIS ====="?
- [ ] Aparece "✅ Device ID salvo no config.json"?
- [ ] config.json foi criado?

---

## 🚀 TESTE AGORA COM CONSOLE ABERTO!

```powershell
cd C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\plugins\com.ulanzi.samsungmonitor.ulanziPlugin

# Limpar
Remove-Item plugin-debug.log, config.json -ErrorAction SilentlyContinue

# Logs do plugin
.\view-logs.ps1
```

**Em outra janela:**
1. Reiniciar UlanziDeck
2. Arrastar ação
3. Clicar na tecla (abre Property Inspector)
4. **PRESSIONAR F12** para abrir console
5. Ver mensagens de inicialização
6. Preencher campos
7. Clicar Salvar
8. Ver mensagens no console
9. Ver mensagens nos logs do plugin

---

**Build:** 48.6 KB ✅  
**Debug:** Extensivo no console ✅  
**Alertas:** Habilitados para erros críticos ✅  
**Status:** Pronto para debug profundo! 🔍

**ABRA O CONSOLE (F12) E ME MOSTRE O QUE APARECE! 🔍**

