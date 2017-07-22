var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dgram = require('dgram')
const udpServer = dgram.createSocket('udp4');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


udpServer.bind(55404,"192.168.0.6");

udpServer.on('message', (msg1, rinfo) => {
  var BCIString = String.fromCharCode.apply(null, new Uint16Array(msg1))
  var n = BCIString.indexOf("CursorPosX")
  if(n == 0)
  {
  var CursorPos=parseFloat(`${msg1}`.substring(11,15));
  console.log((CursorPos-2047)/100);
  io.emit('chat message',(CursorPos-2047)/100);
  }
});

http.listen(80, function(){});
