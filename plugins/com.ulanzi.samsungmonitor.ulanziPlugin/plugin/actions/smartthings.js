import axios from 'axios';
import EventEmitter from 'events';
import logger from './logger.js';

class SmartThingsAPI extends EventEmitter {
  constructor() {
    super();
    this.deviceId = null;
    this.token = null;
    this.baseURL = 'https://api.smartthings.com/v1';
    this.connected = false;
    this.currentMuteState = false;
    logger.log('SmartThingsAPI: Instância criada');
  }

  /**
   * Configurar credenciais da API
   * @param {string} deviceId - ID do dispositivo Samsung
   * @param {string} token - Personal Access Token do SmartThings
   */
  setCredentials(deviceId, token) {
    this.deviceId = deviceId;
    this.token = token;
    logger.log('SmartThings: Credenciais configuradas', { deviceId, tokenLength: token.length });
  }

  /**
   * Atualizar status do dispositivo (refresh)
   */
  async refreshDevice() {
    logger.log('SmartThings: Enviando comando refresh...');

    try {
      const refreshPayload = {
        commands: [
          {
            component: 'main',
            capability: 'refresh',
            command: 'refresh',
            arguments: []
          }
        ]
      };

      logger.log('SmartThings: Payload refresh:', JSON.stringify(refreshPayload));

      const response = await axios.post(
        `${this.baseURL}/devices/${this.deviceId}/commands`,
        refreshPayload,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json',
            'Accept-Language': 'pt-BR'
          }
        }
      );

      logger.log('SmartThings: Refresh executado com sucesso, status:', response.status);

      // Aguardar um pouco para o dispositivo atualizar
      await new Promise(resolve => setTimeout(resolve, 500));

