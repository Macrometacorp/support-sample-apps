# Import the necessary libraries
from c8 import C8Client
import time
import json

APIKEY = 'api-key'
CLIENT = C8Client(protocol='https', host='api-gdn.paas.macrometa.io', port=443,
apikey=APIKEY)
FILE_PATH = 'path-to-file'
STREAM_NAME = 'InputStream'

PRODUCER = CLIENT.create_stream_producer(STREAM_NAME, local=True)

# Read HTTP access logs
with open(FILE_PATH, 'r') as file:
    logs = file.readlines()

# Process logs in batches of 100 lines
batch_size = 100
for i in range(0, len(logs), batch_size):
    batch = logs[i:i + batch_size]
    messages = [{"log_data": log.strip()} for log in batch]

    # Publish batch to the GDN stream
    for message in messages:
        PRODUCER.send(json.dumps(message))
        time.sleep(1)
