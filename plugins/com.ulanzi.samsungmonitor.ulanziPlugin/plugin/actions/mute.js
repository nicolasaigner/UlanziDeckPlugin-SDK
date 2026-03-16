import logger from './logger.js';
import configManager from './configManager.js';

class MuteAction {
  constructor(context, $UD, $SmartThings) {
    this.context = context;
    this.$UD = $UD;
    this.$SmartThings = $SmartThings;

    // Carregar configuração do arquivo
    const config = configManager.getConfig();
    this.settings = {
      deviceId: config.deviceId || '',
      token: config.token || '',
      connectState: 'disconnected'
    };

    logger.log('MuteAction: Instância criada', this.context);
    logger.log('MuteAction: Config carregada:', {
      hasDeviceId: !!this.settings.deviceId,
      hasToken: !!this.settings.token
    });

    // Listener para mudanças no estado do mute
    this.muteStatusListener = (muted) => {
      logger.log('MuteAction: Estado do mute mudou para:', muted);
      this.updateIcon(muted);
    };

    this.$SmartThings.on('muteStatusChanged', this.muteStatusListener);
  }

  /**
   * Quando a ação é adicionada
   */
  add() {
    logger.log('MuteAction: Ação adicionada', this.context);
    this.updateIcon(this.$SmartThings.currentMuteState);
  }

  /**
   * Atualizar parâmetros da plugin
   */
  updatePluginParams(params) {
    console.log('MuteAction: Atualizando parâmetros', params);
    this.settings = { ...this.settings, ...params };

    // Enviar parâmetros atualizados para o inspector
    this.$UD.sendParamFromPlugin(this.settings, this.context);
  }

  /**
   * Quando o botão é pressionado
   */
  async run(jsn) {
    logger.log('MuteAction: Botão pressionado', this.context);
    logger.log('MuteAction: SmartThings conectado?', this.$SmartThings.connected);

    if (this.$SmartThings.connected) {
      logger.log('MuteAction: Chamando toggleMute()...');
      const success = await this.$SmartThings.toggleMute();
      if (success) {
        logger.log('MuteAction: Mute alternado com sucesso');
      } else {
        logger.error('MuteAction: Falha ao alternar mute');
        this.$UD.toast('Erro ao alternar mute');
      }
    } else {
      logger.warn('MuteAction: SmartThings não conectado');
      logger.warn('MuteAction: Estado atual:', {
        connected: this.$SmartThings.connected,
        hasDeviceId: !!this.$SmartThings.deviceId,
        hasToken: !!this.$SmartThings.token
      });
      this.$UD.toast('SmartThings não conectado');
    }
  }

  /**
   * Quando a ação está ativa/inativa
   */
  setActive(active) {
    logger.log('MuteAction: Ativo:', active, this.context);
  }

  /**
   * Receber parâmetros do inspector
   */
  receiveSettings(settings) {
    logger.log('MuteAction: Configurações recebidas', settings);
    this.settings = { ...this.settings, ...settings };

    // Se as credenciais mudaram, reconectar
    if (settings.deviceId || settings.token) {
      this.$SmartThings.setCredentials(
        settings.deviceId || this.settings.deviceId,
        settings.token || this.settings.token
      );
    }
  }

  /**
   * Atualizar ícone baseado no estado
   */
  updateIcon(muted) {
    const state = muted ? 1 : 0;
    const text = muted ? 'Muted' : 'Unmuted';
    console.log('MuteAction: Atualizando ícone', { state, text });
    this.$UD.setStateIcon(this.context, state, '');
  }

  /**
   * Quando a ação é removida
   */
  clear() {
    console.log('MuteAction: Ação removida', this.context);
    this.$SmartThings.off('muteStatusChanged', this.muteStatusListener);
  }
}

export default MuteAction;

