import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigManager {
  constructor() {
    this.configFile = path.join(__dirname, '..', '..', 'config.json');
    this.config = this.loadConfig();
  }

  /**
   * Carregar configuração do arquivo
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        const data = fs.readFileSync(this.configFile, 'utf8');
        const config = JSON.parse(data);
        console.log('Config: Configuração carregada do arquivo');
        return config;
      }
    } catch (error) {
      console.error('Config: Erro ao carregar configuração:', error);
    }

    // Configuração padrão se não existir arquivo
    return {
      deviceId: '',
      token: '',
      lastUpdate: null
    };
  }

  /**
   * Salvar configuração no arquivo
   */
  saveConfig() {
    try {
      this.config.lastUpdate = new Date().toISOString();
      const data = JSON.stringify(this.config, null, 2);
      fs.writeFileSync(this.configFile, data, 'utf8');
      console.log('Config: Configuração salva no arquivo');
      return true;
    } catch (error) {
      console.error('Config: Erro ao salvar configuração:', error);
      return false;
    }
  }

  /**
   * Obter Device ID
   */
  getDeviceId() {
    return this.config.deviceId || '';
  }

  /**
   * Obter Token (PAT)
   */
  getToken() {
    return this.config.token || '';
  }

  /**
   * Definir Device ID
   */
  setDeviceId(deviceId) {
    this.config.deviceId = deviceId;
    this.saveConfig();
  }

  /**
   * Definir Token (PAT)
   */
  setToken(token) {
    this.config.token = token;
    this.saveConfig();
  }

  /**
   * Atualizar múltiplos valores
   */
  updateConfig(updates) {
    if (updates.deviceId !== undefined) {
      this.config.deviceId = updates.deviceId;
    }
    if (updates.token !== undefined) {
      this.config.token = updates.token;
    }
    this.saveConfig();
  }

  /**
   * Verificar se configuração está completa
   */
  isConfigured() {
    return this.config.deviceId && this.config.token;
  }

  /**
   * Obter toda a configuração
   */
  getConfig() {
    return {
      deviceId: this.config.deviceId,
      token: this.config.token,
      lastUpdate: this.config.lastUpdate,
      isConfigured: this.isConfigured()
    };
  }

  /**
   * Limpar configuração
   */
  clearConfig() {
    this.config = {
      deviceId: '',
      token: '',
      lastUpdate: null
    };
    this.saveConfig();
  }
}

export default new ConfigManager();

