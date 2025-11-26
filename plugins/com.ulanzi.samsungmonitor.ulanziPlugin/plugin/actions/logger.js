import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Logger {
  constructor() {
    this.logFile = path.join(__dirname, '..', '..', 'plugin-debug.log');
    this.log('=== Logger iniciado ===');
  }

  debug(...args) {
    const timestamp = new Date().toISOString();
      const message = `[${timestamp}] ${args.join(' ')}\n`;
      console.debug('DEBUG COMMAND: ARGS', ...args);

      try {
          fs.appendFileSync(this.logFile, message);
      } catch (error) {
          console.error('Erro ao escrever log:', error);
      }
  }

  log(...args) {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ${args.join(' ')}\n`;

    console.log(...args);

    try {
      fs.appendFileSync(this.logFile, message);
    } catch (error) {
      console.error('Erro ao escrever log:', error);
    }
  }

  error(...args) {
    this.log('ERROR:', ...args);
  }

  warn(...args) {
    this.log('WARN:', ...args);
  }

  info(...args) {
    this.log('INFO:', ...args);
  }
}

export default new Logger();

