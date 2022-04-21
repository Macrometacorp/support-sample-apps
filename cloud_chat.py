from c8 import C8Client
import six
import random
import threading
import base64
import json

email = "[email]"
password = "[password]"
geo_fabric = "_system"
host = 'gdn.paas.macrometa.io'

def create_subscriber():
    subscriber = client.subscribe(stream=stream_name, local=False, subscription_name=random_user,
    consumer_type=client.CONSUMER_TYPES.SHARED)
    while True:
        m1 = json.loads(subscriber.recv())  #Listen on stream for any receiving msg's
        msg1 = str(base64.b64decode(six.b(m1['payload']).decode('utf-8')))[15:-3]
        print(msg1) #Print the received msg over stream
        subscriber.send(json.dumps({'messageId': m1['messageId']}))#Acknowledge the received msg.

client = C8Client(protocol='https', host=host, port=443,
                    email = email, password= password,
                    geofabric=geo_fabric) 
stream_name = "chatroom420"
random_user = "User" + str(random.randint(1,1000))

subscriber_thread = threading.Thread(target=create_subscriber)
subscriber_thread.start()
producer = client.create_stream_producer(stream_name, local=False)

while True:
    msg = input()
    user_msg = random_user + ":" + str(msg)
    data = {
                "payload": user_msg,
        }
    producer.send(json.dumps(data))
    response =  json.loads(producer.recv())