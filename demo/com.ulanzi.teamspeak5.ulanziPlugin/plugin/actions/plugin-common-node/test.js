import { RandomPort, UlanzideckApi, Utils } from './index.js';


const generatePort = new RandomPort(); 
// Gera uma porta aleatória
const port = generatePort.getPort();


// Caminho do diretório raiz do plugin
const _pluginPath = Utils.getPluginPath()

console.log('Random port: ', port)
console.log('Plugin path: ', _pluginPath)

console.log('UlanzideckApi loaded');




const $UD = new UlanzideckApi();
// conexão do socket
$UD.connect('com.ulanzi.ulanzideck.analogclock')

$UD.onConnected(conn => {

  console.log('=onConnected=')
})

$UD.onAdd(message => {

  console.log('onAdd', message)

})

$UD.onClear(message => {

  console.log('onClear', message)
})
$UD.onClose(message => {

  console.log('=onClose=', message)
})
