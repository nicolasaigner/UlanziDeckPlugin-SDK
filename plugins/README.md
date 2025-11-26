# Plugins Personalizados - UlanziDeck

Esta pasta contém os plugins personalizados desenvolvidos para o UlanziDeck.

## 📁 Estrutura

```
plugins/
├── com.ulanzi.samsungmonitor.ulanziPlugin/  # Plugin de controle do Samsung Monitor
└── [outros plugins futuros]
```

## 🔗 Links Simbólicos

Os plugins nesta pasta são vinculados à pasta de plugins do UlanziDeck via links simbólicos. Isso permite que você edite o código aqui e as alterações sejam refletidas automaticamente no UlanziDeck.

### Localização dos Plugins no UlanziDeck:
```
C:\Users\Nicolas\AppData\Roaming\Ulanzi\UlanziDeck\Plugins\
```

### Como Funciona:

Quando você edita um arquivo aqui:
```
plugins/com.ulanzi.samsungmonitor.ulanziPlugin/plugin/app.js
```

As alterações aparecem automaticamente em:
```
C:\Users\Nicolas\AppData\Roaming\Ulanzi\UlanziDeck\Plugins\com.ulanzi.samsungmonitor.ulanziPlugin\plugin\app.js
```

## 🚀 Criar Link Simbólico para um Novo Plugin

Para criar um link simbólico para um novo plugin, use o script `create-symlink.ps1`:

```powershell
.\create-symlink.ps1 -PluginName "com.ulanzi.meuplugin.ulanziPlugin"
```

Ou manualmente (execute como Administrador):

```powershell
New-Item -ItemType SymbolicLink `
  -Path "C:\Users\Nicolas\AppData\Roaming\Ulanzi\UlanziDeck\Plugins\[NOME_DO_PLUGIN]" `
  -Target "C:\Users\Nicolas\SSD_1TB\PROJETOS\UlanziDeckPlugin-SDK\plugins\[NOME_DO_PLUGIN]"
```

## 📝 Workflow de Desenvolvimento

1. **Desenvolva** seu plugin nesta pasta (`plugins/`)
2. **Crie** o link simbólico usando o script
3. **Reinicie** o UlanziDeck para carregar o plugin
4. **Edite** os arquivos aqui - as mudanças são imediatas
5. **Teste** no UlanziDeck

## ✅ Plugins Ativos

### Samsung Monitor Control
- **Pasta:** `com.ulanzi.samsungmonitor.ulanziPlugin/`
- **Função:** Controla mute/unmute do Samsung Monitor M5 via SmartThings API
- **Status:** ✅ Link simbólico ativo
- **Localização:** `C:\Users\Nicolas\AppData\Roaming\Ulanzi\UlanziDeck\Plugins\com.ulanzi.samsungmonitor.ulanziPlugin`

## 🔧 Comandos Úteis

### Verificar se o link simbólico existe:
```powershell
Get-Item "C:\Users\Nicolas\AppData\Roaming\Ulanzi\UlanziDeck\Plugins\[NOME_DO_PLUGIN]" | Select-Object Mode, Target
```

### Listar todos os links simbólicos:
```powershell
Get-ChildItem "C:\Users\Nicolas\AppData\Roaming\Ulanzi\UlanziDeck\Plugins" | Where-Object {$_.LinkType -eq "SymbolicLink"} | Select-Object Name, Target
```

### Remover um link simbólico:
```powershell
Remove-Item "C:\Users\Nicolas\AppData\Roaming\Ulanzi\UlanziDeck\Plugins\[NOME_DO_PLUGIN]" -Force
```

## ⚠️ Importante

- **Não copie** os plugins manualmente para a pasta do UlanziDeck - use links simbólicos
- **Sempre desenvolva** na pasta `plugins/` deste projeto
- **Reinicie** o UlanziDeck após criar um novo link simbólico
- Os links simbólicos **não são versionados** no Git (são criados localmente)

## 🐛 Problemas Comuns

### Link simbólico não funciona
- Certifique-se de executar o PowerShell como **Administrador**
- Verifique se o caminho de origem está correto
- No Windows 10+, links simbólicos requerem privilégios de admin ou modo desenvolvedor ativado

### Plugin não aparece no UlanziDeck
1. Verifique se o link simbólico foi criado corretamente
2. Reinicie o UlanziDeck
3. Verifique se o `manifest.json` está correto
4. Veja os logs do UlanziDeck para erros

### Alterações não aparecem
- Se você alterou o `manifest.json`, reinicie o UlanziDeck
- Para código JavaScript, pode ser necessário reiniciar o plugin ou o UlanziDeck
- Verifique se você está editando o arquivo na pasta correta (`plugins/`)

## 📚 Documentação

Para mais informações sobre desenvolvimento de plugins:
- [README Principal](../README.md)
- [plugin-common-node](../plugin-common-node/README.md)
- [plugin-common-html](../plugin-common-html/README.md)

---

**Desenvolvido com ❤️ para o UlanziDeck**

