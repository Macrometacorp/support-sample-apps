# Macrometa Data Export Tool

This Node.js script connects to a Macrometa fabric and exports the collections, indexes, graphs, and RESTqls to JSON files. The script also pulls the data from the collections and exports it to separate JSON files. The script uses the JSC8 library to connect to the fabric and retrieve the data.

## Installation

1. Clone the repository or download the code files.
2. Open a terminal and navigate to the project directory.
3. Run `npm install` to install the required dependencies.

## Usage

1. Edit the `fabricName`, `url`, and `apiKey` variables in the script to match your Macrometa fabric configuration.
2. Run the script with the command `node app.js`.
3. The script will connect to the specified Macrometa fabric and export the collections, indexes, graphs, RESTqls, and data to separate JSON files.

## Configuration

The following variables can be configured in the script:

- `fabricName`: Name of the Macrometa fabric that you want to connect to.
- `url`: The base URL of the Macrometa federation.
- `apiKey`: The API key for the Macrometa fabric.

## Dependencies

- jsc8

## Note

1. All data will be exported to data.json  
   -data.json structure will be: { collectionName:[doc1,doc2,......], collectionName2:[doc1, doc2, ......], . . . }
2. All configurations in config.json.
   -config.json structure will be: { collections:[collection configuration], indexes: [indexes configuration], graphs: [graphs configuration] restqls: [restqls configuration] }

This script aims to create backup files that can be stored on other platforms.
