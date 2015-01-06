
// server.js

var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs');

app.get('*', function(req, res) { // Serve up the html
  fs.readFile('index.html', function (err, html) {
    if (err) { console.log(err); }
    res.writeHeader(200, {"Content-Type": "text/html"});
    return res.end(html);
  });
});

var server = http.createServer(app).listen(3000, function () {
  console.log('Jumping on port 3000!');
});

var io = require('socket.io')(server);

var rooms = {}; // Maintain a list of available rooms.

io.sockets.on('connection', function (socket) {
  // Testing out socket.io...
  socket.on('client', function (data) {
    console.log(data);
    socket.emit('server', { message: 'Hello!' });
  });


  /*
   * Listen for offers from clients.
   */

  socket.on('outgoing offer', function (data) {
    console.log('New Room!', data.room);
    rooms[data.room] = data;
    rooms[data.room].socket = socket;
  });

  socket.on('room joined', function (data) {
    if (rooms[data.room]) {
      console.log('Room Joined!', data.room);
      socket.emit('incoming offer', { offer: rooms[data.room].offer, room: data.room });
    } else {
      console.log('Room does\'t exist', data.room);
      socket.emit('no room', { message: 'Sorry, that room doesn\'t exist' });
    }
  });

  socket.on('outgoing answer', function (data) {
    console.log('Sending answer ', data.answer);
    rooms[data.room].socket.emit('incoming answer', { answer: data.answer, room: data.room });
  });

  socket.on('room closed', function (data) {
    console.log('closing room', data.room);
    delete rooms[data.room];
  });

});

