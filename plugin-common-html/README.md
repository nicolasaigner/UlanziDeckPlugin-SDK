# ulanzideck-plugin-sdk-html

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
libs   //Esta pasta contém as funções da biblioteca comum do plugin
├── css
│   └── udpi.css      //Estilo comum, escrever html de acordo com o formato convencional pode ter efeito
├── js
│   ├── constants.js      //Constantes de eventos do UlanziDeck
│   ├── eventEmitter.js   //Emissor de Eventos
│   ├── timers.js         //Usado para melhorar o desempenho
│   ├── utils.js          //Alguns métodos comuns de encapsulamento, bem-vindo para adicionar, as principais funções atuais: obter o formulário do html da ação e o formulário que recarrega o html da ação
│   └── ulanzideckApi.js    //Inclui o encapsulamento de todos os eventos do UlanziDeck, conexão websocket e processamento de localização
├── assets
│   └── xxx.png          //Ícone CSS necessário, não precisa alterar

```


## Instruções

### Algumas instruções e convenções

1. O serviço principal da biblioteca do plugin (por exemplo, app.html) estará sempre conectado ao UlanziDeck. Implementa as principais funções do plugin, recebe alterações nos parâmetros da ação, atualiza o status dos ícones, etc.

2. A ação da biblioteca do plugin (por exemplo, inspector.html). A página será destruída após alternar o botão do UlanziDeck, portanto não é apropriado fazer processamento funcional. É usado principalmente para enviar parâmetros ao UlanziDeck e sincronizar parâmetros do UlanziDeck.

3. Para gerenciamento unificado, o nome do nosso pacote de plugin é com.ulanzi.nomeplugin.ulanziPlugin

4. Para o uso normal da biblioteca ulanzideck-plugin-sdk, concordamos que o comprimento do uuid da conexão do serviço principal é 4. Exemplo: com.ulanzi.ulanzideck.nomeplugin

5. O uuid da conexão da ação deve ser maior que 4 para diferenciação. Exemplo: com.ulanzi.ulanzideck.nomeplugin.acaoplugin

6. O arquivo de localização é colocado no diretório raiz do plugin, que está no mesmo nível das libs do ulanzideck-plugin-sdk. (Para as regras de escrita de arquivos json localizados, você pode visualizar o exemplo de demonstração) Exemplo: zh_CN.json en.json ja_JP.json de_DE.json zh_HK.json pt_BR.json

7. Para unificar as fontes da interface do usuário, configuramos a fonte de código aberto Source Han Sans SC no udpi.css, e também precisamos referenciar a biblioteca de fontes no app.html. Por favor, use 'Source Han Sans SC' uniformemente ao desenhar ícones.

8. A cor de fundo do UlanziDeck é '#282828', e o css genérico (udpi.css) foi definido para '--udpi-bgcolor: #282828;'. Se você quiser personalizar a cor de fundo da ação, ela deve ser a mesma cor de fundo do UlanziDeck, para evitar que a cor de fundo do plugin seja muito abrupta.


### Como usar

```bash
Para detalhes sobre o uso e especificações de pastas do ulanzideck-plugin-sdk, consulte demo/com.ulanzi.analogclock.ulanziPlugin.
A seguir, uma breve descrição de como usar:
```

#### * context (Um parâmetro especial)

Uma função de ação pode ser configurada em várias teclas, então a biblioteca ulanzideck-plugin-sdk concatena um valor único <strong>context</strong>. Quando criamos uma instância de recurso, só precisamos salvar o valor único <strong>context</strong>. Se você precisar atualizar os dados, pode enviar a mensagem para o valor de tecla correspondente com base no valor único <strong>context</strong> correspondente.

```bash
1. O parâmetro especial context, que é um valor único concatenado da biblioteca comum, é passado para o serviço principal e a ação junto com a mensagem recebida.

