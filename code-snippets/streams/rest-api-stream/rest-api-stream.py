import base64
import json
import requests
import six
import threading
import time
from websocket import create_connection

# Constants
URL = "api-play.paas.macrometa.io"
HTTP_URL = f"https://{URL}"
API_KEY = "XXXXX" # Use your API key here
AUTH_TOKEN = f"apikey {API_KEY}"
FABRIC = "_system"
STREAM_NAME = "teststream"
TENANT_NAME = "XXXXX" # Add your tenant name here
CONSUMER_NAME = "testconsumer"
IS_GLOBAL = True # For a global stream pass True and False for local stream

stream_type = ""
if IS_GLOBAL:
    stream_type = "c8global"
else:
    stream_type = "c8local"

# Create a HTTPS session

session = requests.session()
session.headers.update({"content-type": 'application/json'})
session.headers.update({"authorization": AUTH_TOKEN})

# Create a stream
url = f"{HTTP_URL}/_fabric/{FABRIC}/_api/streams/{STREAM_NAME}?global={IS_GLOBAL}"
resp = session.post(url)
print("\nStream Created: ", resp.text)

# Publish messages
# Send message in body
producerurl = f"wss://{URL}/_ws/ws/v2/producer/persistent/{TENANT_NAME}/{stream_type}.{FABRIC}/{stream_type}s.{STREAM_NAME}"

# Enter your message here
msg = "Hello World"
def create_producer():
    ws = create_connection(producerurl, header=[f"Authorization: {AUTH_TOKEN}"])
    payload = {
        "payload": base64.b64encode(
            six.b(msg)
        ).decode("utf-8")
    }
    ws.send(json.dumps(payload))
    print(f"Message sent: {msg}")
    time.sleep(3)
    response = json.loads(ws.recv())
    if response['result'] == 'ok':
        print("Received acknowledgement that message was delivered successfully")
    else:
        print(f"Failed to publish message: {response}")
    ws.close()

# Or
# Use publish message api to publish message
#url = f"{HTTP_URL}/_fabric/{FABRIC}/_api/streams/{stream_type}s.{STREAM_NAME}/publish?global={IS_GLOBAL}"
#resp = session.post(url, data="Hello")
#print("\nMessage Posted: ", resp.text)

# Subscribe to stream
consumerurl = f"wss://{URL}/_ws/ws/v2/consumer/persistent/{TENANT_NAME}/{stream_type}.{FABRIC}/{stream_type}s.{STREAM_NAME}/{CONSUMER_NAME}"

def create_consumer(): 
    ws = create_connection(consumerurl, header=[f"Authorization: {AUTH_TOKEN}"])
    while True:
        msg = json.loads(ws.recv())
        if msg:
            print(f"Message received: {base64.b64decode(msg['payload']).decode('utf-8')}")
            # Acknowledge successful processing
            ws.send(json.dumps({'messageId': msg['messageId']}))
            break
    ws.close()

# Threading is added here to open both producer and consumer connections simultaneously (not needed when using publish api)
t1 = threading.Thread(target=create_producer)
t2 = threading.Thread(target=create_consumer)
t1.start(), t2.start()
t1.join(), t2.join()

# Delete subscription
url = f"{HTTP_URL}/_fabric/{FABRIC}/_api/streams/{stream_type}s.{STREAM_NAME}/subscriptions/{CONSUMER_NAME}?global=true"
resp = session.delete(url)
print("Subscription deleted: ", resp.text)