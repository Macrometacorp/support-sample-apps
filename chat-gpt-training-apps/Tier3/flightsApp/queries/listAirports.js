// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "../util/serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient();

export default async function listAirports() {
  const c8ql = `For i in airports 
    RETURN i`;

  const result = await client.executeQuery(c8ql);
  return result;
}
