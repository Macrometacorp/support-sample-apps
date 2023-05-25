from c8 import C8Client
import pprint
import time

# Variables - URLs
GLOBAL_URL = "play.paas.macrometa.io"

# Variables - DB
EMAIL = "nemo@nautilus.com"
PASSWORD = "xxxxxx"
GEO_FABRIC = "_system"
COLLECTION_NAME = "address"

# Variables - Query Workers
PARAMETER = {"firstname": "", "lastname": "", "email": "", "zipcode": ""}
INSERT_DATA = {
    "query": {
        "name": "insertRecord",
        "value": f"INSERT {{'firstname':@firstname, 'lastname':@lastname, 'email':@email, 'zipcode':@zipcode, '_key': 'abc'}} IN {COLLECTION_NAME}",
        "parameter": PARAMETER
    }
}
GET_DATA = {
    "query": {
        "name": "getRecords",
        "value": f"FOR doc IN {COLLECTION_NAME} RETURN doc"
    }
}
UPDATE_DATA = {
    "query": {
        "name": "updateRecord",
        "value": f"UPDATE 'abc' WITH {{ \"lastname\": \"cena\" }} IN {COLLECTION_NAME}"
    }
}
DELETE_DATA = {
    "query": {
        "name": "deleteRecord",
        "value": f"REMOVE 'abc' IN {COLLECTION_NAME}"
    }
}
GET_COUNT = {
    "query": {
        "name": "countRecords",
        "value": f"RETURN COUNT(FOR doc IN {COLLECTION_NAME} RETURN 1)"
    }
}

pp = pprint.PrettyPrinter(indent=4)

if __name__ == '__main__':

# Step1: Open connection to GDN. You will be routed to closest region.
    print(f"1. CONNECT: federation: {GLOBAL_URL},  user: {EMAIL}")
    client = C8Client(protocol='https', host=GLOBAL_URL, port=443,
                        email=EMAIL, password=PASSWORD,
                        geofabric=GEO_FABRIC)

    # Step2: Create a collection if not exists
    print(f"2. CREATE_COLLECTION: region: {GLOBAL_URL},  collection: {COLLECTION_NAME}")
    if client.has_collection(COLLECTION_NAME):
        collection = client.collection(COLLECTION_NAME)
    else:
        collection = client.create_collection(COLLECTION_NAME)

    # Step3: Create RestQLs
    print(f"3. CREATE_RESTQLs: region: {GLOBAL_URL}")
    client.create_restql(INSERT_DATA)  # name: insertRecord
    client.create_restql(GET_DATA)  # name: getRecords
    client.create_restql(UPDATE_DATA)  # name: updateRecord
    client.create_restql(DELETE_DATA)  # name: deleteRecord
    client.create_restql(GET_COUNT)  # name: countRecords
    pp.pprint(client.get_restqls())

    time.sleep(5)
    # Step4: Execute Query Workers
    print(f"4. EXECUTE_RESTQLs: region: {GLOBAL_URL}")

    print("\t a. Insert data....")
    response = client.execute_restql(
        "insertRecord", {
            "bindVars": {
                "firstname": "john",
                "lastname": "doe",
                "email": "john.doe@macrometa.io",
                "zipcode": "511037"
            }
        })
    print("\t b. Get data....")
    response = client.execute_restql("getRecords")
    pp.pprint(response['result'])
    print("\t c. Update data....")
    response = client.execute_restql("updateRecord")
    print("\t d. Get data....")
    response = client.execute_restql("getRecords")
    pp.pprint(response['result'])
    print("\t e. Count records....")
    response = client.execute_restql("countRecords")
    pp.pprint(response['result'])
    print("\t f. Delete data....")
    response = client.execute_restql("deleteRecord")

    print(f"5. DELETE_RESTQLs: region: {GLOBAL_URL}")
    client.delete_restql("insertRecord")
    client.delete_restql("getRecords")
    client.delete_restql("updateRecord")
    client.delete_restql("countRecords")
    client.delete_restql("deleteRecord")
