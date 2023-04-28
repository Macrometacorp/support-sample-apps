from c8 import C8Client
import math
import json

APIKEY = 'apikey'
CLIENT = C8Client(protocol='https', host='api-gdn.paas.macrometa.io', port=443,
apikey=APIKEY)
FILE_PATH = 'path-to-file'
STREAM_NAME = 'stream-name'

PRODUCER = CLIENT.create_stream_producer(STREAM_NAME, local=False)

with open(FILE_PATH) as input_file:
    content = input_file.readlines()
    len = len(content)
    for i in range(math.ceil(len/100)):
        try:
            batch = content[i*100:100+i*100]
            data = {
                "payload": batch,
        }
            PRODUCER.send(json.dumps(data))
        except:
            batch = content[i*100:len % 100 + i*100]
            data = {
                "payload": batch,
        }
            PRODUCER.send(json.dumps(data))
