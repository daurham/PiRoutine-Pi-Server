const io = require('./index').getIO();
const clients = require('../Clients');

io.on('connection', (socket) => {
  clients.add(socket.id);
  console.log(clients); // Testing

  socket.on('connect', () => { });

  socket.on('disconnecting', () => { });

  socket.on('disconnect', (room) => {

    let currUser = clients.getName(socket.id);
    console.log(`${currUser} has disconnected. Room: ${room}, ID: ${socket.id.slice(0, 2)}`);
    io.emit('disconnectPlayer', clients.find(socket.id));
    clients.removeOccupant(room, socket.id);
    clients.remove(socket.id);
    clients.remove(currUser);
  });

  socket.on('getInitClients', (user, room, cb) => {
    console.log('getInitClient-Room: ', room);
    let curPlayers = clients.getOccupants(room);
    console.log('sending curPlayers', curPlayers);
    if (room === '') {
      io.emit('getInitClients', clients.getPlayers(room));
    } else {
      io.to(room).emit('getInitClients', curPlayers, user, room, () => {
        cb(); // -> 'getTurn'
      });
    }

  });


  socket.on('ping', (room) => {
    console.log('in Room:', room);
    console.log('socket:', socket.id);
    io.to(room).emit('ping', room)
  })


  socket.on('join-room', (user, room) => {
    // let currUser = clients.find(socket.id);
    // console.log('room change1: ', currUser);
    // currUser.room = room;
    // console.log('room change2: ', currUser);
    let player = (clients.findOccupant('player1') 
                  ? 'player2' : 'player1');
    console.log('socketID: ', socket.id);
    clients.add(socket.id, user, player, room)
    console.log('Join-room pre-List: ', clients.List);
    // let user = currUser.name;
    let currRoommates = clients.getOccupants(room);
    console.log(`A client has joined room: ${room}, with: `, currRoommates);

    // io.join(room);
    socket.join(room);
    clients.Rooms[room] = Object.keys(clients.getOccupants(room)).length;
    io.to(room).emit('connect-room', user, room, () => {
      let player = clients.find(user);
      console.log('player:', player)
      if (!clients.findOccupant('player1')) {
        player.player = 'player1';
        player.playerValue = 'X';
      } else if (!clients.findOccupant('player2')) {
        player.player = 'player2';
        player.playerValue = 'O';
      }
      player.score = 0;
      player.room = room;
      // clients.add(socket.id, user, false, room);
      console.log(`after ${user} joins: `, clients.getOccupants(room));
    });
  });



  socket.on('addPlayer1', (name, room, cb) => {
    let currRoommates = clients.getOccupants(room);
    console.log('aPlayers:', clients.getPlayers(room));
    console.log(`${name} is joining as room ${room} player1, with: `, currRoommates);
    // clients.add(socket.id, name, 'player1', room);
    console.log('bPlayers:', clients.getPlayers(room));
    io.to(room).emit('addPlayer', clients.getPlayers(room), () => {
      cb(); // -> setUser -> cb -> submitUser
    });
  });

  socket.on('addPlayer2', (name, room, cb) => {
    let currRoommates = clients.getOccupants(room);
    console.log(`${name} joined as room ${room} player2, with: `, currRoommates);
    // clients.add(socket.id, name, 'player2', room);
    console.log('Players:', clients.getPlayers(room));
    io.to(room).emit('addPlayer', clients.getPlayers(room), () => {
      cb(); // -> setUser -> cb -> submitUser
    });
  });

  socket.on('message', (message, room) => {
    let currUser = clients.getName(socket.id);
    let newMsg = { name: currUser, message };
    console.log('new msg: ', newMsg, 'from: ', currUser);
    if (room === '') {
      io.emit('message', newMsg);
    } else {
      io.to(room).emit('message', newMsg);
      // socket.to(room).emit('message', newMsg);
    }
  });

  socket.on('move', (move, room) => {
    io.emit('move', move);
    let currUser = clients.getName(socket.id);
    // console.log('move: ', move)
    if (room === '') {
      io.emit('announcer', `${currUser} made a move!`);
    } else {
      io.to(room).emit('announcer', `${currUser} made a move!`);
      // io.to(room).emit('message', newMsg);
    }
  });

  socket.on('clear-board', (room) => {
    // console.log('wiping!');
    if (room === '') {
      io.emit('clear-board');
    } else {
      io.to(room).emit('clear-board');
    }
  });

  socket.on('getTurn', (room) => {
    let player1 = clients.getName('player1');
    let player2 = clients.getName('player2');
    if (clients.Turn !== player1 && clients.Turn !== player2) {
      clients.Turn = player1;
    }
    if (room === '') {
      io.emit('getTurn', clients.Turn);
    } else {
      console.log('gettingTurn')
      io.to(room).emit('getTurn', clients.Turn);
    }
  });

  socket.on('toggleTurn', (room) => {
    console.log('It\'s ' + clients.toggleTurn() + '\'s turn');
    // console.log('emitting -> ', clients.Turn);
    // console.log('emitting -> ', clients.Turn);
    if (room === '') {
      io.emit('toggleTurn', clients.Turn);
    } else {
      io.to(room).emit('toggleTurn', clients.Turn);
    }
  });

  socket.on('updateBoardStatus', ({ stat, score }, room) => {
    // if (clients.find(stat)) clients.find(stat).score = score; // increments backend score
    // console.log('status? -> ', stat);
    if (room === '') {
      io.emit('updateBoardStatus', stat);
    } else {
      io.to(room).emit('updateBoardStatus', stat);
    }
  });

});

export {};