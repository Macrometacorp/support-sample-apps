# Macrometa Fabric Version Checker

This Node.js script connects to a Macrometa fabric and retrieves the version information for each edge location. The script uses the JSC8 library to connect to the fabric and retrieve the version information.

## Installation

1. Clone the repository or download the code files.
2. Open a terminal and navigate to the project directory.
3. Run `npm install` to install the required dependencies.

## Usage

1. Edit the `FABRIC_NAME`, `BASE_URL`, and `API_KEY` variables in the script to match your Macrometa fabric configuration.
2. Run the script with the command `npm start`.
3. The script will connect to the specified Macrometa fabric and retrieve the version information for each edge location.

## Configuration

The following variables can be configured in the script:

- `FABRIC_NAME`: Name of the Macrometa fabric that you want to connect to.
- `BASE_URL`: The base URL of the Macrometa federation.
- `API_KEY`: The API key for the Macrometa fabric.

## Dependencies

- jsc8
