import requests
import time
from locallib.logger import SystemLogger
import json

class Exporter(SystemLogger):
    def __init__(self, host, internalc8db, port, username, password, fabric, new_tenant,collection, protocol="https", chunk_size=50 * 1024 * 1024):
        self._host = str(host)
        self._internalc8db = internalc8db
        self._port = str(port)
        self._username = username
        self._password = password
        self._collection = collection
        self._new_tenant = new_tenant
        self._fabric = fabric
        if self._new_tenant is not None:
            self._fabric = self._new_tenant + "." + fabric
        self._protocol = str(protocol)
        self._headers = {'Accept': 'application/json',
                         "Content-Type": "application/json"}

        self._data_url = self.create_endpoint_url(
            f"/_fabric/{self._fabric}/_api/replication/dump")

        self._jwt_access_token = None
        self._batch_id = None
        self._batch_expiration = None
        self._batch_ttl = 1200
        self.has_more = None
        self._chunk_size = chunk_size

        SystemLogger.__init__(self, name="Exporter", debug_enabled=True)

    def create_endpoint_url(self, path):
        api_prefix = ''   # must be empty for internal c8db export calls 
        if self._internalc8db is False :
            api_prefix='api-'

        if self._port == 'None' :
            return self._protocol + "://" + api_prefix + self._host + path
        else:
            return self._protocol + "://" + api_prefix + self._host + ":" + self._port + path

    def authenticate(self):
        self.info("Start authentication.")
        #create endpoint url
        url = self.create_endpoint_url("/_open/auth")

        data = {"email": self._username,
                "password": self._password}

        self.info("URL --> " + url)
        response = requests.post(url, json=data, headers=self._headers)
        self.info(response.status_code)
        if response.status_code != 200:
            raise Exception("Cannot authenticate!")

         
        json_response = response.json()
        response_string = json.dumps(json_response)
        self.info("response : " + response_string)
        self._jwt_access_token = json_response.get("jwt", "")
        if self._jwt_access_token == "":
            raise Exception("JWT token is malformed.")

        print(self._jwt_access_token )
        self._headers['Authorization'] = "bearer " + \
            json_response.get("jwt", "")

        self.info("Authentication complete successfully.")

    def is_authenticated(self):
        return self._jwt_access_token != None

    def create_batch(self):
        if not self.is_authenticated():
            self.authenticate()

        self.info("Start create batch.")

        url = self.create_endpoint_url("/_api/replication/batch")
        data = {"ttl": self._batch_ttl}
        try:
            response = requests.post(url, json=data, headers=self._headers)
        except Exception as e:
            self.info("Failed to create batch - " + str(e))

        self.info("create_batch url : " + url)
        self.info(response.status_code)
        
        if response.status_code != 200:
            raise Exception("Cannot create batch!")

        json_response = response.json()
        self._batch_id = json_response.get("id", "")
        if self._batch_id == "":
            raise Exception("Batch Id is malformed.")

        self._batch_expiration = time.time() + self._batch_ttl
        self.info("Create batch complete successfully.")
        self.info("Batch ID:" + self._batch_id)

    def is_batch_created(self):
        return self._batch_id != None

    def is_batch_expire(self):
        return self._batch_id != None

    def extend_batch(self):
        if not self.is_authenticated():
            self.authenticate()
        if not self.is_batch_created():
            raise Exception("Batch is not created!")

        if self._batch_expiration - time.time() > self._batch_ttl/2:
            return

        self.debug("Start extend batch.")
        data = {"ttl": self._batch_ttl}
        url = self.create_endpoint_url(
            "/_api/replication/batch/" + self._batch_id)
        response = requests.put(url, json=data, headers=self._headers)
        if response.status_code != 204:
            raise Exception("Cannot extend batch!")

        self._batch_expiration = time.time() + self._batch_ttl
        self.debug("Extend batch complete successfully.")
        self.debug("Batch ID:" + self._batch_id)

    def delete_batch(self):
        if not self.is_authenticated():
            self.authenticate()
        if not self.is_batch_created():
            raise Exception("Batch is not created!")

        self.info("Start delete batch.")

        url = self.create_endpoint_url(
            "/_api/replication/batch/" + self._batch_id)
        response = requests.delete(url, headers=self._headers)
        if response.status_code != 204:
            raise Exception("Cannot delete batch!")

        self.info("Delete batch complete successfully.")
        self.info("Deleted Batch ID:" + self._batch_id)
        self._batch_id = None

    def get_has_more(self, headers):
        has_more = headers.get("X-Arango-Replication-Checkmore", False)
        if has_more == "true":
            return True
        return False

    def get_last_included(self, headers):
        last_included = headers.get("X-Arango-Replication-Lastincluded", 0)
        return int(last_included)

    def get_data(self):
        if not self.is_authenticated():
            self.authenticate()
        if not self.is_batch_created():
            self.create_batch()

        self.extend_batch()

        payload = {"collection": self._collection,
                   "chunkSize": self._chunk_size,
                   "batchId": self._batch_id}
        self.info("data import url : " + self._data_url)
        response = requests.get(
            self._data_url, params=payload, headers=self._headers)
        if response.status_code == 200:
            has_more = self.get_has_more(response.headers)
            last_included = self.get_last_included(response.headers)
            return (response.text, has_more, last_included)
        elif response.status_code == 204:
            return ("", False, 0)
        else:
            raise Exception(
                f"Cannot get data! Response Code: {response.status_code} response body: {response.json()})"
            )
