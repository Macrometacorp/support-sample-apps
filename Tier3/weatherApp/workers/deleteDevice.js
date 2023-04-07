// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "../util/serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient()

// Define an async function for deleting a device from the 'devices' collection by its key
// The function takes one parameter: the key of the device to delete
export default async function deleteDevice(key) {
  // Define a C8QL query for removing the device with the given key from the 'devices' collection
  const c8ql = `
        REMOVE @key IN devices
        RETURN OLD
      `;

  // Execute the query using the Macrometa client, passing the key as a parameter
  const result = await client.executeQuery(c8ql, { key: key });

  // Return the result of the query
  return result;
}
