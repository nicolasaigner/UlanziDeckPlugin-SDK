# com.ulanzi.analogclock.ulanziPlugin (exemplo em HTML)

<p align="start">
   <a href="./README.md">English</a> | <strong>Português (BR)</strong>
</p>

## Introdução
Este exemplo demonstra o uso da biblioteca comum (versão HTML) por meio do plugin analogclock.

> Observação: Esta versão foi escrita de acordo com o protocolo Ulanzi JS Plugin Development - V1.2.2

## Estrutura de arquivos

```
com.ulanzi.analogclock.ulanziPlugin
├── assets         // Armazena os ícones do host e imagens de estados das actions
│   └── icons      
│       └── icon.png
├── libs           // Biblioteca comum HTML usada pelas páginas action (consulte UlanziTechnology/plugin-common-html para detalhes)
├── plugin         // Módulos JS principais, incluindo lógica das actions
│   ├── actions    // Lógica das actions
│   ├── app.html   // Página principal (serviço principal)
│   └── app.js     // JS do serviço principal
├── property-inspector // Páginas de configuração e formulários (leitura/escrita)
│   └── clock      // Nome da action
│       ├── inspector.html  // HTML do inspector
│       └── inspector.js    // JS do inspector (socket e manipulação do formulário)
├── manifest.json  // Definição do plugin (veja o protocolo para detalhes)
├── zh_CN.json     // Arquivo de tradução em Chinês
├── en.json        // Arquivo de tradução em Inglês
```

## Uso e convenções

1. O serviço principal do plugin (ex.: `app.html`) mantém conexão com o host para funções principais, inclusive atualização de ícones.

2. Os formulários de configuração (ex.: `inspector.html`) correspondem às pages de action. Esses formulários são efêmeros após o envio e não devem conter lógica pesada; servem para enviar configurações ao host e sincronizar dados.

3. Nomenclatura: o pacote do plugin deve seguir o formato `com.ulanzi.<pluginName>.ulanziPlugin`.

4. Convenção de UUIDs:
   - O UUID do serviço principal tem comprimento 4 (ex.: `com.ulanzi.ulanzideck.<pluginName>`).
   - O UUID das actions tem comprimento maior que 4 para distinguir (ex.: `com.ulanzi.ulanzideck.<pluginName>.<action>`).

5. Arquivos de localização (`zh_CN.json`, `en.json`) ficam no diretório raiz do plugin.

6. Fonte:
   - Para uniformidade de UI, usamos a fonte Source Han Sans (思源黑体). A css `udpi.css` já a referencia; inclua a fonte em `app.html`.

7. Estética: o fundo do host é `#282828`. Para evitar contraste estranho, recomenda-se usar cor de fundo similar nas ações.

## Regras para arquivos de tradução

- Estrutura (exemplo `zh_CN.json`):
  - `Name`: nome do plugin
  - `Description`: descrição
  - `Actions`: lista de actions (cada action com `Name` e `Tooltip`)
  - `Localization`: chaves para tradução de strings usadas nas pages

- Existem duas estratégias de localização nas pages HTML:
  1. Tradução automática a partir do conteúdo em inglês (o SDK lê o texto em inglês presente no DOM e faz a correspondência com o arquivo de tradução).
  2. Uso de `data-localize` com uma chave explícita (ex.: `data-localize="Blue"`) — o SDK irá procurar essa chave no arquivo de tradução.

## Exemplo de `zh_CN.json`
(arquivo de exemplo já incluído no repositório)

