from c8 import C8Client
import threading
import pprint
import time

URL = "play.paas.macrometa.io"
GEO_FABRIC = "_system"
API_KEY = "my API key" # Change this to your API key

COLLECTION_NAME = "ddos"

# Variables
data = [
    {"ip": "10.1.1.1", "action": "block", "rule": "blocklistA"},
    {"ip": "20.1.1.2", "action": "block", "rule": "blocklistA"},
    {"ip": "30.1.1.3", "action": "block", "rule": "blocklistB"},
    {"ip": "40.1.1.4", "action": "block", "rule": "blocklistA"},
    {"ip": "50.1.1.5", "action": "block", "rule": "blocklistB"},
]

pp = pprint.PrettyPrinter(indent=4)

if __name__ == '__main__':

    # Open connection to GDN. You will be routed to closest region.
    print(f"\n1. CONNECT: Server: {URL}")
    client = C8Client(protocol='https', host=URL, port=443, apikey=API_KEY, geofabric=GEO_FABRIC)

    # Create a collection if one does not exist
    print(f"\n2. CREATE_COLLECTION: Server: {URL},  Collection: {COLLECTION_NAME}")
    if client.has_collection(COLLECTION_NAME):
        collection = client.collection(COLLECTION_NAME)
    else:
        collection = client.create_collection(COLLECTION_NAME, stream=True)

    # Subscribe to receive real-time updates when changes are made to the collection.
    def create_callback():
        def callback_fn(event):
            pp.pprint(event)
            return

        client.on_change(COLLECTION_NAME, callback=callback_fn, timeout=15)

    print(f"\n3. SUBSCRIBE_COLLECTION: Server: {URL},  Collection: {COLLECTION_NAME}")
    rt_thread = threading.Thread(target=create_callback)
    rt_thread.start()
    time.sleep(10)
    print(f"Callback registered for collection: {COLLECTION_NAME}")

    # Insert documents into the collection to trigger a notification.
    print(f"\n4. INSERT_DOCUMENTS: Server: {URL},  Collection: {COLLECTION_NAME}")
    client.insert_document(COLLECTION_NAME, document=data)

    # Wait to close the callback.
    print("\n5. Waiting to close callback")
    rt_thread.join(2)

    # Delete collection.
    print(f"\n6. DELETE_COLLECTION: Server: {URL}, Collection: {COLLECTION_NAME}")
    client.delete_collection(COLLECTION_NAME)