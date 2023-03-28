import numpy as np
import json
import requests
from flask import Flask, request

app = Flask(__name__)

# Constants
URL = "api-play.paas.macrometa.io"
HTTP_URL = f"https://{URL}"
GEO_FABRIC = "_system"
API_KEY = "TDY8Vx8NMS4mNrbhdZ77J-w.asd.k5T9VmQeSCmi3wGZh5MSQALn7PRBdTBju2sxR3zahu6q6XLlJcWvDltQg1w8jXWp591e33"  # Change to your API key

NODES_COLLECTION = "markov_nodes"
EDGES_COLLECTION = 'markov_edges'
GRAPH_NAME = 'markov_chain'

INITIAL_STATE = np.array([0.4,0.6]) # The initial distribution vector <- placeholder variable
INPUT_MATRIX = np.array([[0.5,0.5], [1,0]]) # Input MATRIX that will generate a graph <- placeholder variable

# Create a HTTPS Session
session = requests.session()
session.headers.update({"content-type": 'application/json'})
session.headers.update({"authorization": "apikey " + API_KEY})

# Create a node collection
url = f"{HTTP_URL}/_fabric/{GEO_FABRIC}/_api/collection"
payload = {'name': NODES_COLLECTION}
resp = session.post(url, data=json.dumps(payload))
result = json.loads(resp.text)

# Create an edge collection
payload = {'name': EDGES_COLLECTION, "type": 3}
url = f"{HTTP_URL}/_fabric/{GEO_FABRIC}/_api/collection"
session.post(url, data=json.dumps(payload))

# Endpoint to generate a node collection from the initial state vector
@app.route('/generate-nodes', methods=['PUT'])
def generate_nodes():
    url = f"{HTTP_URL}/_api/document/{NODES_COLLECTION}/truncate"
    session.put(url)
    input_json = request.get_json(force=True)
    INITIAL_STATE = np.array(input_json['matrix'])
    # Validate the input
    if any([type(i) is not np.float64 for i in INITIAL_STATE]):
        raise TypeError("Initial state entries must be numbers.")
    if any([i< 0 for i in INITIAL_STATE]):
        raise ValueError('Incorrect initial state values. Be sure that each element is non-negative.')
    for i,j in enumerate(INITIAL_STATE):
        payload = {
            '_key': f'node_{i + 1}',
            'value': j
            }
        url = f"{HTTP_URL}/_api/document/{NODES_COLLECTION}"
        session.post(url, data=json.dumps(payload))
    return "Nodes added successfully"

# Endpoint to generate an edge collection from input matrix
@app.route('/generate-edges', methods=['PUT'])
def generate_edges():
    url = f"{HTTP_URL}/_api/document/{EDGES_COLLECTION}/truncate"
    session.put(url)
    input_json = request.get_json(force=True)
    INPUT_MATRIX = np.array(input_json['matrix'])
    # Validate the input
    if any([len(row) > len(INPUT_MATRIX[0]) for row in INPUT_MATRIX]):
        raise ValueError('Not a square MATRIX.')
    for row in INPUT_MATRIX:
        if sum(row) != 1 or any([i > 1 for i in row]) or any([i < 0 for i in row]):
            raise ValueError('Not a stochastic MATRIX. Be sure that each entry is less than 1 and greater than 0, and that each row sums up to exactly 1.')
        if any([type(i) is not np.float64 for i in row]):
            raise TypeError("MATRIX entries must be numbers.")
    for column, row in enumerate(INPUT_MATRIX):
        for i, j in enumerate(row):
            payload = {
                '_key': f'node_{column + 1}-node_{i+1}',
                '_from': f'{NODES_COLLECTION}/node_{column+i}',
                '_to': f'{NODES_COLLECTION}/node_{i+1}',
                'weight': j
                }
            url = f"{HTTP_URL}/_api/document/{EDGES_COLLECTION}"
            session.post(url, data=json.dumps(payload))
    return "Edges added successfully"

# Endpoint to list the nodes
@app.route('/get-nodes', methods=['GET'])
def get_nodes():
    query = {
  "query": f"for u in {NODES_COLLECTION} return u"
    }

    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    return result.text

# Endpoint to list the edges
@app.route('/get-edges', methods=['GET'])
def get_edges():
    query = {
  "query": f"for u in {EDGES_COLLECTION} return u"
    }
    url = f"{HTTP_URL}/_api/cursor"
    result = session.post(url, data = json.dumps(query))
    return result.text

# Endpoint to generate a graph
@app.route('/generate-graph', methods=['GET'])
def generate_graph():
    url = f"{HTTP_URL}/_api/graph/{GRAPH_NAME}"
    session.delete(url, params = {"dropCollections": False})
    payload = {
    "edgeDefinitions": [
        {
            "collection": EDGES_COLLECTION,
            "from": [NODES_COLLECTION],
            "to": [NODES_COLLECTION]
        }
    ],
    "name": GRAPH_NAME,
    "options": {}
    }
    url = f"{HTTP_URL}/_api/graph"
    session.post(url, data=json.dumps(payload))
    return "https://play.paas.macrometa.io/graphs/markov_chain"

# Endpoint to solve for n steps
@app.route('/solve-n', methods=['PUT'])
def solve_n():
    new_matrix = INPUT_MATRIX
    n_steps = request.get_json(force=True)['n']
    for i in range(n_steps):
        new_matrix = np.matmul(new_matrix, new_matrix)
    final_state = np.matmul(INITIAL_STATE, new_matrix)
    return list(final_state)

if __name__ == '__main__':
    app.run(debug=True)
