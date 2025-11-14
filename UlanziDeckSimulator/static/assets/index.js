let ulanziLog = null; // nó de log
let plugins = null; // lista de plugins
let customMenu = null; // nó do menu personalizado
let config = {
  "language": "zh_CN",
  "loadAction": "no",
  "runMain": "no",
  "rootPath": "",
  serverPort: window.location.port
}  // configuração padrão

let activeKeys = {} // lista atual de plugins ativados
let currentActiveKey = ''; // plugin atualmente ativo

let contextmenuKey = ''; // chave do menu de contexto


const websocket = new WebSocket(`ws://127.0.0.1:${config.serverPort}/deckClient`)
websocket.onopen = function (evt) {

};
websocket.onclose = function (evt) {

}

websocket.onmessage = function (evt) {
  const jsonObj = JSON.parse(evt.data)
  if (jsonObj.cmd === 'log') {
    log(jsonObj)
  }
  if (jsonObj.cmd === 'listUpdated') {
    listUpdated(jsonObj.data)
  }
  if (jsonObj.cmd === 'init') {
    config = jsonObj.config
    activeKeys = jsonObj.activeKeys
    initRender()
  }
  if (jsonObj.cmd === 'state') {
    setStateIcon(jsonObj.param.statelist[0])
  }
  if (jsonObj.cmd === 'connectedMain') {
    connectedMain(jsonObj.connectedMain)
  }
  if (jsonObj.cmd === 'openurl') {
    window.open(jsonObj.url)
  }
  
}

function initRender(){
  setFormValue(config,form)
}

function connectedMain(data){
  for (const v of data) {
    const overlay = document.querySelector(`.slider-item-overlay[data-uuid="${v.UUID}"]`)
    overlay.style.display = 'none'
  }
}

function setStateIcon(iconData) {
  const data = iconData
  const { type, key } = data

  const uk = document.querySelector(`.ulanzi-key[data-key="${key}"]`)
  
  const ukImg = uk.getElementsByTagName('img')[0]
  let src = ''

  const { plugin, actionData, actionid, uuid } = activeKeys[key]

  if (type === 0) {
    // arquivo local, lista de estados
    src = `./${plugin}/${actionData.States[data.state].Image}`
  } else if ( type === 1) {
    // base64
    src = data.data
  } else if ( type === 3) {
    // gif em base64
    src = data.gifdata
  } else if ( type === 2) {
    // caminho absoluto local
    src = getRelativePath(data.path)
  } else if ( type === 4) {
    // caminho gif absoluto local
    src = getRelativePath(data.gifpath)
  }
  if(!ukImg){
    uk.innerHTML = `<img src="${src}">`
  }else{
    ukImg.src = src
  }

}


// obtém o caminho relativo, adaptando caminhos absolutos do host
function getRelativePath(path){
  let rPath = path;
  const sStr = 'UlanziDeckSimulator/plugins/';

  if(rPath.indexOf(sStr) >= 0){
    rPath = rPath.split(sStr)[1]
  }


  return rPath
}



async function listUpdated(data) {
  plugins = data
  let listBuffer = []
  for (const k in data) {
    const v = data[k]

    // console.log('===k',k)
    // console.log('===v',v)
    let renderDate = v[config.language +'_DATA'] ? v[config.language +'_DATA'] : v

    let liBuffer = []
    for (let i = 0; i < v.Actions.length; i++) {
      const action = renderDate.Actions[i] ? renderDate.Actions[i] : v.Actions[i]
      liBuffer.push(`<li class="draggable" draggable="true" data-action="${k + '___' + i}" title="${action.Tooltip}">
              <div class="icon-name action-icon">
                <img src="./${k}/${v.Actions[i]?.Icon}">
                <span>${action.Name}</span>
              </div>
            </li>`)
    }


    listBuffer.push(`
        <div class="ulanzi-slider-item">
          <div class="slider-item-title"  title="${renderDate.Description}">

            <div class="icon-name category-icon">
              <img src="./${k}/${v.Icon}">
              <span>${renderDate.Name}</span>
            </div>
          </div>
          <div class="slider-item-content">
            <ul class="slider-item-actions">
              ${liBuffer.join('')}
            </ul>
            <div class="slider-item-overlay" data-uuid="${v.UUID}">Por favor inicie o serviço principal primeiro</div>
          </div>
        </div>`)

  }
  document.querySelector("#ulanzi-list").innerHTML = listBuffer.join('')
  initializeDraggables()
}


function log(data) {

  // Cria um novo elemento div
  const logItem = document.createElement('div');
  logItem.className = 'log-item';

  // Cria o parágrafo que mostra a hora
  const logTime = document.createElement('p');
  logTime.className = 'log-time';
  logTime.textContent = `[${data.time}]`;
  logItem.appendChild(logTime);

  // Cria o parágrafo com a informação do log
  const logText = document.createElement('p');
  logText.textContent = data.msg;
  logItem.appendChild(logText);

  if (data.code) {
    // Cria a div do quadro de código
    const codeBox = document.createElement('div');
    codeBox.className = 'fence-box code-box';

    // Cria o span que mostra o código
    const codeSpan = document.createElement('span');
    codeSpan.textContent = data.code;
    codeBox.appendChild(codeSpan);
    logItem.appendChild(codeBox);
  }


  // Insere o logItem criado no nó alvo
  ulanziLog.insertBefore(logItem, ulanziLog.firstChild);
}

