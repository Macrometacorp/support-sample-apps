// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "./serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient();

// Define an async function for creating a collection
export default async function importData(collectionName, data, primary) {
  try {
    // Use the 'createCollection' method of the Macrometa client to create a new collection with the given name and properties
    return await client.importDocuments(collectionName, data, "", primary);
  } catch (error) {
    console.log(error);
    // If an error occurs, return the error object
    return error;
  }
}
