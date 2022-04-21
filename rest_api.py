import requests
import json

# Constants

FEDERATION = "api-gdn.paas.macrometa.io"
FED_URL = "https://{}".format(FEDERATION)
EMAIL = "luka.klincarevic@macrometa.com"
PASSWORD = "Malfurion123!"
FABRIC = "_system"
COLLECTION_NAME = "testcollection"
AUTH_TOKEN = "bearer "

# Create a HTTPS Session

url = "{}/_open/auth".format(FED_URL)
payload = {
    'email':EMAIL,
    'password':PASSWORD
    }
headers = {
    'content-type': 'application/json'
    }

response = requests.post(url, data = json.dumps(payload), headers = headers)

if response.status_code == 200:
    resp_body = json.loads(response.text)
    AUTH_TOKEN += resp_body["jwt"]
    TENANT = resp_body["tenant"]
else:
    raise Exception("Error while getting auth token. Code:{}, Reason:{}".format(response.status_code,response.reason))


session = requests.session()
session.headers.update({"content-type": 'application/json'})
session.headers.update({"authorization": AUTH_TOKEN})

# Get List of all regions

'''url = FED_URL + "/_api/datacenter/all"
dcl_resp = session.get(url)
dcl_list = json.loads(dcl_resp.text)
regions = []
for dcl in dcl_list:
    dcl_url = dcl['tags']['url']
    regions.append(dcl_url)
print("\nList of Regions: ",regions)

# Create a document collection
# Note :- Create a test collection. Collection type = 2 for documents. Collection type = 3 for edges.

url = FED_URL + "/_api/collection"
payload = {
    "name": COLLECTION_NAME,
    "type": 2
}
resp = session.post(url, data = json.dumps(payload))
resp = json.loads(resp.text)
if "error" in resp.keys():
    print("ERROR: " + resp["errorMessage"])
else:
    print("\nCollection Created: ", resp.text)'''


'''# Insert a document into collection
url = FED_URL + "/_api/document/" + COLLECTION_NAME
for i in range(600):
    payload = {'GPA': 3.5, 'first': 'Lola', 'last': 'Martin'}
    resp = session.post(url, data = json.dumps(payload))
print("\nDocument Inserted: ", resp.text)'''

'''url = FED_URL + "/_api/export/" + COLLECTION_NAME + "?offset=0&limit=2000&order=asc"
resp = session.get(url)

filename = "test.txt"
chunk_size = 100000

with open(filename, 'wb') as fd:
    for chunk in resp.iter_content(chunk_size):
        fd.write(chunk)'''
'''# Data can either be a single document or a list of documents
# Insert multiple documents

url = FED_URL + "/_api/document/" + COLLECTION_NAME
data = [
    {'GPA': 3.2, 'first': 'Abby', 'last': 'Page', '_key': 'Abby'},
    {'GPA': 3.6, 'first': 'John', 'last': 'Kim', '_key': 'John'},
    {'GPA': 4.0, 'first': 'Emma', 'last': 'Park', '_key': 'Emma'}
]
resp = session.post(url, data = json.dumps(data))
print("\nMultiple Documents Inserted: ", resp.text)

# Read a Document with it's Document Id

url = FED_URL + "/_api/document/" + COLLECTION_NAME + "/Lola"
resp = session.get(url)
print("\nDocument with id Lola is: ",resp.text)

# Read multiple Documents

url = FED_URL + "/_api/simple/lookup-by-keys"
payload = {"collection": COLLECTION_NAME,
            "keys": ["Abby", "John", "Emma"] }
resp = session.put(url, data = json.dumps(payload))
resp = json.loads(resp.text)
print("\nDocuments: ", resp["documents"])

# Update a Single Document with it's Id
url = FED_URL + "/_api/document/" + COLLECTION_NAME + "/John"
payload =     {'GPA': 3.6, 'first': 'John', 'last': 'Andrews', '_key': 'John'},

resp = session.patch(url, data = json.dumps(payload))
print("\nUpdated Document with id Lola: ",resp.text)

# Update  Documents
url = FED_URL + "/_api/document/" + COLLECTION_NAME
payload = [
    {'GPA': 4.6, 'first': 'Lola', 'last': 'Martin', '_key': 'Lola'},
    {'GPA': 3.2, 'first': 'Abby', 'last': 'Stutguard', '_key': 'Abby'}
]
resp = session.patch(url, data = json.dumps(payload))
print("\nUpdated Documents: ", resp.text)

# Remove single document with it's Id
url = FED_URL + "/_api/document/" + COLLECTION_NAME + "/John"
resp = session.delete(url)
print("\nDeletd Document with Id John: ", resp.text)


# Remove a multiple document
url = FED_URL + "/_api/document/" + COLLECTION_NAME
payload = [
    {'GPA': 4.6, 'first': 'Lola', 'last': 'Martin', '_key': 'Lola'},
    {'GPA': 3.2, 'first': 'Abby', 'last': 'Stutguard', '_key': 'Abby'}
]
resp = session.delete(url, data = json.dumps(payload))
print("\nDeleted Documents: ", resp.text)'''

start_json = open('/Users/lukaklincarevic/Downloads/Characters.json')
test_json = [{"name" : "George", "id" : 1}, {"name" : "Jack", "id" : 2}]
the_json = json.load(start_json)
imp_json = {
  "data": [{"name" : "John", "id" : "1"}, {"name" : "George", "id" : "1"}],
  "details": False,
  "primaryKey": "id",
  "replace": False
}
url = FED_URL + "/_api/import/" + COLLECTION_NAME
resp = session.post(url, data = json.dumps(imp_json), headers = headers)