      return true;
    } catch (error) {
      logger.error('SmartThings: Erro ao fazer refresh');
      logger.error('SmartThings: Error message:', error.message);
      return false;
    }
  }

  /**
   * Verificar conexão com a API
   */
  async connect() {
    logger.log('SmartThings: Método connect() chamado');

    if (!this.deviceId || !this.token) {
      logger.error('SmartThings: Credenciais não configuradas');
      this.emit('disconnected');
      return false;
    }

    try {
      this.emit('connecting');
      logger.log('SmartThings: Tentando conectar...');
      logger.log('SmartThings: URL:', `${this.baseURL}/devices/${this.deviceId}/status`);

      // Testar a conexão obtendo o status do dispositivo
      const response = await axios.get(
        `${this.baseURL}/devices/${this.deviceId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      this.connected = true;
      logger.log('SmartThings: Conectado com sucesso');
      logger.log('SmartThings: Status code:', response.status);
      this.emit('connected');

      // Obter o estado atual do mute
      await this.getMuteStatus();

      return true;
    } catch (error) {
      logger.error('SmartThings: Erro ao conectar');
      logger.error('SmartThings: Error message:', error.message);
      logger.error('SmartThings: Error response:', error.response?.status, error.response?.data);
      this.connected = false;
      this.emit('disconnected');
      return false;
    }
  }

  /**
   * Obter status atual do mute
   */
  async getMuteStatus() {
    logger.log('SmartThings: getMuteStatus() chamado');

    if (!this.connected) {
      logger.warn('SmartThings: Não conectado');
      return null;
    }

    try {
      // IMPORTANTE: Fazer refresh primeiro para obter status atualizado!
      logger.log('SmartThings: Fazendo refresh antes de consultar status...');
      await this.refreshDevice();

      logger.log('SmartThings: Consultando status após refresh...');
      const response = await axios.get(
        `${this.baseURL}/devices/${this.deviceId}/status`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // O status do mute pode estar em audioMute ou audioVolume
      // Verificar a estrutura da resposta
      const status = response.data.components?.main;

      logger.log('SmartThings: Status completo recebido');

      if (status?.audioMute?.mute?.value !== undefined) {
        const rawValue = status.audioMute.mute.value;
        this.currentMuteState = rawValue === 'muted';
        logger.log('SmartThings: audioMute.mute.value =', rawValue);
        logger.log('SmartThings: Interpretado como muted =', this.currentMuteState);
      } else if (status?.audioVolume?.mute?.value !== undefined) {
        const rawValue = status.audioVolume.mute.value;
        this.currentMuteState = rawValue === 'muted';
        logger.log('SmartThings: audioVolume.mute.value =', rawValue);
        logger.log('SmartThings: Interpretado como muted =', this.currentMuteState);
      } else {
        logger.warn('SmartThings: Nenhum status de mute encontrado na resposta!');
        logger.log('SmartThings: Capabilities disponíveis:', Object.keys(status || {}));
      }

      logger.log('SmartThings: Estado final do mute:', this.currentMuteState ? 'MUTED' : 'UNMUTED');
      this.emit('muteStatusChanged', this.currentMuteState);

      return this.currentMuteState;
    } catch (error) {
      logger.error('SmartThings: Erro ao obter status do mute');
      logger.error('SmartThings: Error message:', error.message);
      return null;
    }
  }

  /**
   * Alternar estado do mute
   */
  async toggleMute() {
    logger.log('SmartThings: toggleMute() chamado');

    if (!this.connected) {
      logger.warn('SmartThings: Não conectado');
      return false;
    }

    try {
      // Primeiro, obter o estado atual
      logger.log('SmartThings: Obtendo estado atual do mute...');
      await this.getMuteStatus();

      // Alternar para o estado oposto
      const newMuteState = !this.currentMuteState;
      logger.log('SmartThings: Estado atual:', this.currentMuteState, '→ Novo estado:', newMuteState);

      const command = newMuteState ? 'mute' : 'unmute';
      logger.log('SmartThings: Enviando comando:', command);
      logger.log('SmartThings: Capability: audioMute');

      const commandPayload = {
        commands: [
            {
                "component": "main",
                "capability": "audioMute",
                "command": command.toLowerCase(),
                "arguments": []
            }
        ]
      };

      logger.log('SmartThings: Payload do comando:', JSON.stringify(commandPayload));

      const response = await axios.post(
          `${this.baseURL}/devices/${this.deviceId}/commands`,
          { commands: commandPayload.commands },
          {
              headers: {
                  'Authorization': `Bearer ${this.token}`,
                  "Content-Type": "application/json;charset=utf-8",
                  "Accept": "application/json",
                  "Accept-Language": "pt-BR"
              }
          }
      );

      logger.log('SmartThings: Mute alternado para:', newMuteState ? 'MUTED' : 'UNMUTED');
      this.currentMuteState = newMuteState;
      this.emit('muteStatusChanged', this.currentMuteState);

      return true;
    } catch (error) {
      logger.error('SmartThings: Erro ao alternar mute');
      logger.error('SmartThings: Error message:', error.message);
      logger.error('SmartThings: Error response:', error.response?.status, error.response?.data);

      // Se falhar com audioMute, tentar com audioVolume
      /*try {
        const newMuteState = !this.currentMuteState;
        const command = newMuteState ? 'mute' : 'unmute';

        logger.warn('SmartThings: Tentando com audioVolume...');
        logger.log('SmartThings: Comando:', command);

        const fallbackPayload = {
          commands: [
            {
              component: 'main',
              capability: 'audioVolume',
              command: command,
              arguments: []
            }
          ]
        };

        logger.log('SmartThings: Payload fallback:', JSON.stringify(fallbackPayload));

        const response = await axios.post(
          `${this.baseURL}/devices/${this.deviceId}/commands`,
          fallbackPayload,
          {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        logger.log('SmartThings: Mute alternado (audioVolume) para:', newMuteState ? 'MUTED' : 'UNMUTED');
        this.currentMuteState = newMuteState;
        this.emit('muteStatusChanged', this.currentMuteState);

        return true;
      } catch (error2) {
        logger.error('SmartThings: Erro ao alternar mute (ambas tentativas)');
        logger.error('SmartThings: Error2 message:', error2.message);
        return false;
      }*/
    }
  }

  /**
   * Definir mute
   * @param {boolean} muted - true para mutar, false para desmutar
   */
  async setMute(muted) {
    logger.log('SmartThings: setMute() chamado com:', muted);

    if (!this.connected) {
      logger.warn('SmartThings: Não conectado');
      return false;
    }

    try {
      const command = muted ? 'mute' : 'unmute';
      const setMutePayload = {
        commands: [
          {
            component: 'main',
            capability: 'audioMute',
            command: command,
            arguments: []
          }
        ]
      };

      logger.log('SmartThings: Payload setMute:', JSON.stringify(setMutePayload));

      const response = await axios.post(
        `${this.baseURL}/devices/${this.deviceId}/commands`,
        setMutePayload,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.log('SmartThings: Mute definido para:', muted ? 'MUTED' : 'UNMUTED');
      this.currentMuteState = muted;
      this.emit('muteStatusChanged', this.currentMuteState);

      return true;
    } catch (error) {
      logger.error('SmartThings: Erro ao definir mute');
      logger.error('SmartThings: Error message:', error.message);

      // Se falhar com audioMute, tentar com audioVolume
      try {
        const command = muted ? 'mute' : 'unmute';
        logger.warn('SmartThings: Tentando setMute com audioVolume...');

        const fallbackPayload = {
          commands: [
            {
              component: 'main',
              capability: 'audioVolume',
              command: command,
              arguments: []
            }
          ]
        };

        logger.log('SmartThings: Payload fallback:', JSON.stringify(fallbackPayload));

        const response = await axios.post(
          `${this.baseURL}/devices/${this.deviceId}/commands`,
          fallbackPayload,
          {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        logger.log('SmartThings: Mute definido (audioVolume) para:', muted ? 'MUTED' : 'UNMUTED');
        this.currentMuteState = muted;
        this.emit('muteStatusChanged', this.currentMuteState);

        return true;
      } catch (error2) {
        logger.error('SmartThings: Erro ao definir mute (ambas tentativas)');
        logger.error('SmartThings: Error2 message:', error2.message);
        return false;
      }
    }
  }

  /**
   * Desconectar
   */
  disconnect() {
    this.connected = false;
    this.emit('disconnected');
    console.log('SmartThings: Desconectado');
  }
}

export default SmartThingsAPI;

