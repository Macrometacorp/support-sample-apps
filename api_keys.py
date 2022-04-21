from c8 import C8Client
import json
import base64
import six

# Create a connection to gdn
client = C8Client(protocol='https', host='beta.eng.macrometa.io/', port=443,
                        email='luka.klincarevic@macrometa.com', password='sOaxU@a48sAPe')

# Create an api key
#print("Create API Key: ", client.create_api_key('id1'))
'''# Fetch List of accessible databases and streams
print("Accessible Databases: ", client.list_accessible_databases('id1'))

print("Accessible Streams of a db: ", client.list_accessible_streams('id1', '_system'))'''

# Remove api key
'''remove = client.remove_api_key('id1')'''
# Create a new collection if it does not exist
'''collection = 'testcollection429'
document = [
    { "name": "Robert", "surname": "Baratheon", "alive": False, "traits": ["A","H","C"] },
    { "name": "Jaime", "surname": "Lannister", "alive": True, "age": 36, "traits": ["A","F","B"] },
    { "name": "Catelyn", "surname": "Stark", "alive": False, "age": 40, "traits": ["D","H","C"] },
    { "name": "Cersei", "surname": "Lannister", "alive": True, "age": 36, "traits": ["H","E","F"] },
    { "name": "Daenerys", "surname": "Targaryen", "alive": True, "age": 16, "traits": ["D","H","C"] },
    { "name": "Jorah", "surname": "Mormont", "alive": False, "traits": ["A","B","C","F"] },
    { "name": "Petyr", "surname": "Baelish", "alive": False, "traits": ["E","G","F"] },
    { "name": "Viserys", "surname": "Targaryen", "alive": False, "traits": ["O","L","N"] },
    { "name": "Jon", "surname": "Snow", "alive": True, "age": 16, "traits": ["A","B","C","F"] },
    { "name": "Sansa", "surname": "Stark", "alive": True, "age": 13, "traits": ["D","I","J"] },
    { "name": "Arya", "surname": "Stark", "alive": True, "age": 11, "traits": ["C","K","L"] },
    { "name": "Robb", "surname": "Stark", "alive": False, "traits": ["A","B","C","K"] },
    { "name": "Theon", "surname": "Greyjoy", "alive": True, "age": 16, "traits": ["E","R","K"] },
    { "name": "Bran", "surname": "Stark", "alive": True, "age": 10, "traits": ["L","J"] },
    { "name": "Joffrey", "surname": "Baratheon", "alive": False, "age": 19, "traits": ["I","L","O"] },
    { "name": "Sandor", "surname": "Clegane", "alive": True, "traits": ["A","P","K","F"] },
    { "name": "Tyrion", "surname": "Lannister", "alive": True, "age": 32, "traits": ["F","K","M","N"] },
    { "name": "Khal", "surname": "Drogo", "alive": False, "traits": ["A","C","O","P"] },
    { "name": "Tywin", "surname": "Lannister", "alive": False, "traits": ["O","M","H","F"] },
    { "name": "Davos", "surname": "Seaworth", "alive": True, "age": 49, "traits": ["C","K","P","F"] },
    { "name": "Samwell", "surname": "Tarly", "alive": True, "age": 17, "traits": ["C","L","I"] },
    { "name": "Stannis", "surname": "Baratheon", "alive": False, "traits": ["H","O","P","M"] },
    { "name": "Melisandre", "alive": True, "traits": ["G","E","H"] },
    { "name": "Margaery", "surname": "Tyrell", "alive": False, "traits": ["M","D","B"] },
    { "name": "Jeor", "surname": "Mormont", "alive": False, "traits": ["C","H","M","P"] },
    { "name": "Bronn", "alive": True, "traits": ["K","E","C"] },
    { "name": "Varys", "alive": True, "traits": ["M","F","N","E"] },
    { "name": "Shae", "alive": False, "traits": ["M","D","G"] },
    { "name": "Talisa", "surname": "Maegyr", "alive": False, "traits": ["D","C","B"] },
    { "name": "Gendry", "alive": False, "traits": ["K","C","A"] },
    { "name": "Ygritte", "alive": False, "traits": ["A","P","K"] },
    { "name": "Tormund", "surname": "Giantsbane", "alive": True, "traits": ["C","P","A","I"] },
    { "name": "Gilly", "alive": True, "traits": ["L","J"] },
    { "name": "Brienne", "surname": "Tarth", "alive": True, "age": 32, "traits": ["P","C","A","K"] },
    { "name": "Ramsay", "surname": "Bolton", "alive": True, "traits": ["E","O","G","A"] },
    { "name": "Ellaria", "surname": "Sand", "alive": True, "traits": ["P","O","A","E"] },
    { "name": "Daario", "surname": "Naharis", "alive": True, "traits": ["K","P","A"] },
    { "name": "Missandei", "alive": True, "traits": ["D","L","C","M"] },
    { "name": "Tommen", "surname": "Baratheon", "alive": True, "traits": ["I","L","B"] },
    { "name": "Jaqen", "surname": "H'ghar", "alive": True, "traits": ["H","F","K"] },
    { "name": "Roose", "surname": "Bolton", "alive": True, "traits": ["H","E","F","A"] },
    { "name": "The High Sparrow", "alive": True, "traits": ["H","M","F","O"] }
]
for i in range(2100):
    client.insert_document(collection_name=collection, document={i:i})'''
# Create a new stream
#print(client.create_stream('demostream'))
producer = client.create_stream_producer("demostream", local=False)

for i in range(10):
      msg1 = "Persistent: Hello from " + "("+ str(i) +")"
      data = {
        "payload" : base64.b64encode(six.b(msg1)).decode("utf-8")
      }
      producer.send(json.dumps(data))
subscriber = client.subscribe(stream="demostream", local=False, subscription_name="test-subscription-1")
for i in range(10):
    print("In ",i)
    m1 = json.loads(subscriber.recv())  #Listen on stream for any receiving msg's
    msg1 = base64.b64decode(m1["payload"])
    print("Received message '{}' id='{}'".format(msg1, m1["messageId"])) #Print the received msg over stream
    subscriber.send(json.dumps({'messageId': m1['messageId']}))#Acknowledge the received msg.