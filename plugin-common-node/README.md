# ulanzideck-plugin-sdk-node

<p align="start">
   <strong>Português (BR)</strong> | <a href="./README.en.md">English</a> | <a href="./README.zh.md">简体中文</a>
</p>

## Introdução
O ulanzideck-plugin-sdk encapsula a conexão WebSocket com o UlanziDeck e seus eventos de comunicação relacionados. Isso simplifica o processo de desenvolvimento e permite que os desenvolvedores se comuniquem com o UlanziDeck por meio de chamadas de eventos simples, permitindo que se concentrem mais no desenvolvimento das funções do plugin.


```bash
A versão atual foi desenvolvida de acordo com o Protocolo de Desenvolvimento de Plugin JS da Ulanzi - V1.2.2.
```


## Estrutura de diretórios
```bash
plugin-common-node   //Pacote node do ulanzideck-plugin-sdk
├── libs
│   ├── constants.js      //Constantes de eventos do UlanziDeck
│   ├── randomPort.js      //Gera uma porta aleatória para o serviço node
│   ├── utils.js          //Encapsulamento de alguns métodos comuns
│   └── ulanzideckApi.js    //Inclui o encapsulamento de todos os eventos do UlanziDeck, conexão websocket
├── index.js  //Arquivo de entrada
```


## Instruções

### Algumas instruções e convenções

1. O serviço principal da biblioteca do plugin (por exemplo, app.js) estará sempre conectado ao UlanziDeck. Implementa as principais funções do plugin, recebe alterações nos parâmetros da ação, atualiza o status dos ícones, etc.

2. A ação da biblioteca do plugin (por exemplo, inspector.html). A página será destruída após alternar o botão do UlanziDeck, portanto não é apropriado fazer processamento funcional. É usado principalmente para enviar parâmetros ao UlanziDeck e sincronizar parâmetros do UlanziDeck.

3. Para gerenciamento unificado, o nome do nosso pacote de plugin é com.ulanzi.nomeplugin.ulanziPlugin

4. Para o uso normal da biblioteca ulanzideck-plugin-sdk, concordamos que o comprimento do uuid da conexão do serviço principal é 4. Exemplo: com.ulanzi.ulanzideck.nomeplugin

5. O uuid da conexão da ação deve ser maior que 4 para diferenciação. Exemplo: com.ulanzi.ulanzideck.nomeplugin.acaoplugin

6. Ao usar node como serviço principal, para evitar conflitos de porta, use o RandomPort fornecido pelo plugin-common-node para gerar portas. Para detalhes, consulte [<a href="#title-2">2. Gerar porta aleatória</a>]

7. Devido à diferença entre o ambiente node local e o ambiente node do host, e alguns bugs que ocorrerão quando o caminho local for obtido após o programa ser empacotado, fornecemos o método <strong>Utils.getPluginPath()</strong> para obter o caminho local da raiz do plugin, que você pode usar conforme necessário. Para detalhes, consulte [<a href="#title-3">3. Obter o caminho para o diretório raiz do plugin</a>]


### Como usar

#### * context (Um parâmetro especial)

Uma função de ação pode ser configurada em várias teclas, então a biblioteca ulanzideck-plugin-sdk concatena um valor único <strong>context</strong>. Quando criamos uma instância de recurso, só precisamos salvar o valor único <strong>context</strong>. Se você precisar atualizar os dados, pode enviar a mensagem para o valor de tecla correspondente com base no valor único <strong>context</strong> correspondente.

```bash
1. O parâmetro especial context, que é um valor único concatenado da biblioteca comum, é passado para o serviço principal e a ação junto com a mensagem recebida.

2. A regra de concatenação para context é uuid + '___' + key + '__' + actionid, gerado pelo correspondente $UD.encodeContext(msg).

3. Também fornecemos $UD.decodeContext(context) para desconstruir valores únicos e retornar { uuid, key, actionid }.

4. Como o parâmetro do evento clear está na forma de um array, o context do clear é emendado no parâmetro. Por favor, preste atenção à obtenção de loop ao fazer o processamento de clear.

```

#### 1. Instalação

1. Baixe <strong>plugin-common-node</strong> localmente e copie a pasta para o diretório de execução.
2. <strong>plugin-common-node</strong> é baseado em <strong>ws</strong>, então você precisa instalar os pacotes de dependência <strong>ws</strong> no diretório raiz do projeto.
3. Então você pode referenciá-lo de acordo com a localização da pasta.

