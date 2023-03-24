// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "./serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient();

// Define an async function for inserting a document into a collection in Macrometa
// The function takes two parameters: the name of the collection and the data to be inserted
export default async function insertDocument(collectionName, data) {
  try {
    // Use the 'insertDocument' method of the Macrometa client to insert the data into the collection
    const result = await client.insertDocument(collectionName, data);
    return result;
  } catch (error) {
    // If an error occurs, log the error message and throw the error object
    console.error(
      `Error inserting document into collection ${collectionName}: ${error.message}`
    );
    throw error;
  }
}
