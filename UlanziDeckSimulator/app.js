import http from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';

import utils from './server/utils.js';
import DeckClient from './server/deckClient.js';
import Clients from './server/clients.js';


const serverPort = 39069 ; // porta do simulador
const app = express();
const server = http.createServer(app);



// Define diretórios de arquivos estáticos
app.use(express.static(utils.getRootPath()+'/static'));
app.use(express.static(utils.getRootPath()+'/plugins'));

const wsServer = new WebSocketServer({server:server});


let clientConfig = {
    "language": "zh_CN",
    "loadAction": "no",
    "runMain": "no",
    serverPort,
    rootPath:utils.getRootPath(),
}



const clients = new Clients(clientConfig)


wsServer.on('connection', (ws,msg) => {

    // Quando um cliente conectar ao servidor, entrará aqui
    // console.log('=======connection========');


    // //say hello
    // ws.send(JSON.stringify({code:0}),function (err) {
    //     if(err){
    //         console.log('send notify error');
    //     }
    // });

    let roomid = msg.url.split('/');
    const len = roomid.length-1;
    roomid = roomid[len];
    // deckClient é o simulador; outros plugins não têm esse campo
    if(roomid == 'deckClient'){

        clients.addClient(ws,'deckClient');

    }else{
        clients.addClient(ws);
    }




});


server.listen(serverPort,()=>{
    console.log(`server started and run http://127.0.0.1:${serverPort}`);
});