function toast(msg) {
  const tt = document.querySelector("#toast")
  tt.innerHTML = msg
  tt.style.display = "block"
  setTimeout(() => {
    tt.style.display = "none"
  }, 2000)
}

function time() {
  return new Date().toLocaleString('pt-BR', { hour12: false })
}



function getFormValue(form) {
  if (typeof form === 'string') {
    form = document.querySelector(form);
  }

  const elements = form ? form.elements : '';

  if (!elements) {
    console.error('Could not find form!');
  }

  const formData = new FormData(form);
  let formValue = {};

  formData.forEach((value, key) => {
    if (!Reflect.has(formValue, key)) {
      formValue[key] = value;
      return;
    }
    if (!Array.isArray(formValue[key])) {
      formValue[key] = [formValue[key]];
    }
    formValue[key].push(value);
  });

  return formValue;
}

function setFormValue(jsn, form) {
  if (!jsn) {
    return;
  }

  if (typeof form === 'string') {
    form = document.querySelector(form);
  }

  const elements = form ? form.elements:'';

  if (!elements) {
    console.error('Could not find form!');
  }

  Array.from(elements)
    .filter((element) => element?element.name:null)
    .forEach((element) => {
      const { name, type } = element;
      const value = name in jsn ? jsn[name] : null;
      const isCheckOrRadio = type === 'checkbox' || type === 'radio';

      if (value === null) return;

      if (isCheckOrRadio) {
        const isSingle = value === element.value;
        if (isSingle || (Array.isArray(value) && value.includes(element.value))) {
          element.checked = true;
        }
      } else {
        element.value = value ? value : '';
      }
    });
}



document.addEventListener('DOMContentLoaded', function () {


  ulanziLog = document.getElementById('ulanzi-log')


  log({
    time: time(),
    msg: 'Conectando ao simulador do computador host...',
  })

  ulanziLog.addEventListener('click', async function (event) {
    // Verifica se o alvo do clique é .code-box ou um de seus filhos
    const codeBox = event.target.closest('.code-box');
    if (codeBox) {
      // Obtém o texto a ser copiado
      const textToCopy = codeBox.querySelector('span').innerText;

      try {
        // Copia o texto para a área de transferência
        await navigator.clipboard.writeText(textToCopy);
        toast('Copiado com sucesso!');
      } catch (err) {
        console.error('Falha ao copiar:', err);
        toast('Falha ao copiar, por favor tente copiar manualmente.');
      }
    }
  });

  // ouvinte para alterações na configuração
  form = document.getElementById('ulanzi-config')
  form.addEventListener(
    'input',
    () => {
      const value = getFormValue(form);
      
      config = {
        ...config,
        ...value
      }
      send('config', { config })
      handleActiveCurrentKey()
    })


  // eventos de arrastar e soltar

  const ulanziKey = document.querySelectorAll('.ulanzi-key');
  customMenu = document.getElementById('custom-menu');
  // área alvo
  ulanziKey.forEach(uk => {
    uk.addEventListener('dragover', function (e) {
      e.preventDefault(); // evita o comportamento padrão para permitir o drop
    });

    uk.addEventListener('drop', function (e) {
      const index = uk.dataset.index
      const keyValue = keys[index]
      e.preventDefault();
      const data = e.dataTransfer.getData('text/plain'); // obtém os dados arrastados
      const plugin_action = data.split('___');
      const plugin = plugin_action[0];
      const action = plugin_action[1];
      const actionData = plugins[plugin].Actions[action];
      this.innerHTML = `<img src="./${plugin}/${actionData.Icon}">`; // insere a imagem no alvo

      log({
        time: time(),
        msg: `${actionData.UUID} arrastado para o teclado, chave é ${keyValue.key}, actionid é ${keyValue.actionid}. O host envia eventos add e paramfromapp para o serviço principal. Abra o link abaixo no navegador para depurar esta action.`,
        code: `http://127.0.0.1:${config.serverPort}/${plugin}/${actionData.PropertyInspectorPath}?address=127.0.0.1&port=${config.serverPort}&language=${config.language}&uuid=${actionData.UUID}&actionId=${keyValue.actionid}&key=${keyValue.key}`
      })
      send('add', { uuid: actionData.UUID, key: keyValue.key, actionid: keyValue.actionid })
      activeKeys[keyValue.key] = { uuid: actionData.UUID, key: keyValue.key, actionid: keyValue.actionid, plugin, actionData }
      send('activeKeys',{activeKeys})
      currentActiveKey = keyValue.key
      handleActiveCurrentKey()
    });

    // clique com o botão direito
    uk.addEventListener('contextmenu', function (event) {
      event.preventDefault();
      const imgLength = uk.getElementsByTagName('img')
      if (imgLength.length > 0) {
        showCustomMenu(event);
        contextmenuKey = uk.dataset.key
      }
    });

    // clique
    uk.addEventListener('click', function (event) {
      event.preventDefault();
      const imgLength = uk.getElementsByTagName('img')
      if (imgLength.length > 0) {
        showCustomMenu(event);
        currentActiveKey = uk.dataset.key
        handleActiveCurrentKey()
      }
    });


  });

  // esconde o menu
  document.addEventListener('click', function () {
    hideCustomMenu();
  });

  // trata clique nos itens do menu
  customMenu.addEventListener('click', function (event) {
    event.stopPropagation();
    const target = event.target;
    if (target.tagName === 'LI') {
      handleMenuItemClick(target.id);
    }
  });
})

