
var express = require("express")
var app = express();           // web framework external module
var webServer = require("http").createServer(app);              // http server core module
var socketServer = require("socket.io").listen(webServer);        // web socket external module
<<<<<<< HEAD:MultiNetServer.js
var dgram = require( 'dgram' );
var BCI2000file = require('./js/BCI2000')
const { spawn } = require('child_process')
=======
//var https = require('https');
var fs = require('fs');
users = [];
connections = [];
var format = require('string-format')

var easyrtc = require("easyrtc");               // EasyRTC external module
var dgram = require('dgram');
var axios = require('axios');
var options = {
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem')
};
>>>>>>> c1f8a69f3e28c18612c24bbeb4fac56c11c49bdb:old/MultiNetServer_old.js


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

<<<<<<< HEAD:MultiNetServer.js

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
=======
  socket.on('disconnect',function(data){
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconneted: %s sockets disconnected', connections.length);
  });

  const ourBoard = new Cyton();

  socket.on('bciStream',function(signal){
    console.log(signal.val);


    if(signal.val=='on'){
    ourBoard.connect(k.OBCISimulatorPortName) // This will set `simulate` to true
        .then((boardSerial) => {
            ourBoard.on('ready',() => {
              ourBoard.streamStart();
                    ourBoard.on('sample',(sample) => {
                      socketServer.emit('brainwave',sample);
                      for (let i = 0; i < ourBoard.numberOfChannels(); i++) {
                        //console.log("Channel " + (i + 1) + ": " + sample.channelData[i].toFixed(8) + " Volts.");
                        }
                      });
                    });
        }).catch((err) => {
        });
  }
  if(signal.val=='off'){
      ourBoard.streamStop().catch(console.log);     //problem here
    ourBoard.disconnect();

  }
});
});




/*
      let chat = db.collection('chats');
      sendStatus = function(s){
          socket.emit('status', s);
      }
      chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }
            socket.emit('output', res);
        });
      socket.on('input', function(data){
            let name = data.name;
            let message = data.message;
            if(name == '' || message == ''){
                sendStatus('Please enter a name and message');
            } else {
                chat.insert({name: name, message: message}, function(){
                    socketServer.emit('output', [data]);
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
                });
            }
        });
      socket.on('clear', function(data){
            // Remove all chats from collection
            chat.remove({}, function(){
                // Emit cleared
                socket.emit('cleared');
            });
        });
    });
});
*/

//BCI2000 stuff
const udpServer = dgram.createSocket('udp4');
udpServer.bind(55424,"192.168.0.6");
var CPosX;
var CPosY;
udpServer.on('message', (msg1, rinfo) => {
  var BCIString = String.fromCharCode.apply(null, new Uint16Array(msg1))
  var CPx = BCIString.indexOf("CursorPosX");
  var CPy = BCIString.indexOf("CursorPosY");
  var TarC = BCIString.indexOf("TargetCode");
  var ResC = BCIString.indexOf("ResultCode");
  if(CPx == 0){
    CPosX = parseFloat(BCIString.substring(11,15));
  }
  if(CPy == 0){
    CPosY = parseFloat(BCIString.substring(11,15));
  }
  if(CPy == 0 || CPx == 0){
    socketServer.emit('Pos',{ PosX: (CPosX-1548)/387, PosY: ((CPosY-1548)/290)+6.15});
  }
});


var myIceServers = [
  {"url":"stun:stun.l.google.com:19302"},
  {"url":"stun:stun1.l.google.com:19302"},
  {"url":"stun:stun2.l.google.com:19302"},
  {"url":"stun:stun3.l.google.com:19302"}
  // {
  //   "url":"turn:[ADDRESS]:[PORT]",
  //   "username":"[USERNAME]",
  //   "credential":"[CREDENTIAL]"
  // },
  // {
  //   "url":"turn:[ADDRESS]:[PORT][?transport=tcp]",
  //   "username":"[USERNAME]",
  //   "credential":"[CREDENTIAL]"
  // }
];
easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("demosEnable", false);

// Start EasyRTC server
//var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
//    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
//    });
//});
>>>>>>> c1f8a69f3e28c18612c24bbeb4fac56c11c49bdb:old/MultiNetServer_old.js
