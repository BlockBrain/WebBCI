var axios = require('axios');
var format = require('string-format')
module.exports = {

rokuControl: async function rokuControl(socket,msg) {
  try{
      console.log(format('http://192.168.0.22:8060/keypress/{}',msg));
    const TV_on = await axios.post(
      format('http://192.168.0.22:8060/keypress/{}',msg)
    )
  }
  catch (e) {
console.log(e);
}
},

lightOn: async function lightOn(socket, msg) {
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
      "http://192.168.0.15/api/aKkMwrFSuI4zeztRtAdF-KuY2LINDjkOlzMXps-O/lights/5/state",{"on":true, "bri":parseInt(msg.value)}
    )
    if(msg.value==0){
      const turnlighton = await axios.put(
      "http://192.168.0.15/api/aKkMwrFSuI4zeztRtAdF-KuY2LINDjkOlzMXps-O/lights/5/state",{"on":false}
    )
    }
  }
  //TP-link
  else if(msg.val==1){
    console.log("light stuff");
    const light_TP = await axios.post(
      "https://wap.tplinkcloud.com?token=6b1ce74d-151e6ef549944752a997fb3",{
      method: "passthrough",
      params: {
        //Coffee pot
      //  deviceId: "80063BE6563FBDA47600A13ED089C4C118A5CE3A",
        //kitchen light
        deviceId: "80061F61F98A200497633B81A4A0D45117C801B2",
        requestData:
        "{\"system\":{\"set_relay_state\":{\"state\":1}}}"
      }
    }
    )
  }
  else if(msg.val==0){
    const light_TP = await axios.post(
      "https://wap.tplinkcloud.com?token=6b1ce74d-151e6ef549944752a997fb3",{
      method: "passthrough",
      params: {
        deviceId: "80061F61F98A200497633B81A4A0D45117C801B2",
        requestData:
        "{\"system\":{\"set_relay_state\":{\"state\":0}}}"
      }
    }
    )
  }
  } catch (e) {
console.log(e);
}
}




}
