import EventEmitter from 'events';
import menu from './menu.js';
import DeckClient from './deckClient.js';
import utils from './utils.js';

export default class Clients extends EventEmitter {
  constructor(config) {
    super();

    this.config = config;
    this.clientList = {};  //Armazena a lista de plugins
    this.contextDatas = {};  //Armazena os dados do plugin

    this.activeKeys = {};//Chaves já em uso


    this.deckClient = null; //Cliente simulador do computador host

    this.plugins = menu.plugins;
    menu.on('listUpdated', (data) => {
      // console.log('=== listUpdatedmenu',data)
      this.plugins = data;
      this.deckClient && this.deckClient.listUpdated(data)
      this.checkMainState()
    })


    

  }

  addClient(client, type) {
    if (type === 'deckClient') {
      this.deckClient = new DeckClient(client);
      this.log('Conexão com o emulador do computador host estabelecida com sucesso! Aguardando o carregamento dos plugins...')
      this.deckClient.send('init',{
        config:this.config,
        activeKeys:this.activeKeys
      })
      if (this.plugins) {
        this.deckClient.listUpdated(this.plugins);
        this.checkMainState()
      }
      if(Object.keys(this.activeKeys).length != 0){
        this.log('Quando o teclado é recarregado, um evento setactive é enviado ao serviço principal que foi iniciado. O serviço principal deve então enviar os dados do ícone para o estado atual.')
        for(const k in this.activeKeys){
          const {  uuid, key, actionid } = this.activeKeys[k]
          const mainUuid = this.getMainUuid(uuid)
          if (this.clientList[mainUuid] && this.clientList[mainUuid].readyState == 1){

            this.clientList[mainUuid].send(JSON.stringify({
              cmd: 'setactive',
              uuid, key, actionid, 
              active: true
            }))
          }
        }

      }
      this.deckClient.on('refreshList', () => {
        this.refreshList()
      })
      this.deckClient.on('add', (data) => {
        const { uuid,key,actionid } = data;
        this.currentAddKey = { uuid,key,actionid }
        const context = utils.encodeContext(data)
        const param = this.contextDatas[context] || null
        this.send('add',{
          uuid,key,actionid,param
        },true)
        this.send('paramfromapp',{
          uuid,key,actionid,param
        },true)
      })
      this.deckClient.on('activeKeys', (data) => {
        this.activeKeys = data.activeKeys
      })

      this.deckClient.on('run', (data) => {
        const { uuid,key,actionid } = data;
        const context = utils.encodeContext(data)
        const param = this.contextDatas[context] || null
        this.send('run',{
          uuid,key,actionid,param
        },true)
      })

      this.deckClient.on('setactive', (data) => {
        this.send('setactive',data,true)
      })
      this.deckClient.on('clear', (data) => {
        this.send('clear',data,true)
      })

      this.deckClient.on('config', (data) => {
        const oldLanguage = this.config.language
        this.config = data.config;
        if(this.config.language != oldLanguage){
          this.log('Alterando o ambiente de idioma do plugin...')
          menu.getList()
        }
      })

    }else{
      client.on('message', (msg)=>{
        const data = utils.parseJson(msg.toString());

        if(data.cmd === 'connected') {
          this.connected(client, data)
        }

        
        if(typeof data.code != 'undefined') return;
        if(data.cmd === 'state') {
          this.deckClient && this.deckClient.send('state', data)
          //resposta
          this.replay(client,data)
        }
        if(data.cmd === 'paramfromplugin') {
          this.paramfromplugin(data, client)
        }
        if(data.cmd === 'openurl') {
          this.deckClient.send('openurl',data)
        }
      });
      client.on('close', (msg)=>{
        // console.log('Received close from client:');
        for(const k in this.clientList){
          if(this.clientList[k] == client){
            delete this.clientList[k]
            break;
          }
        }
      });

    }
    // this.clients.push(client);
  }

  paramfromplugin(data,client){
    const { uuid,param } = data;
    const context = utils.encodeContext(data)
    this.contextDatas[context] = param

    const mainUuid = this.getMainUuid(uuid)

    //resposta
    this.replay(client,{
      cmd: 'paramfromplugin',
      ...data,
    })

    const isMainSend = this.clientList[mainUuid] == client  // Determina se é o serviço principal que está enviando


    this.log(`${isMainSend?'Serviço principal do plugin':context} enviou o evento paramfromplugin. O computador host o encaminhará para ${isMainSend?context:'serviço principal do plugin'}. Os dados encaminhados serão salvos pelo computador host e, ao reconectar à página de ação, os dados de configuração anteriores serão recebidos através de paramfromapp. A seguir estão os dados encaminhados：`,JSON.stringify(data))
    //Encaminhar
    if(isMainSend){
      if (this.clientList[context] && this.clientList[context].readyState == 1){
        this.clientList[context].send(JSON.stringify({
          cmd: 'paramfromplugin',
          ...data
        }))
      }
    }else{
      if (this.clientList[mainUuid] && this.clientList[mainUuid].readyState == 1){
        this.clientList[mainUuid].send(JSON.stringify({
          cmd: 'paramfromplugin',
          ...data
        }))
      }
    }
  }


