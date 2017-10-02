var express = require("express")
var app = express();           // web framework external module
var webServer = require("http").createServer(app);              // http server core module
var socketServer = require("socket.io").listen(webServer);        // web socket external module
connections = [];
var bcistuff = require('./openbciconnection.js');
var automate = require('./automate.js');
const k = require('openbci-utilities').Constants;
var axios = require('axios');
var format = require('string-format')

let counter = 0;
let sampleRateCounterInterval = null;
let lastSampleNumber = 0;
let MAX_SAMPLE_NUMBER = 100;
var opbci_server;
var sample1;
var samp;

var easyrtc = require("easyrtc");               // EasyRTC external module
webServer.listen(process.env.PORT || 80,"192.168.0.3");
app.use(express.static(__dirname + "/html"));
app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

socketServer.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('disconnect',function(data){
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconneted: %s sockets disconnected', connections.length);
  });
  //ROKU TV connections
  socket.on('ROKUinfo', function(rokuData){
    automate.rokuControl(socket,rokuData.input);
  });
  socket.on('Miner_Power_send', function(minepower){
    getApiAndEmit(socket,minepower);

  });

  //Philips Hue bulbs
  socket.on('Lights', function(lightData){
    automate.lightOn(socket, lightData);
  });

  //openBCI socket connections
  socket.on('bciStream',function(signal){
    if(signal.val=='on'){
      bcistuff.connect();
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
/*
            //}
              if (sample.valid) {
                counter++;
                if (sampleRateCounterInterval === null) {
                  sampleRateCounterInterval = setInterval(() => {
                //    socketServer.emit('brainwave',sample.channelData[1].toFixed(8));
                    console.log("ch1: " + sample.channelData[1].toFixed(8));
              //      console.log(`SR: ${counter}`);
                    counter = 0;
                  }, 1);
                }

              }
              });
              */
    if(signal.val=='startstream'){
      bcistuff.obci_server.streamStart();
    }
    if(signal.val=='reset'){
      bcistuff.obci_server.softReset();
    }
    if(signal.val=='off'){
      bcistuff.disconnect_obci();
    }
  });
});

async function getApiAndEmit (socket){
try {
  const energy_total = await axios.get(
    "http://192.168.0.10/emoncms/feed/timevalue.json?id=3&apikey=365c47020e2a8b1a4f8daacbe576a23b"
  )
  const energy_miner1 = await axios.get(
    "http://192.168.0.10/emoncms/feed/timevalue.json?id=4&apikey=365c47020e2a8b1a4f8daacbe576a23b"
  )
  const energy_miner24 = await axios.get(
    "http://192.168.0.10/emoncms/feed/timevalue.json?id=2&apikey=365c47020e2a8b1a4f8daacbe576a23b"
  )
  const energy_miner3 = await axios.get(
    "http://192.168.0.10/emoncms/feed/timevalue.json?id=5&apikey=365c47020e2a8b1a4f8daacbe576a23b"
  )
  const energy_garage = await axios.get(
    "http://192.168.0.10/emoncms/feed/timevalue.json?id=1&apikey=365c47020e2a8b1a4f8daacbe576a23b"
  )
  const hashrate = await axios.post(
    "http://dwarfpool.com/eth/api?wallet=c92c9889196360226815c353747a5a1e8d70fe91&email=eth@example.com"
  )
  socketServer.sockets.emit('Miner_Power_receive', energy_total.data.value,energy_miner1.data.value, energy_miner24.data.value, energy_miner3.data.value, energy_garage.data.value, hashrate.data);
  } catch (e) {
  console.log(e);
}
}

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
var rtc = easyrtc.listen(app, socketServer, null, function(err, rtcRef) {
    rtcRef.events.on("roomCreate", function(appObj, creatorConnectionObj, roomName, roomOptions, callback) {
    });
});
