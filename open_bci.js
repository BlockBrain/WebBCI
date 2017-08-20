const Cyton = require('openbci').Cyton;
const k = require('openbci-utilities').Constants;
const ourBoard = new Cyton({
  //verbose: true
});
const resyncPeriodMin = 5;
const secondsInMinute = 60;
let sampleRate = k.OBCISampleRate250;
let timeSyncPossible = false;
ourBoard.connect('COM3')
  .then((boardSerial) => {
//    ourboard.softResest();
    ourBoard.on('ready',() => {
      sampleRate = ourBoard.sampleRate();
      timeSyncPossible = ourBoard.usingVersionTwoFirmware();
      ourBoard.streamStart();
      ourBoard.on('sample', (sample) =>{
        if(sample._count % (sampleRate * resyncPeriodMin * secondsInMinute) == 0){
          ourBoard.usingVersionTwoFirmware();

          ourBoard.syncClocksFull()
          .then(syncObj => {
            if(syncObj.valid){
              console.log('syncObj',syncObj);
            }
            else{
              console.log('Was not able to sync.');
            }
          });
        }
        if(sample.timeStamp){
          console.log('NTP Time Stamp ${sample.timeStamp}');
        }
        for(let i = 0; i < 1; i++){
        console.log("Channel " + (i+1) + ": " + sample.channelData[i].toFixed(8) + "volts");
        }
      });
    });
  }).catch((err) => {
    console.log(err);
  });


//ourBoard.streamStop().then(ourBoard.discconect());
