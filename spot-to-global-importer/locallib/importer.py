import requests
from locallib.logger import SystemLogger


class Importer(SystemLogger):
    def __init__(self, host,internalc8db, port, username, password, collection, fabric, new_tenant,protocol="https"):
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
            f"/_fabric/{self._fabric}/_api/replication/restore-data?collection={self._collection}")

        self._jwt_access_token = None
        self.batch_count = 0

        SystemLogger.__init__(self, name="Importer", debug_enabled=True)

    def create_endpoint_url(self, path):
        api_prefix = ''   # must be empty for internal c8db export calls 
        if self._internalc8db is False :
            api_prefix='api-'

        if self._port == 'None' :
            return self._protocol + "://" + api_prefix + self._host + path
        else:
            return self._protocol + "://" + api_prefix + self._host + ":" + self._port + path

    def is_authenticated(self):
        return self._jwt_access_token != None

    def authenticate(self):
        self.info("Start authentication.")

        url = self.create_endpoint_url("/_open/auth")
        data = {"email": self._username,
                "password": self._password}

        self.info("authentication url ---> " + url)
        response = requests.post(url, json=data, headers=self._headers)
        if response.status_code != 200:
            raise Exception("Cannot authenticate!")

        json_response = response.json()
        self._jwt_access_token = json_response.get("jwt", "")
        if self._jwt_access_token == "":
            raise Exception("JWT token is malformed.")

        self._headers['Authorization'] = "bearer " + \
            json_response.get("jwt", "")

        self.info("Authentication complete successfully.")

    def import_data(self, data):
        if not self.is_authenticated():
            self.authenticate()
        self.info('url for import data ---> ' + self._data_url)
        response = requests.put(
            self._data_url, data=data, headers=self._headers)
        json_response = response.json()
        if response.status_code != 200:
            self.debug(response.text)
            input("Import issue, wait for user input to continue (press enter)")
            # input() waits for a user input
            print("Continue import now!")
            #raise Exception(response.text)
        else:
            self.batch_count = self.batch_count + 1
            self.info('imported batches so far  ---> ' + str(self.batch_count))
