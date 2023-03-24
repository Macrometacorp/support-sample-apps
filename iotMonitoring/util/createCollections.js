// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "./serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient();

// Define an async function for creating a collection
// The function takes two parameters: the name of the collection to create, and an optional object containing collection properties
export default async function createCollection(name, properties) {
  try {
    // Use the 'createCollection' method of the Macrometa client to create a new collection with the given name and properties
    return await client.createCollection(name, properties);
  } catch (error) {
    // If an error occurs, return the error object
    return error;
  }
}
