import { UlanzideckApi } from './actions/plugin-common-node/index.js';
import SmartThingsAPI from './actions/smartthings.js';
import MuteAction from './actions/mute.js';
import logger from './actions/logger.js';

logger.log('==============================================');
logger.log('Samsung Monitor Plugin iniciando...');
logger.log('Args:', process.argv);
logger.log('==============================================');


// Cache de instâncias de ações
const ACTION_CACHES = {};

// Inicializar API do UlanziDeck
const $UD = new UlanzideckApi();

// Conectar ao UlanziDeck
$UD.connect('com.ulanzi.ulanzideck.samsungmonitor');

$UD.onConnected(conn => {
  logger.log('Samsung Monitor Plugin: Conectado ao UlanziDeck');
  logger.log('Connection:', JSON.stringify(conn));
});

$UD.onError(error => {
  logger.error('Samsung Monitor Plugin: Erro UlanziDeck:', error);
});

$UD.onClose(() => {
  logger.warn('Samsung Monitor Plugin: Conexão fechada com UlanziDeck');
});

// Inicializar API do SmartThings
const $SmartThings = new SmartThingsAPI();

logger.log('Configurando credenciais SmartThings...');

// Configurar credenciais padrão
$SmartThings.setCredentials(
  '',
  ''
);

logger.log('Conectando ao SmartThings...');

// Conectar ao SmartThings
$SmartThings.connect();

// Eventos do SmartThings
$SmartThings.on('connecting', () => {
  logger.log('Samsung Monitor Plugin: Conectando ao SmartThings...');
  for (let context in ACTION_CACHES) {
    ACTION_CACHES[context].updatePluginParams({ connectState: 'connecting' });
  }
});

$SmartThings.on('connected', () => {
  logger.log('Samsung Monitor Plugin: Conectado ao SmartThings');
  for (let context in ACTION_CACHES) {
    ACTION_CACHES[context].updatePluginParams({ connectState: 'connected' });
  }
});

$SmartThings.on('disconnected', () => {
  logger.warn('Samsung Monitor Plugin: Desconectado do SmartThings');
  for (let context in ACTION_CACHES) {
    ACTION_CACHES[context].updatePluginParams({ connectState: 'disconnected' });
  }
});

// Quando uma ação é adicionada ao teclado
$UD.onAdd(jsn => {
  const context = jsn.context;
  const uuid = jsn.uuid;
  const instance = ACTION_CACHES[context];

  logger.log('Samsung Monitor Plugin: Ação adicionada', { context, uuid });
  logger.log('Dados completos:', JSON.stringify(jsn));

  if (!instance) {
    if (uuid === 'com.ulanzi.ulanzideck.samsungmonitor.mute') {
      logger.log('Criando instância MuteAction para:', context);
      ACTION_CACHES[context] = new MuteAction(context, $UD, $SmartThings);
      logger.log('Instância criada com sucesso');
    } else {
      logger.warn('UUID desconhecido:', uuid);
    }
  } else {
    logger.log('Instância já existe, chamando add()');
    instance.add();
  }
});

// Quando uma ação está ativa/inativa
$UD.onSetActive(jsn => {
  const context = jsn.context;
  const instance = ACTION_CACHES[context];

  logger.log('Samsung Monitor Plugin: SetActive', { context, active: jsn.active });

  if (instance && typeof instance.setActive === 'function') {
    instance.setActive(jsn.active);
  }
});

// Quando o botão é pressionado
$UD.onRun(jsn => {
  const context = jsn.context;
  const instance = ACTION_CACHES[context];

  logger.log('Samsung Monitor Plugin: Botão pressionado', context);
  logger.log('Dados completos:', JSON.stringify(jsn));

  if (!instance) {
    logger.warn('Instância não encontrada, emitindo add');
    $UD.emit('add', jsn);
  } else {
    logger.log('Instância encontrada, chamando run()');
    if (typeof instance.run === 'function') {
      instance.run(jsn);
    } else {
      logger.error('Instância não tem método run!');
    }
  }
});

// Quando uma ação é removida
$UD.onClear(jsn => {
  console.log('Samsung Monitor Plugin: Ação removida', jsn);

  if (jsn.param) {
    for (let i = 0; i < jsn.param.length; i++) {
      const context = jsn.param[i].context;
      const instance = ACTION_CACHES[context];

      if (instance) {
        if (typeof instance.clear === 'function') {
          instance.clear();
        }
        delete ACTION_CACHES[context];
      }
    }
  }
});

// Receber parâmetros do inspector
$UD.onParamFromApp(jsn => {
  const context = jsn.context;
  const instance = ACTION_CACHES[context];

  logger.log('Samsung Monitor Plugin: Parâmetros recebidos do app', { context, param: jsn.param });

  if (instance) {
    if (typeof instance.receiveSettings === 'function') {
      instance.receiveSettings(jsn.param);
    }
  } else {
    logger.warn('Instância não encontrada para context:', context);
  }
});

// Receber parâmetros do plugin (inspector)
$UD.onParamFromPlugin(jsn => {
  const context = jsn.context;
  const instance = ACTION_CACHES[context];

  logger.log('Samsung Monitor Plugin: Parâmetros recebidos do plugin', { context, param: jsn.param });

  if (instance) {
    if (typeof instance.receiveSettings === 'function') {
      instance.receiveSettings(jsn.param);
    }
  } else {
    logger.warn('Instância não encontrada para context:', context);
  }
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  logger.error('Samsung Monitor Plugin: Erro não capturado:', error);
  logger.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Samsung Monitor Plugin: Promise rejeitada não tratada:', reason);
});

logger.log('Samsung Monitor Plugin: Inicialização completa');
logger.log('Aguardando eventos do UlanziDeck...');

