// Load required modules
const Cyton = require('openbci').Cyton;
const k = require('openbci-utilities').Constants;
const mongo = require('mongodb').MongoClient;
var app = require("express")();           // web framework external module
var webServer = require("http").createServer(app);              // http server core module
var socketServer = require("socket.io").listen(webServer);        // web socket external module
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

webServer.listen(process.env.PORT || 80,"192.168.0.6");

app.get('/', function(req,res){
  res.sendFile(__dirname + '/html/index.html');
});

socketServer.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

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
