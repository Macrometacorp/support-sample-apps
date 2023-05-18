const jsc8 = require("jsc8");

// User configuration
const FABRIC_NAME = "_system"; // Name of the Macrometa fabric
const BASE_URL = "https://play.macrometa.io/"; // Base URL of the Macrometa federation
const API_KEY = ""; // API key for the Macrometa fabric

// Connect to the Macrometa fabric
function connectToFabric(url) {
  return new jsc8({
    url,
    apiKey: API_KEY,
    fabricName: FABRIC_NAME,
  });
}

// Get the version of the Macrometa fabric
async function getFabricVersion(client) {
  try {
    const response = await client.version(true);
    return response.version;
  } catch (e) {
    console.log(`Error getting fabric version: ${e.message}`);
    return "Unknown";
  }
}

// Main function
async function run() {
  // Connect to the Macrometa fabric and get the local edge location
  let url = BASE_URL;
  let client = connectToFabric(url);
  const localLocation = await client.getLocalEdgeLocation();
  let place = localLocation.locationInfo.city;
  console.log(`${url} - ${place} - ${await getFabricVersion(client)}`);

  // Get all edge locations and iterate over them
  const locations = await client.getAllEdgeLocations();
  for (const location of locations) {
    try {
      // Connect to the Macrometa fabric for each edge location
      url = `https://${location.tags.url}`;
      client = connectToFabric(url);
      place = location.locationInfo.city;
      console.log(`${url} - ${place} - ${await getFabricVersion(client)}`);
    } catch (e) {
      console.log(`There was a problem accessing ${url}: ${e.message}`);
    }
  }
}

// Run the main function
run();
