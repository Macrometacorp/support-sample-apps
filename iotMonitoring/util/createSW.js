// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "./serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient();

// Define an async function for creating a stream app in Macrometa
// The function takes two parameters: the name of the stream app and its definition
export default async function createSW(appName, appDefinition) {
  try {
    // Get all edge locations using the 'getAllEdgeLocations' method of the Macrometa client
    const data = await client.getAllEdgeLocations();

    // Extract the keys of the edge locations from the data array
    const edgeLocations = data.map((obj) => obj._key);

    // Create a stream app using the 'createStreamApp' method of the Macrometa client, passing the edge locations and the app definition as parameters
    await client.createStreamApp(edgeLocations, appDefinition);

    // Activate the stream app using the 'activateStreamApp' method of the Macrometa client, passing the app name and a boolean indicating whether to activate or deactivate the app as parameters
    await client.activateStreamApp(appName, true);
  } catch (error) {
    // If an error occurs, return the error object
    return error;
  }
}