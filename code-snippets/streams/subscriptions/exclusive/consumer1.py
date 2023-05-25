import base64
import json
import os
from c8 import C8Client

""" For Python SDK we can omit https:// part of the URL """
BASE_URL = "play.paas.macrometa.io/"

stream_name = "stream_quickstart"

""" Connect to GDN """
client = C8Client(
    protocol='https',
    host=BASE_URL,
    port=443,
    apikey="xxxxxx",
    geofabric="_system"
)

""" Create consumer and receive data through a stream """
def create_consumer():
    print("\nConnecting consumer to global stream...")
    consumer = client.subscribe(
        stream_name,
        local=False,
        subscription_name="consumer_subscription"
        )
    while True:
        message = json.loads(consumer.recv())
        decoded_message = base64.b64decode(message['payload']).decode('utf-8')
        print(f"Received message '{decoded_message}' id='{message['messageId']}'")
        consumer.send(json.dumps(
            {'messageId': message['messageId']}))


create_consumer()