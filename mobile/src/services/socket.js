import socketio from 'socket.io-client';

const socket = socketio('http://192.168.0.17:3333', {
  autoConnect: false,
});

// está pegando o que o back mandou (fica ouvindo) (nesse caso, o nome da informação é 'message' e seu conteúdo está contido em text)
// socket.on('message', text => {
//   console.log(text);
// })

function subscribeToNewDevs(subscribeFunction) {
  socket.on('new-dev', subscribeFunction);
}

function connect(latitude, longitude, techs) {
  socket.io.opts.query = {
    latitude,
    longitude,
    techs,
  }

  socket.connect();

}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export { connect, disconnect, subscribeToNewDevs };