from c8 import C8Client

email = "luka.klincarevic@macrometa.com"
password = "Malfurion123!"
copy_fabric = "_system"
paste_fabric = "test"
copy_collection = "fulltext_test"
paste_collection = "test"
host = 'gdn.paas.macrometa.io'

copy_client = C8Client(protocol = 'https', host = host, port = 443,
                    email = email, password = password,
                    geofabric = copy_fabric) 
paste_client = C8Client(protocol = 'https', host = host, port = 443,
                    email = email, password = password,
                    geofabric = paste_fabric)

# Fetch all the documents.

fabric = copy_client._fabric

query = "LET a = (FOR doc IN {} RETURN doc) RETURN a".format(copy_collection)
cursor = fabric.c8ql.execute(query,
count=True)
data = cursor.batch()

# Remove the "_rev" attribute from every document, otherwise the paste will not work.

clean_data = []
for i in data:
    for j in i:
        j.pop("_rev")
        clean_data.append(j)
print(clean_data)

# Create a paste collection if missing, then insert all the extracted documents.

if paste_client.has_collection(paste_collection):
	paste_client.insert_document(collection_name = paste_collection, document = clean_data)
else:
	paste_client.create_collection(paste_collection)
	paste_client.insert_document(collection_name = paste_collection, document = clean_data)

# Fetch and copy all the indexes
indexes = copy_client.list_collection_indexes(copy_collection)
print(indexes)

for i in indexes:
    if i['type'] == "persistent":
        paste_client.add_persistent_index(collection_name = paste_collection, fields = i["fields"], sparse = i["sparse"], unique = i["unique"])
    if i['type'] == "fulltext":
        paste_client.add_fulltext_index(collection_name = paste_collection, fields = i["fields"], min_length = i["min_length"])
    if i['type'] == "geo":
        paste_client.add_geo_index(collection_name = paste_collection, fields = i["fields"], ordered = i["geo_json"])
    if i['type'] == "ttl":
        paste_client.add_ttl_index(collection_name = paste_collection, fields = i["fields"], expireAfter = i["expireAfter"], inBackground = True)