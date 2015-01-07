
// server.js

var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs');

app.get('*', function(req, res) { // Serve up the HTML.
  fs.readFile('index.html', function (err, html) {
    if (err) { console.log(err); }
    res.writeHeader(200, {"Content-Type": "text/html"});
    return res.end(html);
  });
});

var server = http.createServer(app).listen(3000, function () { // Start the HTTP server.
  console.log('Jumping on port 3000!');
});

var io = require('socket.io')(server); // Start the WebSocket server.

var rooms = {}; // Maintain a list of available rooms.

io.sockets.on('connection', function (socket) { // When users connect to the websocket, attach the events below to their socket.

  socket.on('client', function (data) { // A quick test...
    console.log(data);
    socket.emit('server', { message: 'Hello!' });
  });


  /*
   * Listen for signalling from clients.
   */

  socket.on('outgoing offer', function (data) { // Outgoing Offer
    console.log('New Room!', data.room);
    rooms[data.room] = {};
    rooms[data.room].offererSocket = socket;
    rooms[data.room].offer = data.offer;
  });

  socket.on('room joined', function (data) { // Room Joined
    if (rooms[data.room]) {
      socket.emit('incoming offer', { offer: rooms[data.room].offer, room: data.room }); // > Incoming Offer
    } else {
      console.log('Room does\'t exist', data.room);
      socket.emit('no room', { message: 'Sorry, that room doesn\'t exist' }); // > No Such Room
    }
  });

  socket.on('outgoing answer', function (data) { // Outgoing Answer
    console.log('Sending answer ', data.answer);
    rooms[data.room].answererSocket = socket;
    rooms[data.room].offererSocket.emit('incoming answer', { answer: data.answer, room: data.room }); // > Incoming Answer
  });

  socket.on('outgoing offerer ice', function (data) { // Outgoing Offerer ICE Candidates
    console.log('ICE from offerer: ', data);
    rooms[data.room].ice = data.ice;
    rooms[data.room].answererSocket.emit('incoming offerer ice', data); // > Incoming Offerer ICE Candidates
  });

  socket.on('outgoing answerer ice', function (data) { // Outgoing Answerer ICE Candidates
    console.log('ICE from answerer: ', data);
    rooms[data.room].ice = data.ice;
    rooms[data.room].offererSocket.emit('incoming answerer ice', data); // > Incoming Answerer ICE Candidates
  });

  socket.on('room closed', function (data) { // Room Closed
    console.log('closing room', data.room);
    delete rooms[data.room];
  });
});

