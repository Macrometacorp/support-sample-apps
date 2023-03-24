# Distributed IoT Device Management System

## Overview

This is an IoT device management system built on a distributed GDN network with
real-time updates using Macrometa collections, queries, stream workers, GeoJson,
and streams. The app leverages Macrometa Query workers, Stream Workers,
Search/View, collections, Streams, and SDK to create, delete, and retrieve
devices, and send device data to message streams.

The app has the following collections:

- devicesData
- devices

## Endpoints

1. **Create new Device** (Method: POST, Path: /devices/register) - This endpoint
   creates a new device in the system, including details such as device type,
   location, and configuration.

2. **Send Device Data** (Method: POST, Path: /devices/data) - This endpoint
   sends device data to a message stream, including details such as device ID,
   temperature, and unit.

3. **Get Device Information** (Method: GET, Path: /devices/:deviceId) - This
   endpoint retrieves information about a specific device using the deviceId.

4. **Remove Device** (Method: DELETE, Path: /devices/:deviceId) - This endpoint
   removes a device from the system using the deviceId.

5. **Search for City Temperature** (Method: POST, Path: /search) - This endpoint
   is used for searching the temperature of a city, using the city name as a
   request body parameter.

## Running the app

To run the app, follow these steps:

- Clone the repository to your local machine.
- Install dependencies by running npm install.
- Set up the required environment variables in the .env file.
- Start the app by running npm start.
- The app will be running on http://localhost:3000.

## Dependencies

The app uses the following dependencies:

- Express
- Body-parser
- Dotenv
- EJS
- jsc8
- node-geocoder
- path

## Workers

The app uses the following workers:

- IoTdata
- findDevice
- deleteDevice
- checkTemp
- Other Files

## The app uses the following additional files:

- createCollections.js - Used to create collections.
- createSW.js - Used to create stream workers.
- getCityLocation.js - Used to retrieve the latitude and longitude of a city.
- insertDocument.js - Used to insert device information into the devices
  collection.
- publishMsg.js - Used to publish device data to a message stream.
