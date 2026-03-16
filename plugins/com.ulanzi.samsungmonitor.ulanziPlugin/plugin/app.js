import { UlanzideckApi } from './actions/plugin-common-node/index.js';
import SmartThingsAPI from './actions/smartthings.js';
import MuteAction from './actions/mute.js';
import logger from './actions/logger.js';
import configManager from './actions/configManager.js';

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

logger.log('Carregando configuração...');
const config = configManager.getConfig();
logger.log('Config carregada:', {
  hasDeviceId: !!config.deviceId,
  hasToken: !!config.token,
  isConfigured: config.isConfigured
});

// Configurar credenciais do arquivo de configuração
if (config.isConfigured) {
  logger.log('Configurando credenciais do arquivo de configuração...');
  $SmartThings.setCredentials(config.deviceId, config.token);

  logger.log('Conectando ao SmartThings...');
  $SmartThings.connect();
} else {
  logger.warn('Credenciais não configuradas! Configure Device ID e Token no Property Inspector.');
}

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

  // Verificar se são configurações globais (deviceId ou token)
  if (jsn.param && (jsn.param.deviceId !== undefined || jsn.param.token !== undefined)) {
    logger.log('Samsung Monitor Plugin: Atualizando configurações globais...');

    if (jsn.param.deviceId !== undefined) {
      configManager.setDeviceId(jsn.param.deviceId);
      logger.log('Samsung Monitor Plugin: Device ID atualizado');
    }

    if (jsn.param.token !== undefined) {
      configManager.setToken(jsn.param.token);
      logger.log('Samsung Monitor Plugin: Token atualizado');
    }

    // Reconectar ao SmartThings com novas credenciais
    const newConfig = configManager.getConfig();
    if (newConfig.isConfigured) {
      logger.log('Samsung Monitor Plugin: Reconectando ao SmartThings com novas credenciais...');
      $SmartThings.setCredentials(newConfig.deviceId, newConfig.token);
      $SmartThings.connect();
    }
  }

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

  logger.log('Samsung Monitor Plugin: Parâmetros recebidos do plugin');
  logger.log('Samsung Monitor Plugin: Context:', context);
  logger.log('Samsung Monitor Plugin: Param:', JSON.stringify(jsn.param));

  // Verificar se são configurações globais (deviceId ou token)
  if (jsn.param && (jsn.param.deviceId !== undefined || jsn.param.token !== undefined)) {
    logger.log('Samsung Monitor Plugin: ===== ATUALIZANDO CONFIGURAÇÕES GLOBAIS =====');
    logger.log('Samsung Monitor Plugin: Device ID recebido:', jsn.param.deviceId);
    logger.log('Samsung Monitor Plugin: Token recebido:', jsn.param.token ? '***' + jsn.param.token.substr(-4) : 'undefined');

    if (jsn.param.deviceId !== undefined) {
      configManager.setDeviceId(jsn.param.deviceId);
      logger.log('Samsung Monitor Plugin: ✅ Device ID salvo no config.json');
    }

    if (jsn.param.token !== undefined) {
      configManager.setToken(jsn.param.token);
      logger.log('Samsung Monitor Plugin: ✅ Token salvo no config.json');
    }

    // Reconectar ao SmartThings com novas credenciais
    const newConfig = configManager.getConfig();
    logger.log('Samsung Monitor Plugin: Config após salvar:', {
      hasDeviceId: !!newConfig.deviceId,
      hasToken: !!newConfig.token,
      isConfigured: newConfig.isConfigured
    });

    if (newConfig.isConfigured) {
      logger.log('Samsung Monitor Plugin: 🔄 Reconectando ao SmartThings...');
      $SmartThings.setCredentials(newConfig.deviceId, newConfig.token);
      $SmartThings.connect();

      // Atualizar TODAS as instâncias com a nova configuração
      logger.log('Samsung Monitor Plugin: Atualizando todas as instâncias...');
      for (let ctx in ACTION_CACHES) {
        if (ACTION_CACHES[ctx].settings) {
          ACTION_CACHES[ctx].settings.deviceId = newConfig.deviceId;
          ACTION_CACHES[ctx].settings.token = newConfig.token;
          logger.log('Samsung Monitor Plugin: Instância atualizada:', ctx);
        }
      }
    } else {
      logger.warn('Samsung Monitor Plugin: Configuração incompleta após salvar!');
    }
  }

  if (instance) {
    if (typeof instance.receiveSettings === 'function') {
      instance.receiveSettings(jsn.param);
    }
  } else {
    logger.log('Samsung Monitor Plugin: Nenhuma instância específica para este context');
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

