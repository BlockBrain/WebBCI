socket.on('send message', function(){
  getApiAndEmit(socket);
});
socket.on('lightbulb',function(msg){
  lightOn(socket, msg);
});

socket.on('TV',function(msg){
  rokuControl(socket,msg);
});



  const rokuControl = async(socket,msg) => {
    try{
        console.log(format('http://192.168.0.5:8060/keypress/{}',msg.input));
      const TV_on = await axios.post(
        format('http://192.168.0.5:8060/keypress/{}',msg.input)
      )
    }
    catch (e) {
  console.log(e);
}
  }

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
    //TP-link
    else if(msg.val==1){
      const light_TP = await axios.post(
        "https://wap.tplinkcloud.com?token=6b1ce74d-2842f6f23f7b4e81aedb8ff",{
        method: "passthrough",
        params: {
          deviceId: "80061F61F98A200497633B81A4A0D45117C801B2",
          requestData:
          "{\"system\":{\"set_relay_state\":{\"state\":1}}}"
        }
      }
      )
    }
    else if(msg.val==0){
      const light_TP = await axios.post(
        "https://wap.tplinkcloud.com?token=6b1ce74d-2842f6f23f7b4e81aedb8ff",{
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
  //}
//var webServer = https.createServer(options, app).listen(80,"192.168.0.4");

//mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    //if(err){
  //      throw err;
  //  }

      const getApiAndEmit = async socket => {
      try {
        const energy_total = await axios.get(
          "http://192.168.0.52/emoncms/feed/timevalue.json?id=1&apikey=fddf9b5ee1d7217dd310bc0c5269e998"
        )
        const energy_miner1 = await axios.get(
          "http://192.168.0.52/emoncms/feed/timevalue.json?id=5&apikey=fddf9b5ee1d7217dd310bc0c5269e998"
        )
        const energy_miner2 = await axios.get(
          "http://192.168.0.52/emoncms/feed/timevalue.json?id=7&apikey=fddf9b5ee1d7217dd310bc0c5269e998"
        )
        const energy_solar = await axios.get(
          "http://192.168.0.52/emoncms/feed/timevalue.json?id=8&apikey=fddf9b5ee1d7217dd310bc0c5269e998"
        )
        const hashrate = await axios.post(
          "http://dwarfpool.com/eth/api?wallet=c92c9889196360226815c353747a5a1e8d70fe91&email=eth@example.com"
        )

        socketServer.sockets.emit('new message',energy_total.data.value,energy_miner1.data.value, energy_miner2.data.value, energy_solar.data.value, hashrate.data);
        } catch (e) {
        console.log(e);
      }
    }
