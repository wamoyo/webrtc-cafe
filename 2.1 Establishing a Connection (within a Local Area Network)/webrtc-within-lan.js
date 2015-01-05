
// webrtc-within-lan.js

var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs');

app.get('*', function(req, res) { // Serve up the html
  fs.readFile('webrtc-within-lan.html', function (err, html) {
    if (err) { console.log(err); }
    res.writeHeader(200, {"Content-Type": "text/html"});
    return res.end(html);
  });
});

var server = http.createServer(app).listen(3000, function () {
  console.log('Jumping on port 3000!');
});

var io = require('socket.io')(server);

io.sockets.on('connection', function (socket) {
  socket.on('client', function (data) {
    console.log(data);
    socket.emit('server', { message: 'Hello!' });
  });

});

