/* toda vez que vai criar um backend -> criam-se ROTAS 
são os endereços adicionais após o endereço principal
ww.omnistack.com/users -> /users é uma rota (um recurso)!
o express ajuda justamente nisso, na criação e gerenciamento
dessas rotas **/

// o node não realiza a atualização automática do código no servidor
// nodemon que faz isso!

// importando a biblioteca do express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const http = require('http');
const routes = require('./routes');
const { setupWebSocket } = require('./websocket');


const app = express();

/* agora temos que usar tanto o protocolo http quanto o webSocket
   para fazer essa manipulação, deve-se extrair o protocolo http da aplicação
*/

// agora o servidor http está fora do express (foi extraído na linha abaixo)
const server = http.Server(app);
// agora, temos que fazer com que o servidor TAMBÉM manipule o protocolo WebSocket
setupWebSocket(server);


mongoose.connect('mongodb+srv://jvpoletti:mypassword@omnistack-gvtgd.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors({ origin: 'http://localhost:3000' }));
// vai determinar o que vai ser válido para todas as rotas da aplicação (e seus métodos)
// express.json() -> diz a aplicação para entender requisições que tem o body (corpo) no formato JSON
app.use(express.json());

// todas as rotas da aplicação foram linkadas agora (as que estão no routes.js)
app.use(routes);        

server.listen(3333);