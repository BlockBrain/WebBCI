
//BCI2000 stuff
const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');

var CPosX;
var CPosY;


exports.module = function(msg){
  console.log(msg);
  udpServer.bind(55424,"192.168.0.10");
  udpServer.on('message', (msg1, rinfo) => {
    var BCIString = String.fromCharCode.apply(null, new Uint16Array(msg1))
    var CPx = BCIString.indexOf("CursorPosX");
    var CPy = BCIString.indexOf("CursorPosY");
    var TarC = BCIString.indexOf("TargetCode");
    var ResC = BCIString.indexOf("ResultCode");
    if(CPx == 0){
      CPosX = parseFloat(BCIString.substring(11,15));
      console.log(CPosX);
    }
    if(CPy == 0){
      CPosY = parseFloat(BCIString.substring(11,15));
      console.log(CPosY);

    }
    if(CPy == 0 || CPx == 0){
  //    socketServer.emit('Pos',{ PosX: (CPosX-1548)/387, PosY: ((CPosY-1548)/290)+6.15});
    }
  });
}
