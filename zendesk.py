import pwd
import requests
import json
import base64

user = "luka.klincarevic@macrometa.com/"

psw = "djq1JAG*gft-vyk5hny"
base_url = "https://d3v-mmtest.zendesk.com"
endpoint = "/api/v2/macros/.json"

payload = {
  "macro": {
    "actions": [
      {
        "field": "status",
        "value": "solved"
      }
    ],
    "id": 25,
    "restriction": {},
    "title": "Roger Wilco"
  }
}
headers = {
    "Content-Type":"application/json", 
    "Accept":"application/json",
    "Authorization" : "Bearer cGvkibed95tFG74TlATTKzrJwGVqctOVeG1dQxcV"
    }

'''ascii_email = email.encode('ascii')
base64_email = base64.b64encode(ascii_email)
ascii_pass = password.encode('ascii')
base64_pass = base64.b64encode(ascii_pass)'''

response = requests.post((base_url + endpoint), data = json.dumps(payload), headers = headers, auth = (user, psw))
print(response.status_code)