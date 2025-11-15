# Guia Rápido: Como Usar o Simulador UlanziDeck

## ✅ O Simulador já está rodando!

O servidor está ativo na porta **39069**.

## 🌐 Acesse o Simulador

Abra seu navegador e acesse:

**http://127.0.0.1:39069**

ou

**http://localhost:39069**

## 📋 Passo a passo para testar um plugin

### 1. Acesse a interface web
- Abra o navegador no endereço acima
- Você verá a interface do simulador com uma área de log à esquerda, o teclado virtual no centro, e configurações à direita

### 2. O plugin já está carregado, MAS precisa do serviço principal!
- O plugin "Analog Clock" já está na pasta `plugins/`
- O simulador detecta automaticamente todos os plugins nessa pasta
- **⚠️ IMPORTANTE**: Você verá a mensagem "Por favor inicie o serviço principal primeiro"

### 3. Inicie o serviço principal do plugin:

**Opção A - Abrir o app.html diretamente (MAIS FÁCIL):**

Copie e cole esta URL completa no seu navegador (em uma **NOVA ABA**):

```
http://localhost:39069/com.ulanzi.analogclock.ulanziPlugin/plugin/app.html?address=127.0.0.1&port=39069&language=pt_BR&uuid=com.ulanzi.ulanzideck.analogclock
```

Você verá uma página em branco - isso é normal! O serviço está rodando em background.

**IMPORTANTE**: Deixe essa aba aberta! Ela é o "cérebro" do plugin.

**Opção B - Usar o botão "Atualizar lista de plugins":**

1. Na interface do simulador, clique em "Atualizar lista de plugins"
2. Isso recarrega os plugins, mas ainda pode precisar da Opção A

### 4. Como usar (DEPOIS de iniciar o serviço principal):
1. Na lista à esquerda, você verá o plugin "Analog Clock"
2. **Arraste** o ícone do relógio para um dos 9 botões do teclado virtual
3. O relógio começará a funcionar no botão
4. Na área inferior, você verá as opções de configuração (PropertyInspector)
5. Altere as configurações e veja as mudanças em tempo real

### 5. Verificando se está funcionando:
- Na área de log (esquerda), você deve ver: "Lista de plugins carregada com sucesso!"
- Quando você abre o app.html, a mensagem de erro deve desaparecer
- O overlay "Por favor inicie o serviço principal primeiro" vai sumir

### 4. Área de Log
- A área à esquerda mostra mensagens do sistema
- Você verá quando plugins são carregados, quando serviços principais conectam, etc.

## 🔧 Como adicionar mais plugins para teste

1. Copie a pasta do plugin para: `UlanziDeckSimulator/plugins/`
2. A estrutura deve ser: `plugins/com.seuusuario.seuplugin.ulanziPlugin/`
3. Clique em **"Atualizar lista de plugins"** na interface web
4. O novo plugin aparecerá na lista

## ⚙️ Configurações importantes

**Idioma**: Por padrão está em Chinês (zh_CN). Você pode alterar para:
- `en` (Inglês)
- `pt_BR` (Português - se o plugin tiver esse arquivo de tradução)

**Carregar action**: 
- **Não** (padrão): Você precisa abrir manualmente o PropertyInspector no navegador
- **Sim**: O simulador carrega automaticamente (pode causar conflitos se você abrir manualmente)

## 🐛 Depuração

### Para depurar o PropertyInspector (a página de configuração):
1. Arraste o plugin para um botão
2. Na área de log, copie a URL que aparece (algo como):
   ```
   http://127.0.0.1:39069/com.ulanzi.analogclock.ulanziPlugin/property-inspector/clock/inspector.html?address=127.0.0.1&port=39069&language=zh_CN&uuid=...
   ```
3. Cole essa URL em uma nova aba do navegador
4. Abra o **DevTools** (F12) para ver console e depurar

