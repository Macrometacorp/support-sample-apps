import random
import time
from datetime import datetime, timedelta
from c8 import C8Client
import math
import json

# List of HTTP methods to choose from
http_methods = ['GET', 'POST', 'PUT', 'DELETE']

# List of URLs to choose from
urls = ['/cgi-bin/try/', 
        '/',
        '/about',
        '/contact',
        '/products',
        '/services',
        '/blog',
        '/news',
        '/events',
        '/faq',
        '/support',
        '/login',
        '/logout',
        '/register',
        '/reset-password',
        '/search',
        '/sitemap',
        '/terms-of-service',
        '/privacy-policy',
        '/404',
        '/500',
        '/admin',
        '/dashboard',
        '/profile']


# Function to generate a random timestamp within a week period
def generate_random_timestamp():
    now = datetime.now()
    delta = timedelta(weeks=1)
    start = now - delta
    seconds_diff = (now - start).total_seconds()
    random_seconds = random.uniform(0, seconds_diff)
    random_timestamp = start + timedelta(seconds=random_seconds)
    return random_timestamp

def generate_log_entry():
    # Generate a random IP address
    ip_address = '{}.{}.{}.{}'.format(*[random.randint(0, 255) for _ in range(4)])

    # Generate a random timestamp within a week period
    timestamp = generate_random_timestamp()

    # Choose a random HTTP method and URL
    http_method = random.choice(http_methods)
    url = random.choice(urls)

    # Generate a random status code
    status_code = random.choice([200, 201, 204, 301, 302, 400, 401, 403, 404, 500])

    # Generate a random response size
    response_size = random.randint(100, 10000)

    # Create the log entry
    log_entry = (timestamp, '{} - - {} "{} {} HTTP/1.0" {} {}\n'.format(ip_address, timestamp.strftime('[%d/%b/%Y:%H:%M:%S %z]'), http_method, url, status_code, response_size))

    return log_entry

# Prompt user for the number of logs to generate
num_logs = int(input('Enter the number of logs to generate (up to 10,000): '))
num_logs = min(num_logs, 10000)

# Generate log entries
log_entries = [generate_log_entry() for _ in range(num_logs)]

# Sort log entries by timestamp in ascending order
log_entries.sort(key=lambda x: x[0])

# Connect to Macrometa Global Data Network
APIKEY = '<APIKEY>'
CLIENT = C8Client(protocol='https', host='api-gdn.paas.macrometa.io', port=443,
                  apikey=APIKEY)
STREAM_NAME = '<STREAM-NAME>'

PRODUCER = CLIENT.create_stream_producer(STREAM_NAME, local=False)

# Batch log entries and publish them on the stream
batch_size = 100
num_batches = math.ceil(len(log_entries) / batch_size)

for i in range(num_batches):
    batch_start = i * batch_size
    batch_end = min(batch_start + batch_size, len(log_entries))
    batch = [entry[1] for entry in log_entries[batch_start:batch_end]]

    data = {
        "payload": batch,
    }

    PRODUCER.send(json.dumps(data))
    time.sleep(1)  # Sleep for 1 seconds between publishing batches
