// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "../util/serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient()

// Define an async function for finding a device in the 'devices' collection by its key
// The function takes one parameter: the key of the device to find
export default async function findDevice(id) {
  // Define a C8QL query for finding the device with the given key from the 'devices' collection
  const c8ql = `
      FOR i IN devices
      FILTER i._key == @id
      RETURN i
      `;

  // Execute the query using the Macrometa client, passing the key as a parameter
  const result = await client.executeQuery(c8ql, {
    id: id,
  });

  // Return the result of the query
  return result;
}