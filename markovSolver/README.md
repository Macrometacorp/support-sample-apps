# Markov Solver App

This Python script uses Flask to create an API for generating a Markov chain graph from an input matrix and initial distribution vector. It also includes endpoints to view and manipulate the resulting node and edge collections.

## Dependencies

- numpy
- json
- requests
- flask

## Usage

Before using this app, you must have a valid API key for [Macrometa](https://www.macrometa.com/) and update the `API_KEY` constant in the code.

1. Start the Flask server by running `python3 <filename>.py` in the terminal.
2. Use the `generate-nodes` endpoint to generate a node collection from an initial state vector. This endpoint receives a PUT request with a JSON payload containing the `matrix` key and the initial state vector.
3. Use the `generate-edges` endpoint to generate an edge collection from an input matrix. This endpoint receives a PUT request with a JSON payload containing the `matrix` key and the input matrix.
4. Use the `get-nodes` and `get-edges` endpoints to view the resulting node and edge collections, respectively.
5. Use the `generate-graph` endpoint to generate the Markov chain graph. This endpoint receives a GET request and returns the URL of the generated graph.
6. Use the `solve-n` endpoint to solve for n steps in the Markov chain. This endpoint receives a PUT request with a JSON payload containing the `n` key and the number of steps to solve for.