### Para depurar o serviço principal (app.html):
- Se o plugin usa `app.html`: ele é carregado automaticamente
- Se usa `app.js` (Node): você precisa iniciar manualmente:
  ```cmd
  cd plugins/com.ulanzi.analogclock.ulanziPlugin
  node plugin/app.js 127.0.0.1 39069 pt_BR
  ```

## 🛑 Como parar o simulador

No terminal/PowerShell, pressione **Ctrl+C**

Ou encontre o processo e mate:
```powershell
# Encontrar o processo
Get-Process -Name node | Where-Object {$_.Path -like "*UlanziDeckSimulator*"}

# Matar o processo (substitua PID pelo número real)
Stop-Process -Id <PID>
```

## 📚 Arquivos importantes

- `manifest.json` - Define o plugin (ícones, ações, UUID, etc.)
- `plugin/app.html` ou `app.js` - Serviço principal do plugin
- `property-inspector/*/inspector.html` - Interface de configuração de cada action
- `en.json` / `zh_CN.json` / `pt_BR.json` - Arquivos de tradução

## 💡 Dicas

1. **Clique com botão direito** nos botões do teclado virtual para:
   - Executar
   - Remover
   - Definir como ativo/inativo

2. **Sempre clique em "Atualizar lista de plugins"** após modificar um plugin

3. **Verifique a área de log** - ela te diz se o serviço principal está conectado ou não

4. **DevTools é seu amigo** - use F12 para ver erros no console do navegador

## ⚠️ Problemas comuns

ua### ❌ "Por favor inicie o serviço principal primeiro" (PROBLEMA MAIS COMUM!)

**O que significa?**
O plugin precisa que seu "serviço principal" (app.html ou app.js) esteja rodando e conectado ao servidor WebSocket.

**Solução para o Analog Clock:**

1. **Abra uma NOVA ABA no navegador** e cole esta URL:
   ```
   http://localhost:39069/com.ulanzi.analogclock.ulanziPlugin/plugin/app.html?address=127.0.0.1&port=39069&language=pt_BR&uuid=com.ulanzi.ulanzideck.analogclock
   ```

2. **Deixe essa aba aberta!** Ela é o serviço principal do plugin.

3. **Volte para a aba do simulador** (http://localhost:39069)

4. **Agora a mensagem de erro deve ter sumido!**

**Por que isso acontece?**
- Plugins HTML (como o Analog Clock) precisam que o navegador carregue o `app.html`
- Esse arquivo se conecta ao servidor WebSocket e fica "ouvindo" eventos
- Sem ele, o plugin não pode funcionar

**Para outros plugins:**
- Se o plugin usa Node.js (CodePath aponta para .js), você precisa iniciar via terminal
- Veja a seção "Depuração" acima

### Porta já em uso (EADDRINUSE)
- O simulador já está rodando
- Acesse http://localhost:39069 no navegador

### Plugin não aparece
- Verifique se a pasta está em `plugins/`
- Verifique se o `manifest.json` está correto
- Clique em "Atualizar lista de plugins"

---

## 🎯 Resumo rápido

```
1. npm install (já feito ✅)
2. npm start (inicia o servidor) ✅
3. Abrir http://localhost:39069 no navegador 👈 FAÇA ISSO AGORA!
4. A página de ajuda abrirá automaticamente na primeira vez 🎉
5. Arrastar plugin para botão
6. Configurar e testar
```

### 🆕 Novo Comportamento Automático:

**Na primeira vez que você acessar o simulador**, se houver plugins que precisam do serviço principal:
- ✅ A página de ajuda abre **automaticamente** em uma nova aba
- ✅ Uma mensagem aparece no log explicando o problema
- ✅ O botão verde "❓ Como iniciar o plugin" fica visível para reabrir a ajuda

**Nas próximas vezes:**
- A ajuda não abre automaticamente (você já viu)
- Mas ainda verá a mensagem no log se houver plugins desconectados
- Pode clicar no botão verde para ver a ajuda novamente

**No terminal/console:**
- Ao rodar `npm start`, você verá instruções completas
- Incluindo a URL do serviço principal pronta para copiar e colar

**O simulador está pronto! Abra o navegador agora! 🚀**

