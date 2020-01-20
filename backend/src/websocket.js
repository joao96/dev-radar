const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebSocket = (server) => {
  io = socketio(server);

  // aqui estou ouvindo o evento de conexão ('connection')
  // toda vez que o usuário se conectar a aplicação por meio do WebSocket, vou receber um objeto
  io.on('connection', socket => {
    // onde ficam os parâmetros que foram enviados pelo front
    const { latitude, longitude, techs } = socket.handshake.query;


    // faz uma função aguardar um certo tempo antes de ser executada (3 segundos)
    // setTimeout(() => {
    //   // uma informação que o back está mandando para o front sem que este faça uma requisição ao back
    //   socket.emit('message', 'Hello Omnistack');
    // }, 3000);


    // salva-se todas as conexões que são feitas na aplicação
    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsArray(techs),
    })
  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    // comparando as coordenadas do dev que acabou de se cadastrar com as coorndenadas de cada conexão do webSocket (< 10km)
    return calculateDistance(coordinates, connection.coordinates) < 10
      // retorna true se o dev tem pelo menos uma das techs buscadas no front
      && connection.techs.some(item => techs.includes(item));
  });
}

// to -> destinatários
exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    // envia-se os dados do dev cadastrado para o front pq ele satisfez as condições de busca
    io.to(connection.id).emit(message, data);
  })
}