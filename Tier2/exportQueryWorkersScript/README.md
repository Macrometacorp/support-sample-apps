# Macrometa RESTQL Exporter

This Node.js script exports the RESTqls from a Macrometa fabric and saves the data to a JSON file. The script uses the JSC8 library to connect to a Macrometa fabric and retrieve the RESTqls.

## Installation

- Clone the repository or download the code files.
- Open a terminal and navigate to the project directory.
- Run npm install to install the required dependencies.

# Usage

- Edit the `FABRIC_NAME`, `URL`, and `API_KEY` variables in the script to match your Macrometa fabric configuration.
- Run the script with the command `node app.js`.
- The script will export the RESTqls from the specified fabric and save them to a JSON file in the data directory.

# Dependencies

- jsc8
- fs
- path