  connected(client, data){
    const { uuid,key,actionid } = data;
    const isMain = uuid.split('.').length == 4;
    if(isMain){
      this.log('Serviço principal '+uuid + ' conectado!')
      this.clientList[uuid] = client;
      this.checkMainState('onlyCheck')
    }else{
      const context = utils.encodeContext(data)
      this.clientList[context] = client;
      const param = this.contextDatas[context] || null;
      if(this.activeKeys[key] && this.activeKeys[key].uuid === uuid && this.activeKeys[key].actionid === actionid){
        
        this.log(`Item de configuração ${uuid} conectado! O valor da chave é ${key} e o actionid é ${actionid}. O simulador do computador host envia novamente o evento paramfromapp para esta página de ação e para o serviço principal. ${param?'Abaixo estão os dados de recarregamento':''}`
          ,param?JSON.stringify(param):null
        )
        this.send('paramfromapp',{
          uuid,key,actionid,param
        })
        this.send('paramfromapp',{
          uuid,key,actionid,param
        },true)
      }else{
        this.log(`Item de configuração ${uuid} conectado! O valor da chave é ${key} e o actionid é ${actionid}. O simulador do computador host envia os eventos add e paramfromapp para esta página de ação. ${param?'Abaixo estão os dados de recarregamento':''}`
          ,param?param:null
        )
        this.send('add',{
          uuid,key,actionid,param
        })
        this.send('paramfromapp',{
          uuid,key,actionid,param
        })
      }
    }
  }


  refreshList() {
    this.log('Carregando a lista de plugins...')
    menu.getList()
  }

  replay(client, data) {
     //resposta
     client.send(JSON.stringify({
      ...data,
      code: 0
    }))
  }

  checkMainState(onlyCheck) {
    let connectedMain = []
    for (const k in this.plugins) {
      const v = this.plugins[k]
      const renderDate = this.config.language === 'zh_CN' && v.zhData ? v.zhData : v
  
      if (this.clientList[v.UUID] && this.clientList[v.UUID].readyState == 1) { //Verifica se existe e se ainda está conectado
          if(!onlyCheck)this.log(renderDate.Name + ' Serviço principal '+ v.UUID +' conectado！')
          connectedMain.push(v)
      } else {
          let code = ''
          let msg = ''
          if (v.CodePath.indexOf('.js') >= 0) {
              msg = renderDate.Name  + ' Serviço principal '+ v.UUID +' não conectado, por favor, vá para o diretório raiz do plugin ' + k +' e execute o seguinte código para iniciar o serviço principal'
              code = `node ${v.CodePath} 127.0.0.1 ${this.config.serverPort} ${this.config.language}`
          } else {
              msg = renderDate.Name + ' Serviço principal '+ v.UUID +' não conectado, por favor, use um navegador para abrir o seguinte link para iniciar o serviço principal'
              code = `http://127.0.0.1:${this.config.serverPort}/${k}/${v.CodePath}?address=127.0.0.1&port=${this.config.serverPort}&language=${this.config.language}&uuid=${v.UUID}`
          }
          if(!onlyCheck)this.log(msg, code)
      }
    }
    this.deckClient && this.deckClient.send('connectedMain', {connectedMain})
  }

  removeClient(client) {
    const index = this.clients.indexOf(client);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
  }



  log(msg, code) {
    this.deckClient && this.deckClient.log(msg, code)
  }

  send(cmd, data, isMain) {
    let uuid = ''
    if(cmd === 'clear'){
      uuid = data.param[0].uuid
    }else{
      uuid = data.uuid
    }
    if(isMain){
      uuid = this.getMainUuid(uuid)
    }else{
      uuid = utils.encodeContext(data)
    }
    this.clientList[uuid] && this.clientList[uuid].send(JSON.stringify({
      cmd,
      ...data
    }))
    
  }


  getMainUuid(uuid){
    if(!uuid) return console.error('[UlanziDeck Tips]: uuid not found!');
    const parts = uuid.split('.'); // Divide a string em um array usando '.' como delimitador
    return parts.slice(0, 4).join('.');
  }
}