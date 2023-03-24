// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "./serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient();

// Define an async function for publishing a message to a stream in Macrometa
// The function takes three parameters: the name of the stream, a boolean indicating whether to publish locally or globally, and the data to be published
export default async function publishMsg(streamName, local, data) {
  console.log(data);

  try {
    // Get a stream object using the 'stream' method of the Macrometa client, passing the stream name and the boolean indicating whether to publish locally or globally as parameters
    const stream = client.stream(streamName, local);

    // Use the 'publishMessage' method of the stream object to publish the data to the stream
    const result = await stream.publishMessage(data);
    return result;
  } catch (error) {
    // If an error occurs, log the error message and throw the error object
    console.error(
      `Error inserting document into stream ${streamName}: ${error.message}`
    );
    throw error;
  }
}
