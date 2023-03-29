# Earthquake Warning System

This is a project for an earthquake warning system. It uses Macrometa's
collections, streams, query workers, stream workers and GEO json.

## Prerequisites

Node.js installed on your machine Macrometa account

## Getting Started

Clone the repository and navigate to the project directory.

Install the dependencies using the command:

```bash
npm install
```

Create a .env file in the project directory and set the following variables:

```env
URL = https://play.paas.macrometa.io
API_KEY = <your-APIkey>
FABRIC = _system
EMAIL = <your-email>
PASSWORD = <your-password>
PORT=3000
STREAM_NAME=<your-stream-name>
DATA_COLLECTION=<your-data-collection-name>
USERS_COLLECTION=<your-users-collection-name>
SW_NAME=<your-sw-name>
QUERY_NAME=<your-query-name>
```

## Start the server using the command:

`node index.js`

## Functionality

The server listens for POST requests to /data and /user endpoints.

The /data endpoint expects JSON data containing information about the
earthquake. This data is published to a message stream using the publishMsg
function.

The /user endpoint expects JSON data containing information about the user's
location. This data is inserted into a collection using the insertDocument
function.

A consumer is created using the createConusmer function. This consumer reads
data from the message stream and executes a query to find users who are near the
earthquake location. An email is sent to these users using the sendEmail
function.

```
User data example:
{
  "address": "1234 Main St, San Francisco, CA 94102",
  "email": "ljubisav@example.com",
  "location": [
    37.6749,
    -122.4194
  ],
  "name": "Luba",
  "userId": "user001"
}

Sensore data example:
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "depth": 10,
  "magnitude": 5.5,
  "sensorId": "sensor001",
  "sensorType": "seismograph",
  "deviceId": "device001",
  "deviceType": "IoT device"
}

```
