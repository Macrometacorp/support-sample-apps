import os
import random
import time

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

""" Create stream"""
def create_stream():
    has_stream = client.has_stream(stream_name)
    """ Create a stream if stream does not exist """
    if has_stream:
        print("This stream already exists!")
        print(f"Existing Producer = c8globals.${stream_name}")
    else:
        print("\nCreating global stream...")
        stream_info = client.create_stream(stream_name, False)
        print(f"New Producer = ${stream_info['stream-id']}")


""" Create producer and send data through a stream """
def create_producer():
    create_stream()

    producer = client.create_stream_producer(stream_name, local=False)
    while True:
        message = f"Hello Macrometa Stream! Here is your random message number {random.randint(1, 100)}"
        producer.send(message)
        time.sleep(1)


create_producer()