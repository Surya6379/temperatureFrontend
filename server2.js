const mqtt = require("mqtt");
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org");

mqttClient.on("connect", () => {
  mqttClient.subscribe("mqtt/esp1", (err) => {
    if (!err) {
      console.log("Connected");      
    }
  });
});

mqttClient.on("message", (topic, message) => { 
  console.log(message.toString());  
});


