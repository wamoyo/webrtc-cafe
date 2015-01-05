
// singaling-server.js

var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
  if (req.url ==='/') {
    fs.readFile('index.html', function (err, html) {
      res.writeHeader(200, {"Content-Type": "text/html"});
      return res.end(html);
    });
  } else {
    res.end('Hi! ...not sure what you wantツ');
  }
});

server.listen(3000, function () {
  console.log('Jumping on port 8000!');
});

var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {

  // convenience function to log server messages to the client
  function log() {
    var array = ['>>> Message from server: '];
    for (var i = 0; i < arguments.length; i++) {
      array.push(arguments[i]);
    }
    socket.emit('log', array);
  }

  socket.on('message', function (message) {
    log('Server got message:', message);
    // for a real app, would be room only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', function (room) {
    var numClients = io.sockets.clients(room).length;

    log('Room ' + room + ' has ' + numClients + ' client(s)');
    log('Request to create or join room ' + room);

    if (numClients === 0) {
      socket.join(room);
      socket.emit('created', room);
    } else if (numClients === 1) {
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room);
    } else { // max two clients
      socket.emit('full', room);
    }
    socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
    socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);
  });
});

