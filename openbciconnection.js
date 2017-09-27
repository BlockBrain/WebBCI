const k = require('openbci-utilities').Constants;
const Wifi = require('openbci-wifi');
let wifi = new Wifi.Wifi({
  debug: false,
  verbose: true,
  sendCounts: false,
  latency: 10000
});

var a_obci = 0;
var a_server = 0;

module.exports = {

   myFunction: function() {
     wifi.connect({
       ipAddress: "192.168.0.36",
    //
       streamStart: true
     });
   },

 disconnect_obci: function() {
   wifi.streamStop().catch(console.log);     //problem here
   wifi.disconnect();
},
a_server: wifi
}
