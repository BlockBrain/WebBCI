const k = require('openbci-utilities').Constants;
const Wifi = require('openbci-wifi');
let wifi = new Wifi.Wifi({
  debug: false,
  verbose: false,
  sendCounts: false,
  latency: 10000
//  sampleRate: 255 // Custom sample rate

});
let counter = 0;
let sampleRateCounterInterval = null;
let lastSampleNumber = 0;
let MAX_SAMPLE_NUMBER = 255;
var opbci_server;
var sample1;
var samp;
module.exports = {

  connect: function() {

    wifi.connect({
      ipAddress: "192.168.0.36",
    }).catch(console.log("Connected"));

  },

  impedence: function() {
    console.log("Testing impedence");
    //wifi.on('impedanceArray', impedanceArray => {
    //  console.log(impedanceArray);
        /** Work with impedance Array */
    //});
    //wifi.impedanceTestChannels(['n','N','n','p','P','p','b','B']).catch(err => console.log(err));

    wifi.impedanceSet(1, true, false).catch(console.log("Setting impedence"));
    //wifi.on(k.OBCIEmitterImpedance, (impedance) => {
    //  console.log("Imp check?");
  //    console.log(impedance);
    //});

  },

 disconnect_obci: function() {
   // I don't think this is completely disconnecting because I can't reconnet
   if (wifi.isConnected()) wifi.disconnect().catch(console.log);
    wifi.removeAllListeners('rawDataPacket');
    wifi.removeAllListeners('sample');
    wifi.destroy();
    if (sampleRateCounterInterval) {
      clearInterval(sampleRateCounterInterval);
    }
},
obci_server: wifi,
}