function refreshList() {
  send('refreshList')
}

function send(cmd, data) {
  websocket.send(JSON.stringify({
    cmd,
    ...data
  }));
}

// Inicializa um único nó arrastável
function initializeDraggable(draggable) {
  draggable.addEventListener('dragstart', function (e) {
    const dragImage = draggable.getElementsByTagName('img')[0];
    console.log('===dragImage', dragImage)
    const action = draggable.dataset.action
    // const img = new Image();
    // img.src = dragImage.src;
    // img.width = 32 ;
    // img.height = 32 ;
    e.dataTransfer.setData('text/plain', action); // define os dados do arraste
    e.dataTransfer.setDragImage(dragImage, 20, 20); // define a imagem exibida durante o arraste
    setTimeout(() => { this.style.opacity = '0.5'; }, 0); // efeito visual de arraste

  });

  draggable.addEventListener('dragend', function () {
    this.style.opacity = '1'; // restaura o estilo ao terminar o arraste
  });
}

// Inicializa todos os nós arrastáveis existentes
function initializeDraggables() {
  const draggables = document.querySelectorAll('.draggable');
  draggables.forEach(initializeDraggable);
}

// Mostra o menu personalizado
function showCustomMenu(event) {
  customMenu.style.display = 'block';
  customMenu.style.left = event.pageX + 'px';
  customMenu.style.top = event.pageY + 'px';
}

// Oculta o menu personalizado
function hideCustomMenu() {
  customMenu.style.display = 'none';
}



// Lógica para tratar clique nos itens do menu
function handleMenuItemClick(itemId) {
  const { uuid, key, actionid } = activeKeys[contextmenuKey]
  switch (itemId) {
    case 'menu-run':
      send('run', { uuid, key, actionid })
      log({
        time: time(),
        msg: `Executando ${uuid}___${key}___${actionid}. O host envia um evento run para o serviço principal.`
      })
      break;
    case 'menu-clear':
      send('clear', { "param": [{ uuid, key, actionid }] })
      log({
        time: time(),
        msg: `Removendo ${uuid}___${key}___${actionid}. O host envia um evento clear para o serviço principal.`
      })
      const element = document.querySelector('.ulanzi-key[data-key="' + key + '"]');
      element.removeChild(element.firstChild);
      if(contextmenuKey == currentActiveKey){
        document.querySelector('.action-iframe').innerHTML = ''
        currentActiveKey = ''
        handleActiveCurrentKey()
      }
      break;
    case 'menu-setactive':
      send('setactive', { uuid, key, actionid, active: true })
      log({
        time: time(),
        msg: `Definindo como ativo ${uuid}___${key}___${actionid}. Ao ativar, se houver mudança de estado, o serviço principal deve atualizar o ícone.`
      })
      break;
    case 'menu-setnoactive':
      send('setactive', { uuid, key, actionid, active: false })
      log({
        time: time(),
        msg: `Definindo como inativo ${uuid}___${key}___${actionid}. Em estado inativo, se houver tarefas agendadas, o serviço principal deve continuar rodando em silêncio, sem enviar mensagens ao host.`
      })
      break;
    default:
      break;
  }
  hideCustomMenu();
}


function handleActiveCurrentKey() {
  let activeElement = null;
  if (currentActiveKey) {
    activeElement = document.querySelector('.ulanzi-key[data-key="' + currentActiveKey + '"]');
    activeElement.classList.add('active');

    if (config.loadAction === 'yes') {
      const { plugin, actionData, actionid, key, uuid } = activeKeys[currentActiveKey]
      document.querySelector('.action-iframe').innerHTML = `<iframe src="http://127.0.0.1:${config.serverPort}/${plugin}/${actionData.PropertyInspectorPath}?address=127.0.0.1&port=${config.serverPort}&language=${config.language}&uuid=${uuid}&actionId=${actionid}&key=${key}"></iframe>`
    }
  }


  // Usa querySelectorAll para buscar todos os elementos .ulanzi-key
  const allUlanziKeys = document.querySelectorAll('.ulanzi-key');

  // Percorre todos os elementos .ulanzi-key e remove a classe active
  allUlanziKeys.forEach(element => {
    if (element !== activeElement) {
      element.classList.remove('active');
    }
  });


}
