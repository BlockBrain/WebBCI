var app = require("express")();           // web framework external module
var webServer = require("http").createServer(app);              // http server core module
var socketServer = require("socket.io").listen(webServer);        // web socket external module
connections = [];
var bcistuff = require('./openbciconnection.js');
const k = require('openbci-utilities').Constants;



webServer.listen(process.env.PORT || 80,"127.0.0.1");

app.get('/', function(req,res){
  res.sendFile(__dirname + '/html/9_26_testing.html');
});

socketServer.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('disconnect',function(data){
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconneted: %s sockets disconnected', connections.length);
  });


  socket.on('bciStream',function(signal){
    if(signal.val=='on')
    {
      bcistuff.myFunction();
      bcistuff.a_server.on(k.OBCIEmitterSample, (sample) => {

//        a_obci = sample.channelData[1].toFixed(8);
    //    socketServer.emit('brainwave',sample.channelData[1]);//.toFixed(8));
    console.log(sample.channelData[1].toFixed(8));
    });
}

    if(signal.val=='off'){
      bcistuff.disconnect_obci();

    }
});
});