#### <span id="title-2">2. Gerar porta aleatória</span>

Após chamar o método <strong>getPort()</strong> da interface gerada aleatoriamente, um ws-port.js será gerado automaticamente no serviço principal do plugin, e o conteúdo do arquivo js é <strong>window.__port = número da porta</strong>;
O HTML da ação pode ser conectado ao serviço node principal introduzindo um arquivo 'ws-port.js' para obter a porta do serviço principal


```js
import { RandomPort } from './actions/plugin-common-node/index.js';

const generatePort = new RandomPort(); 

//Gerar porta aleatória
const port = generatePort.getPort(); 

```


#### <span id="title-3">3. Obter o caminho para o diretório raiz do plugin</span>

O método <strong>Utils.getPluginPath()</strong> pode obter o caminho local do diretório raiz do plugin, que é compatível com sistemas Windows e Mac, e pode ser usado conforme necessário.

```js
import { Utils } from './actions/plugin-common-node/index.js';

//Obter o caminho do arquivo do diretório raiz
const _pluginPath = Utils.getPluginPath()

console.log('Caminho do plugin: ', _pluginPath)

```



#### 4. Conectar ao UlanziDeck
Tomando a página html da ação como exemplo para demonstrar brevemente alguns métodos. Para detalhes, consulte [<a href="#title-5">5. Receber eventos (UlanziDeck->plugin)</a>][<a href="#title-6">6. Enviar Eventos (plugin->UlanziDeck)</a>]
```js
  import { UlanzideckApi } from './actions/plugin-common-node/index.js';;

  const $UD = new UlanzideckApi();
  //Conectar ao websocket do UlanziDeck. Após conexão bem-sucedida, o evento onConnected será acionado
  $UD.connect('com.ulanzi.ulanzideck.teamspeak5');

  $UD.onConnected(conn => {
    //Conectado
  })

  //Receber eventos quando a ação é arrastada para o teclado
  $UD.onAdd( message => {
    //Salvar a instância da ação
  })

  //Receber os parâmetros de inicialização da ação
  $UD.onParamFromApp( message => {
      //Salvar parâmetros de inicialização da ação
  })


  //Receber eventos de limpeza do plugin
  $UD.onClear( message => {
    if(message.param){
      for(let i = 0; i<message.param.length; i++){
        const context = message.param[i].context
        console.log('===context clear', context)

      }
    }
  })

  //Definir o ícone do UlanziDeck
  function serIcon(context, data, text){
    $UD.setBaseDataIcon(context, data, text) 
  }


```

#### <span id="title-5" >5. Receber eventos (UlanziDeck->plugin)</span>
```js
/**
 * Ouvir eventos de conexões websocket e eventos do UlanziDeck
*/
1. $UD.onConnected(conn => ())  //A conexão websocket ao UlanziDeck foi bem-sucedida
2. $UD.onClose(conn => ())  //A conexão websocket foi fechada
3. $UD.onError(conn => ())  //Erro de conexão websocket
4. $UD.onAdd(message => ())     //Receber evento "cmd": "add" do UlanziDeck
5. $UD.onParamFromApp(message => ())  //Receber evento "cmd": "paramfromapp" do UlanziDeck
6. $UD.onParamFromPlugin(message => ())  //Receber evento "cmd": "paramfromplugin" do UlanziDeck
7. $UD.onRun(message => ())  //Receber evento "cmd": "run" do UlanziDeck
8. $UD.onSetActive(message => ())  //Receber evento "cmd": "setactive" do UlanziDeck
9. $UD.onClear(message => ())  //Receber evento "cmd": "clear" do UlanziDeck
10. $UD.onSelectdialog(message => ())  //Receber evento "cmd": "selectdialog" do UlanziDeck. Usado para receber os resultados de seleção de arquivos/pastas

```

#### <span id="title-6">6. Enviar Eventos (plugin->UlanziDeck)</span>

