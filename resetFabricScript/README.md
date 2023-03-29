# Macrometa DB Reset Script

This project provides a simple script to reset a Macrometa fabric environment by
deleting all collections, query workers, streams, stream workers, views, and
graphs.

## Getting Started

Follow the instructions below to run the script and reset your Macrometa fabric.

## Prerequisites

- Node.js >= 12.x
- Installing Dependencies
- Clone the repository.
- Navigate to the project directory.
- Run `npm install` to install the required dependencies.

# Configuration

- Create a .env file in the project root directory.
- Add the following environment variables:

```
URL=<YOUR_JSC8_URL>
API_KEY=<YOUR_API_KEY>
FABRIC=<YOUR_FABRIC_NAME>
```

# Running the Script

1. In the project directory, run `node index.js`.
2. The script will execute in the following order:
   - Delete all collections.
   - Delete all RESTqls.
   - Delete all streams.
   - Delete all stream workers.
   - Delete all views.
   - Delete all graphs.
3. After each deletion step, you will see a corresponding message in the
   console, indicating whether the operation was successful or if there was an
   error.

# Usage

This script is useful when you need to reset your Macrometa fabric to its
initial state, especially during development, testing, or troubleshooting. It
helps you quickly remove all existing data structures and start fresh.

# Important Note

Please use this script with caution, as it will delete all your collections,
query workers, streams, stream workers, views, and graphs from the specified
Macrometa fabric. Make sure to backup any important data before running the
script.
