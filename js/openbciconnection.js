const k = require('openbci-utilities').Constants;
const Wifi = require('openbci-wifi');
let wifi = new Wifi({
  debug: false,
  verbose: true,
  latency: 10000,
});


module.exports = {

  connect: function() {
    wifi.connect({
      ipAddress: "192.168.0.17",
      sampleRate: 250
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
  stream_obci: function() {
    var sampleData;
      wifi.on(k.OBCIEmitterSample, (sample) => {
          sampleData = sample.channelData[1].toFixed(8);
          console.log("Channel " + (1) + ": " + sampleData + " Volts.");
      });

 },
 disconnect_obci: function() {
   wifi.streamStop().catch(console.log);
   wifi.disconnect().catch(console.log);
   wifi.removeAllListeners('rawDataPacket');
   wifi.removeAllListeners('sample');
   wifi.destroy();
   wstream.end();
},
obci_server: wifi,
}