2. A regra de concatenação para context é uuid + '___' + key + '__' + actionid, gerado pelo correspondente $UD.encodeContext(msg).

3. Também fornecemos $UD.decodeContext(context) para desconstruir valores únicos e retornar { uuid, key, actionid }.

4. Como o parâmetro do evento clear está na forma de um array, o context do clear é emendado no parâmetro. Por favor, preste atenção à obtenção de loop ao fazer o processamento de clear.

```

#### 1. Importar arquivos do ulanzideck-plugin-sdk
```html
/**
 * O ulanzideckApi.js depende de eventEmitter.js e utils.js, que precisam ser referenciados na página html na seguinte ordem
*/

<script src="../../libs/js/constants.js"></script>
<script src="../../libs/js/eventEmitter.js"></script>
<script src="../../libs/js/timers.js"></script>
<script src="../../libs/js/utils.js"></script>
<script src="../../libs/js/ulanzideckApi.js"></script>

```

#### 2. Como o html se adapta ao udpi.css
```html
/**
 * Tomando a página html da ação como exemplo
*/


<!-- Os itens da ação precisam ser envolvidos em form, e os itens são associados com o atributo name. -->
<!-- Depois disso, você pode usar Utils.getFormValue() para obter os dados do formulário e Utils.setFormValue() para recarregar os dados do formulário. -->
<form id="property-inspector">   


  <!-- O rótulo e o valor do item de configuração são envolvidos com div.udpi-item, o rótulo usa o nome de classe udpi-item-label, e o valor usa o nome de classe udpi-item-value. -->
  <div class="udpi-item">
    
    <!-- data-localize. O primeiro método indica que a localização é necessária. A página de escrita usa inglês por padrão, e o SDK traduz de acordo com o conteúdo. Configure o json correspondente no diretório raiz, como zh_CN.json -->
    <div class="udpi-item-label" data-localize>Name</div>
    <input type="text" class="udpi-item-value" name="name" value="test">
  </div>
  <div class="udpi-item">
    <div class="udpi-item-label" data-localize>Face</div>
    <select class="udpi-item-value select clockSelector" name="clock_index" >
      <!-- data-localize. Na segunda maneira, depois que data-localize atribui um valor, o sdk obterá o conteúdo da tradução com base no valor. -->
      <option label="Blue" value="blue" data-localize="Blue"></option>
      <option label="Green" value="green" data-localize></option>
    </select>
  </div>
</form>

```

#### 3. Conectar ao UlanziDeck
Tomando a página html da ação como exemplo para demonstrar brevemente alguns métodos. Para detalhes, consulte [<a href="#title-4">4. Receber eventos (UlanziDeck->plugin)</a>][<a href="#title-5">5. Enviar Eventos (plugin->UlanziDeck)</a>]


```html

/**
 * $UD é uma instância do ulanzideckApi que se conecta ao websocket do UlanziDeck via $UD.connect(uuid).
 * 
*/

<script>
  //Conectar ao websocket do UlanziDeck. Após conexão bem-sucedida, o evento onConnected será acionado
  $UD.connect('com.ulanzi.ulanzideck.analogclock.clock');
  $UD.onConnected(conn => {
    //Conectado, nós dinâmicos podem ser renderizados aqui

  })


  //Arrastar para o botão
  $UD.onAdd( message => {
    //O recarregamento do formulário pode ser implementado aqui. Utils.setFormValue(message.param,form)
  })

  //Obter parâmetros de inicialização
  $UD.onParamFromApp( message => {
      //O recarregamento do formulário pode ser implementado aqui. Utils.setFormValue(message.param,form)
  })

  //Enviar parâmetros
  function sendData(params){
    $UD.sendParamFromPlugin(params)
  }

</script>

```

#### <span id="title-4" >4. Receber eventos (UlanziDeck->plugin)</span>
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

#### <span id="title-5">5. Enviar Eventos (plugin->UlanziDeck)</span>

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

