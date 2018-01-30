
var express = require("express")
var app = express();           // web framework external module
var webServer = require("http").createServer(app);              // http server core module
var socketServer = require("socket.io").listen(webServer);        // web socket external module
var dgram = require( 'dgram' );
var BCI2000file = require('./js/BCI2000')
const { spawn } = require('child_process')


var signal;
webServer.listen(process.env.PORT || 80,"127.0.0.1");
app.use(express.static(__dirname + '/html'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/js'));
//Store all JS and CSS in Scripts folder.
app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

var udp_server = dgram.createSocket( 'udp4' );
udp_server.on( 'listening', function (data) {
	//var address = udp_server.address();
	var hostname = '127.0.0.1:55404';
  console.log(data);
	console.log( 'UDP Server listening on ' + hostname );
} );


socketServer.sockets.on('connection', function(socket){
  console.log("Connected");
  socket.on('openBCI2000', function(data){
    console.log(data);
    const BCIString = 'D:/Software/Github/Unity/UnityBCI/Assets/BCI2001/batch/New2.bat';
    const bat = spawn('cmd', ['/c', BCIString]);
    bat.stdout.on('data',(data)=>{
      console.log(data.toString());
    });
    bat.stderr.on('data',(data)=>{
      console.log(data.toString());
    });
    socketServer.sockets.emit('openedBCI2000', {msg: data});
  });
/*
    if(signal.val=='on'){
    }
    if(signal.val=='imp'){
      bcistuff.impedence();
    }
    if(signal.val=='stream'){
      bcistuff.obci_server.on(k.OBCIEmitterSample, (sample) => {
        //for (let i = 0; i < wifi.getNumberOfChannels(); i++) {
        console.log(JSON.stringify(sample.channelData[1].toFixed(8)));
      });
    }

    if(signal.val=='startstream'){
      bcistuff.obci_server.streamStart();
    }
    if(signal.val=='reset'){
      bcistuff.obci_server.softReset();
    }
    if(signal.val=='off'){
      bcistuff.disconnect_obci();
    }
    */
  });
