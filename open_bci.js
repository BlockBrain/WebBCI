const Cyton = require('openbci').Cyton;
const k = require('openbci-utilities').Constants;
const ourBoard = new Cyton();
ourBoard.connect(k.OBCISimulatorPortName)
  .then((boardSerial) => {
    ourBoard.on('ready',() => {
      ourBoard.streamStart();
      ourBoard.on('sample', (sample) =>{
        for(let i = 0; i < ourBoard.numberOfChannels(); i++){
        console.log("Channel " + (i+1) + ": " + sample.channelData[i].toFixed(8) + "volts");
        }
      });
    });
  }).catch((err) => {
    console.log(err);
  });
