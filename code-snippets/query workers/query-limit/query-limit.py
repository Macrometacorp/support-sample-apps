from c8 import C8Client
import math

key = "[api-key]"
client = C8Client(protocol='https', host='gdn.paas.macrometa.io', port=443,
apikey=key)
collection_name = "fulltext_test"

fabric = client._fabric
document_count = fabric.collection(collection_name).count()
iterations = int(math.ceil(document_count / 100))
data = []

for i in range(iterations):
    a = i * 100
    query = "FOR doc IN {} LIMIT {}, {} RETURN doc".format(collection_name, a, 100)
    cursor = fabric.c8ql.execute(query,
    count=True)
    data.append(cursor.batch())

flat_data= [item for sublist in data for item in sublist]