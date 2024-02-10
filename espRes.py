# client.py
import socketio
import paho.mqtt.client as mqtt
import time

sio = socketio.Client()

@sio.event
def connect():
    print('Connection established')

@sio.event
def disconnect():
    print('Disconnected from server')

# Define callback functions
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
        # Subscribe to the topic
        client.subscribe("mqtt/esp1")
    else:
        print(f"Connection failed with code {rc}")

def on_message(client, userdata, msg):
    print(f"Received message on topic {msg.topic}: {msg.payload.decode()}")       
    sio.emit('chat', {
      'message': msg.payload.decode(),  
      'handle': 'Python'
    })
    # sio.wait()
    

# Create an MQTT client
client = mqtt.Client()
sio.connect('http://localhost:3000')  # Change the URL to match your Node.js server

# Set the callback functions
client.on_connect = on_connect
client.on_message = on_message

while True:
    testMsg = "{'deviceId':'1','J01':'22'}"
    # print(f"Received message on topic {msg.topic}: {msg.payload.decode()}")   
    print(f"Received message on topic mqtt: {testMsg}")   
    sio.emit('chat', {
    #   'message': msg.payload.decode(),
        'message': testMsg,
      'handle': 'Python',
    })    
    time.sleep(7)

try:
    # Connect to the MQTT broker
    client.connect("test.mosquitto.org", 1883, 60)
except Exception as e:
    print(f"Error connecting to MQTT broker: {e}")
    exit(1)

# Loop to keep the script running and processing messages
client.loop_forever()



# # Send a message to the server


# if __name__ == '__main__':
    # sio.connect('http://localhost:3000')  # Change the URL to match your Node.js server
    # sio.emit('chat', {
    #   'message': 'From python',
    #   'handle': 'Python',
    # })
    # sio.wait()
    