```js
/**
 * Enviar parâmetros ao UlanziDeck
 * @param {object} settings Obrigatório | parâmetros
 * @param {object} context Opcional | Valor único. Não é necessário passar. Não precisa ser passado quando enviado da página de ação. Deve ser passado quando enviado do serviço principal.
*/
1. $UD.sendParamFromPlugin(settings, context) 

/**
 * Definir ícone - usar o número da lista de ícones na configuração, consulte manifest.json.
 * @param {string} context Obrigatório | Valor único, a biblioteca ulanzideck-plugin-sdk na mensagem recebida será automaticamente emendada e fornecida.
 * @param {number} state Obrigatório | Número da lista de ícones
 * @param {string} text Opcional | Se o ícone exibe texto
*/
2. $UD.setStateIcon(context, state, text) 


  /**
 * Definir ícone - usar ícone personalizado
 * @param {string} context Obrigatório | Valor único, a biblioteca ulanzideck-plugin-sdk na mensagem recebida será automaticamente emendada e fornecida.
 * @param {string} data Obrigatório | ícone em formato base64
 * @param {string} text Opcional | Se o ícone exibe texto
*/
3. $UD.setBaseDataIcon(context, data, text) 


/**
 * Definir ícone - usar arquivo de imagem local
 * @param {string} context Obrigatório | Valor único, a biblioteca ulanzideck-plugin-sdk na mensagem recebida será automaticamente emendada e fornecida.
 * @param {string} path  Obrigatório | Caminho da imagem local, suporta abrir links de URL no diretório raiz do plugin (links começando com / ./)
 * @param {string} text Opcional | Se o ícone exibe texto
*/
4. $UD.setPathIcon(context, path, text) 


/**
 * Definir ícone - usar gif personalizado
 * @param {string} context Obrigatório | Valor único, a biblioteca ulanzideck-plugin-sdk na mensagem recebida será automaticamente emendada e fornecida.
 * @param {string} gifdata Obrigatório | Dados codificados em Base64 de gif personalizado
 * @param {string} text Opcional | Se o ícone exibe texto
*/
5. $UD.setGifDataIcon(context, gifdata, text) 



  /**
 * Definir ícone - usar arquivo gif local
 * @param {string} context Obrigatório | Valor único, a biblioteca ulanzideck-plugin-sdk na mensagem recebida será automaticamente emendada e fornecida.
 * @param {string} gifdata  Obrigatório | Caminho da imagem gif local, suporta abrir links de URL no diretório raiz do plugin (links começando com / ./)
 * @param {string} text Opcional | Se o ícone exibe texto
*/
6. $UD.setGifPathIcon(context, gifpath, text) 


/**
 * Uma mensagem toast aparece no UlanziDeck solicitante
 *  @param {string} msg Obrigatório | Prompt de mensagem em nível de janela
*/
7. $UD.toast(msg) 

/**
 * Solicitar que o UlanziDeck abra uma caixa de diálogo de seleção: selecionar arquivo
 *  @param {string} filter Opcional | Filtro de arquivo. Filtrar tipo de arquivo, como "filter": "image(*.jpg *.png *.gif)" ou filtrar arquivo file(*.txt *.json) etc.
 * Por favor, receba o resultado da seleção desta solicitação através do evento onSelectdialog
*/
8. $UD.selectFileDialog(filter) 


/**
 * Solicitar que o UlanziDeck abra uma caixa de diálogo de seleção: selecionar uma pasta
 * Por favor, receba o resultado da seleção desta solicitação através do evento onSelectdialog
*/
9. $UD.selectFolderDialog() 


/**
 * Solicitar que o UlanziDeck use o navegador para abrir a url
 * @param {string} url Obrigatório | Suporta caminhos remotos e caminhos locais, suporta abrir links de url no diretório raiz do plugin (links começando com / ./)
 *                                Só pode ser o caminho básico e não pode levar parâmetros. Se você precisar levar parâmetros, por favor, defina-os no valor do parâmetro.
 * @param {local} boolean Opcional | true se for um caminho local
 * @param {object} param Opcional | Valores de parâmetro do caminho.
*/
10. $UD.openUrl(url, local, param)


/**
 * Solicitar que o UlanziDeck exiba uma janela pop-up; Após a janela pop-up, test.html precisa fechá-la ativamente, e testar para window.close() para notificar o fechamento da janela pop-up
 *  @param {string} url Obrigatório | Caminho HTML local. Só pode ser o caminho básico e não pode levar parâmetros. Se você precisar levar parâmetros, por favor, defina-os no valor do parâmetro.
 * @param {string} width Opcional | Largura da janela, padrão 200
 * @param {string} height Opcional | Altura da janela, padrão 200
 * @param {string} x Opcional | A coordenada x da janela. Se nenhum valor for passado, será centralizado por padrão.
 * @param {string} y Opcional | A coordenada y da janela. Se nenhum valor for passado, será centralizado por padrão.
 * @param {object} param Opcional | Valores de parâmetro do caminho.
*/
11. $UD.openView(url, width = 200, height = 200, x , y, param)



```

