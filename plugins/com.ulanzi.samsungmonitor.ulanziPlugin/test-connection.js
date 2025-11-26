// Script de teste para verificar conexão com SmartThings API
import axios from 'axios';

const DEVICE_ID = '<DEVICE_ID>';
const TOKEN = '<PAT_TOKEN>';
const BASE_URL = 'https://api.smartthings.com/v1';

console.log('==============================================');
console.log('Teste de Conexão SmartThings API');
console.log('==============================================\n');

async function testConnection() {
  console.log('1. Testando conexão com a API...');
  console.log(`   Device ID: ${DEVICE_ID}`);
  console.log(`   Token: ${TOKEN.substring(0, 8)}...`);
  console.log('');

  try {
    // Testar conexão
    console.log('2. Obtendo status do dispositivo...');
    const response = await axios.get(
      `${BASE_URL}/devices/${DEVICE_ID}/status`,
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Conexão bem-sucedida!');
    console.log('');
    console.log('3. Status do dispositivo:');
    console.log(JSON.stringify(response.data, null, 2));
    console.log('');

    // Verificar capabilities disponíveis
    const components = response.data.components;
    console.log('4. Capabilities disponíveis:');

    if (components?.main) {
      Object.keys(components.main).forEach(capability => {
        console.log(`   - ${capability}`);
      });
    }
    console.log('');

    // Verificar estado do mute
    if (components?.main?.audioMute) {
      const muteState = components.main.audioMute.mute.value;
      console.log(`5. Estado do Mute (audioMute): ${muteState}`);
    } else if (components?.main?.audioVolume) {
      const muteState = components.main.audioVolume.mute?.value;
      console.log(`5. Estado do Mute (audioVolume): ${muteState}`);
    } else {
      console.log('5. ⚠️ Capability de mute não encontrada');
      console.log('   Verifique se o dispositivo suporta controle de áudio');
    }

    console.log('');
    console.log('==============================================');
    console.log('✅ Teste concluído com sucesso!');
    console.log('O plugin está pronto para ser usado.');
    console.log('==============================================');

  } catch (error) {
    console.error('');
    console.error('❌ Erro ao conectar:');

    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Mensagem: ${error.response.data?.message || error.response.statusText}`);
      console.error('');

      if (error.response.status === 401) {
        console.error('🔑 Token inválido ou expirado');
        console.error('   Gere um novo token em: https://account.smartthings.com/tokens');
      } else if (error.response.status === 404) {
        console.error('🔍 Device ID não encontrado');
        console.error('   Verifique o Device ID em: https://my.smartthings.com/');
      }
    } else if (error.request) {
      console.error('   Erro de rede - Verifique sua conexão com a internet');
    } else {
      console.error(`   ${error.message}`);
    }

    console.error('');
    console.error('==============================================');
    process.exit(1);
  }
}

// Executar teste
testConnection();

