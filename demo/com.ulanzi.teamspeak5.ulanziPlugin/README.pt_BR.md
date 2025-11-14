# com.ulanzi.ulanzideck.teamspeak5 (exemplo Node)

<p align="start">
   <a href="./README.md">English</a> | <strong>Português (BR)</strong>
</p>

## Introdução
Este projeto demonstra o uso da biblioteca comum em ambiente Node.js através do plugin TeamSpeak5.

> Observação: Esta versão foi escrita de acordo com o protocolo Ulanzi JS Plugin Development - V1.2.2

## Estrutura de arquivos

```
com.ulanzi.teamspeak5.ulanziPlugin
├── assets         // Armazena ícones do host e imagens de estado das actions
│   ├── icons
│       └── icon.png
│   └── actions   // Ícones para alternância de estados das actions
├── dist           // Arquivos gerados após build (evita empacotar node_modules no plugin original)
├── libs           // Bibliotecas comuns (consulte UlanziTechnology/plugin-common-html e plugin-common-node para detalhes)
├── plugin         // Código-fonte Node usado para executar o serviço principal e actions
│   ├── actions
│       ├── plugin-common-node  // Biblioteca Node comum (veja UlanziTechnology/plugin-common-node)
│       └── ...   // Outras actions e módulos
│   └── app.js    // Serviço principal (pode usar plugin-common-node para conectar ao host)
├── property-inspector // Configurações e formulários (cada action tem seu próprio inspector)
│   ├── afk
│       ├── inspector.html
│       └── inspector.js
│   └── ...
├── manifest.json  // Manifest do plugin (veja protocolo para detalhes)
├── package.json   // Dependências do projeto
├── webpack.config.js // Configuração de build
├── zh_CN.json     // Tradução em chinês
├── en.json        // Tradução em inglês
```

## Observações e convenções

1. O serviço principal do plugin (ex.: `app.js`) mantém a conexão com o host para funcionalidades como atualização de ícones.

2. As páginas de configuração (ex.: `inspector.html`) representam as actions; após alternar a action, o formulário pode ser destruído — por isso evite lógica pesada no inspector. Use-o principalmente para enviar configurações e sincronizar dados.

3. Nomenclatura: pacotes devem ter o formato `com.ulanzi.<pluginName>.ulanziPlugin`.

4. UUIDs:
   - UUID do serviço principal tem comprimento 4 (ex.: `com.ulanzi.ulanzideck.<pluginName>`).
   - UUID das actions é maior que 4 (ex.: `com.ulanzi.ulanzideck.<pluginName>.<action>`).

5. Ao usar Node.js para o serviço principal, gere portas com `RandomPort` (fornecido por `plugin-common-node`) para evitar conflitos.

6. Para obter o caminho local do plugin (após empacotamento ou em ambientes diferentes), use `Utils.getPluginPath()` da biblioteca `plugin-common-node`.

## Dependências importantes (exemplo do package.json)

- Dependência essencial para `common-node` (WebSocket):
  - "ws": "^8.18.0"

- Bibliotecas recomendadas para desenhar ícones:
  - "@svgdotjs/svg.js": "3.2.4"
  - "svgdom": "0.1.19"

- Dependências de build (devDependencies) usadas em exemplos: Babel, Webpack, minificadores etc.

## Desenvolvimento e depuração

### Instalar dependências
```
npm install
```

### Build
```
npm run build
```

### Executar localmente
1. Durante desenvolvimento, após instalar dependências, execute `node plugin/app.js` para iniciar o serviço principal.
2. Após build, use `node dist/app.js` para testar o bundle.

### Integração com o simulador
1. Para depuração: aponte `CodePath` em `manifest.json` para `plugin/app.js`.
2. Após build/empacotamento, atualize `CodePath` para `dist/app.js`.


