# Samsung Monitor Control - Plugin UlanziDeck

<p align="start">
   <strong>Português (BR)</strong> | <a href="./README.en.md">English</a>
</p>

## Descrição

Plugin para controlar o mute/unmute do seu Samsung Monitor M5 (ou outros modelos compatíveis) diretamente do UlanziDeck, utilizando a API do SmartThings.

## Recursos

- ✅ Alternar Mute/Unmute com um clique
- ✅ Indicador visual do estado (mutado/não mutado)
- ✅ Configuração fácil via Property Inspector
- ✅ Status de conexão em tempo real
- ✅ Suporte à API SmartThings

## Configuração

### 1. Obter Credenciais do SmartThings

Para usar este plugin, você precisa:

1. **Device ID**: O ID do seu dispositivo Samsung no SmartThings
2. **Personal Access Token (PAT)**: Um token de acesso pessoal do SmartThings

#### Como obter o Device ID:

1. Acesse [SmartThings Web](https://my.smartthings.com/)
2. Faça login com sua conta Samsung
3. Vá em "Devices" e selecione seu monitor
4. O Device ID estará na URL ou nas configurações do dispositivo

#### Como criar um Personal Access Token:

1. Acesse [SmartThings Personal Access Tokens](https://account.smartthings.com/tokens)
2. Clique em "Generate new token"
3. Dê um nome ao token (ex: "UlanziDeck")
4. Selecione as permissões necessárias:
   - ✅ `devices:read`
   - ✅ `devices:write`
   - ✅ `devices:execute`
5. Copie o token gerado (guarde em local seguro!)

### 2. Configurar o Plugin

1. Arraste a ação "Mute/Unmute" para uma tecla do UlanziDeck
2. Clique na tecla para abrir o Property Inspector
3. Cole o **Device ID** e o **Personal Access Token**
4. Aguarde o status mudar para "Conectado"

## Como Usar

- **Pressionar a tecla**: Alterna entre mute e unmute
- **Indicador visual**: 
  - 🔊 Ícone sem linha = Som ativado
  - 🔇 Ícone com linha = Som desativado

## Instalação

### Pré-requisitos

- Node.js instalado
- UlanziDeck instalado e configurado

### Instalação e Build

```bash
cd plugins/com.ulanzi.samsungmonitor.ulanziPlugin

# Instalar dependências
npm install

# Fazer build do plugin (OBRIGATÓRIO!)
npm run build
```

**⚠️ Importante:** O plugin precisa ser empacotado com Webpack antes de usar no UlanziDeck!

### Desenvolvimento

Para desenvolvimento com rebuild automático:

```bash
# Watch mode - rebuild automático ao editar
npm run dev
```

Para testar diretamente (desenvolvimento):

```bash
npm start
```

## Estrutura do Projeto

```
com.ulanzi.samsungmonitor.ulanziPlugin/
├── plugin/
│   ├── app.js                    # Arquivo principal do plugin
│   └── actions/
│       ├── smartthings.js        # Classe da API SmartThings
│       ├── mute.js               # Classe da ação Mute
│       └── plugin-common-node/   # Biblioteca comum Node.js
├── property-inspector/
│   └── mute/
│       └── inspector.html        # Interface de configuração
├── assets/
│   ├── icons/                    # Ícones do plugin
│   └── actions/
│       └── mute/                 # Ícones da ação mute
├── libs/                         # Biblioteca comum HTML
├── manifest.json                 # Manifesto do plugin
├── package.json                  # Dependências Node.js
└── README.md                     # Este arquivo
```

## Solução de Problemas

### Plugin não conecta

1. Verifique se o Device ID e Token estão corretos
2. Certifique-se de que seu monitor está online no SmartThings
3. Verifique os logs do console para erros

### Mute não funciona

1. Verifique se o monitor suporta o comando de mute via SmartThings
2. Teste manualmente no app SmartThings
3. Alguns monitores podem usar `audioVolume` em vez de `audioMute` (o plugin tenta ambos)

### Erro de conexão

- Verifique sua conexão com a internet
- Certifique-se de que o token tem as permissões corretas
- O token pode ter expirado - gere um novo

## Desenvolvimento

Este plugin foi desenvolvido usando:

- **plugin-common-node**: Biblioteca para comunicação com o UlanziDeck (Node.js)
- **plugin-common-html**: Biblioteca para interface de configuração (HTML)
- **axios**: Para requisições HTTP à API SmartThings

## Licença

MIT

## Autor

Nicolas

## Suporte

Para problemas ou dúvidas, abra uma issue no repositório.

---

**Nota**: Este plugin não é oficialmente afiliado à Samsung ou Ulanzi.

