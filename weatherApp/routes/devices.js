import insertDocument from "../util/insertDocument.js";
import publishMsg from "../util/publishMsg.js";
import express from "express";

import findDevice from "../workers/findDevice.js";
import deleteDevice from "../workers/deleteDevice.js";
const deviceRoutes = express.Router();


// Define a POST route for registering a new device
deviceRoutes.post("/register", async (req, res) => {
    try {
        // Extract the device information from the request body
        const data = req.body;

        // Use the 'insertDocument' function to insert the device information into the devices collection
        const response = await insertDocument(process.env.DEVICES_COLLECTION, data);

        // Send a response with a JSON object containing the message returned by the 'insertDocument' function
        res.status(200).json({ message: response });
    } catch (error) {
        // If an error occurs, send a 500 status code and a JSON object containing an error message
        res.status(500).json({
            message: `Error creating device: ${error}`,
        });
    }
    /*
      Devices information example
      {
      "_key": "device1",
      "deviceType": "temperature_sensor",
      "location": [ 37.7749, -122.4194],
      "configuration": {
          "unit": "Celsius",
          "timeBetweenReadings": 5 
          }
      }
  */
});
// Define a POST route for sending device data to a message stream
deviceRoutes.post("/data", async (req, res) => {
    // Extract the data from the request body
    const data = req.body;
    try {
        // Use the 'publishMsg' function to publish the data to the message stream
        const response = await publishMsg(
            process.env.STREAM_NAME, // The name of the message stream to publish to
            true, // Is it local steam
            JSON.stringify(data) // The data to publish, converted to a JSON string
        );

        // Send a response with a JSON object containing the message returned by the 'publishMsg' function
        res.status(200).json({ message: response });
    } catch (error) {
        // If an error occurs, send a 500 status code and a JSON object containing an error message
        res.status(500).json({
            message: `Error publishing message to stream: ${error}`,
        });
    }

    /*
      Data example
      {
      "deviceId": "device1",
      "temperature": 25,
      "unit": "Celsius"
      }
  */
});
// Define a GET route for retrieving information about a specific device
// The device ID is included in the URL path as a parameter
deviceRoutes.get("/:deviceId", async (req, res) => {
    try {
        // Extract the device ID from the URL path parameters
        const { deviceId } = req.params;

        // Use the 'findDevice' function to retrieve information about the device with the given ID
        const response = await findDevice(deviceId)

        // Send a response with a JSON object containing the device information
        res.status(200).json({ message: response })
    } catch (error) {
        // If an error occurs, log it to the console and send a 500 status code
        console.error(error);
        res.sendStatus(500);
    }
});


// Define a DELETE route for removing a device from the system
// The device ID is included in the URL path as a parameter
deviceRoutes.delete("/:deviceId", async (req, res) => {
    try {
        // Extract the device ID from the URL path parameters
        const { deviceId } = req.params;

        // Use the 'deleteDevice' function to remove the device with the given ID from the system
        const response = await deleteDevice(deviceId)

        // Send a response with a JSON object containing the message returned by the 'deleteDevice' function
        res.status(200).json({ message: response })
    } catch (error) {
        // If an error occurs, log it to the console and send a 500 status code
        console.error(error);
        res.sendStatus(500);
    }
});


export { deviceRoutes };
