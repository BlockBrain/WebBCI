// Load required modules
const mongo = require('mongodb').MongoClient;
var app = require("express")();           // web framework external module
var webServer = require("http").createServer(app);              // http server core module
var socketServer = require("socket.io").listen(webServer);        // web socket external module
//var https = require('https');
var fs = require('fs');
users = [];
connections = [];

var easyrtc = require("easyrtc");               // EasyRTC external module
var dgram = require('dgram');
var axios = require('axios');

var options = {
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem')
};

var brightness;
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
  socket.on('send message', function(){
    getApiAndEmit(socket);
  });
  socket.on('lightbulb',function(msg){
    lightOn(socket, msg);
  });

});

  const lightOn = async (socket, msg) => {
  try {
    if(msg.state==1){
      const turnlighton = await axios.put(
        "http://192.168.0.15/api/aKkMwrFSuI4zeztRtAdF-KuY2LINDjkOlzMXps-O/lights/3/state",{"on":true, "bri":parseInt(msg.value)}
      )
      if(msg.value==0){
        const turnlighton = await axios.put(
        "http://192.168.0.15/api/aKkMwrFSuI4zeztRtAdF-KuY2LINDjkOlzMXps-O/lights/3/state",{"on":false}
      )
      }
    }

    else if (msg.state==2) {
      const turnlighton = await axios.put(
        "http://192.168.0.15/api/aKkMwrFSuI4zeztRtAdF-KuY2LINDjkOlzMXps-O/lights/4/state",{"on":true, "bri":parseInt(msg.value)}
      )
      if(msg.value==0){
        const turnlighton = await axios.put(
        "http://192.168.0.15/api/aKkMwrFSuI4zeztRtAdF-KuY2LINDjkOlzMXps-O/lights/4/state",{"on":false}
      )
      }
    }
  } catch (e) {
  console.log(e);
}
}
  //}
//var webServer = https.createServer(options, app).listen(80,"192.168.0.4");

//mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    //if(err){
  //      throw err;
  //  }

      const getApiAndEmit = async socket => {
      try {
        const energy = await axios.get(
          "http://192.168.0.52/emoncms/feed/timevalue.json?id=1&apikey=fddf9b5ee1d7217dd310bc0c5269e998"
        )
        const lightinfo = await axios.get(
          "http://192.168.0.15/api/aKkMwrFSuI4zeztRtAdF-KuY2LINDjkOlzMXps-O/lights/3"
        )
        const hashrate = await axios.post(
          "http://dwarfpool.com/eth/api?wallet=c92c9889196360226815c353747a5a1e8d70fe91&email=eth@example.com"
        )

        socketServer.sockets.emit('new message',lightinfo.data, energy.data.value, hashrate.data);
//        socket.emit('FromAPI',,);
  //      console.log(lightinfo.data,energy.data,hashrate.data);
        } catch (e) {
        console.log(e);
      }
    }

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
