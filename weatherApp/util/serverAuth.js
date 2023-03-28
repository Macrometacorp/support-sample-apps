// Import the necessary modules
import { C8Client } from "jsc8";
import * as dotenv from "dotenv";

// Load environment variables from the '.env' file
dotenv.config();

// Define a function for creating a new Macrometa client instance
// The function takes no parameters
export default function getClient() {
  // Create a new instance of the 'C8Client' class from the 'jsc8' module, passing the required configuration options as parameters
  const client = new C8Client({
    url: process.env.URL,
    apiKey: process.env.API_KEY,
    fabricName: process.env.FABRIC,
  });

  // Return the new client instance
  return client;
}