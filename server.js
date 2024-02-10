var express = require('express');
var app = express();
const http = require('http').createServer(app);
var socket = require('socket.io');
const mqtt = require("mqtt");
const mqttClient = mqtt.connect("mqtt://test.mosquitto.org");

var server = http.listen(3000, () => {
    console.log('Listening at port 3000');
});

var io = socket(server);

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



io.on('connection', (socket) => {
    console.log(`New connection ${socket.id}`)

    socket.on('chat', function (data) {
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function (data) {
        io.sockets.emit('typing', data);
    });
})

