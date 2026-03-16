# ✅ SOLUÇÃO: Copiar Bibliotecas Manualmente

## 🐛 Problema

**Erro:** `$UD não está definido! Bibliotecas não foram carregadas.`

**Causa:** A pasta `libs/` está vazia! As bibliotecas JavaScript do UlanziDeck SDK não foram copiadas para o plugin.

---

## 📋 SOLUÇÃO MANUAL (FAÇA AGORA!)

### Passo 1: Copiar Pasta libs

**Abra o Windows Explorer e copie manualmente:**

**ORIGEM:**
```
C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\demo\com.ulanzi.analogclock.ulanziPlugin\libs
```

**DESTINO:**
```
C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\plugins\com.ulanzi.samsungmonitor.ulanziPlugin\
```

### Passo 2: Estrutura Esperada

Após copiar, você deve ter:

```
plugins/com.ulanzi.samsungmonitor.ulanziPlugin/
├── libs/
│   ├── assets/
│   │   ├── calendar.svg
│   │   ├── caret.svg
│   │   └── ... (outros SVGs)
│   ├── css/
│   │   └── udpi.css
│   └── js/
│       ├── constants.js
│       ├── eventEmitter.js
│       ├── timers.js
│       ├── utils.js
│       └── ulanzideckApi.js  ← ESTE É O PRINCIPAL!
```

### Passo 3: Verificar

**Execute no PowerShell:**

```powershell
Test-Path "C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\plugins\com.ulanzi.samsungmonitor.ulanziPlugin\libs\js\ulanzideckApi.js"
```

**Deve retornar:** `True`

---

## 🎯 Por Que o Copy-Item Não Funcionou?

Possíveis causas:
1. **Link simbólico** - A pasta está linkada e o PowerShell não está copiando através do link
2. **Permissões** - Pode precisar de admin
3. **Caminho muito longo** - Windows tem limite de 260 caracteres

---

## 🔧 SOLUÇÃO ALTERNATIVA (Usando Comando)

Se a cópia manual não funcionar, tente este comando **como Administrador**:

```powershell
# Executar PowerShell como Administrador
xcopy "C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\demo\com.ulanzi.analogclock.ulanziPlugin\libs" "C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\plugins\com.ulanzi.samsungmonitor.ulanziPlugin\libs" /E /I /H /Y
```

---

## ✅ Após Copiar

### 1. Verificar que funcionou:

```powershell
cd C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\plugins\com.ulanzi.samsungmonitor.ulanziPlugin

Get-ChildItem libs\js
```

**Deve mostrar:**
```
constants.js
eventEmitter.js
timers.js
utils.js
ulanzideckApi.js
```

### 2. Reiniciar UlanziDeck

**IMPORTANTE:** Fechar completamente e reabrir!

### 3. Testar Novamente

1. Arrastar ação para tecla
2. Abrir Property Inspector
3. Pressionar F12
4. **Agora deve mostrar:** `$UD disponível? true` ✅

---

## 📝 Checklist

- [ ] Pasta `libs/` copiada manualmente no Explorer
- [ ] Verificado que `libs/js/ulanzideckApi.js` existe
- [ ] UlanziDeck reiniciado
- [ ] Property Inspector aberto
- [ ] F12 pressionado
- [ ] Console mostra "$UD disponível? true"
- [ ] Sem erros vermelhos
- [ ] Campos preenchidos e salvos
- [ ] config.json criado

---

## 🎯 Próximos Passos

Após copiar as bibliotecas:

1. **Reinicie o UlanziDeck**
2. **Arraste a ação**
3. **Abra Property Inspector**
4. **Pressione F12** para ver console
5. **Deve aparecer:** `Samsung Monitor Inspector: Iniciando...` e `$UD disponível? true`
6. **Preencha Device ID e Token**
7. **Clique em Salvar**
8. **Veja nos logs:** `===== ATUALIZANDO CONFIGURAÇÕES GLOBAIS =====`
9. **Verifique:** `config.json` foi criado!

---

## 💡 Dica

As bibliotecas em `libs/` são as mesmas que estão em:
- `plugin-common-html/` (versão de referência)
- `demo/com.ulanzi.analogclock.ulanziPlugin/libs/` (cópia funcional)

Você pode copiar de qualquer uma dessas fontes!

---

**COPIE AS BIBLIOTECAS MANUALMENTE E TESTE NOVAMENTE! 📁➡️📁**

