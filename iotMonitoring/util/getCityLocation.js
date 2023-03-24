// Import the 'NodeGeocoder' module
import NodeGeocoder from "node-geocoder";

// Set the geocoding options
const options = {
  provider: "openstreetmap",
};

// Initialize the geocoder using the options
const geocoder = NodeGeocoder(options);

// Define an async function for getting the location of a city by its name
// The function takes one parameter: the name of the city
export default async function getCityLocation(cityName) {
  try {
    // Use the 'geocode' method of the geocoder to get the latitude and longitude of the city
    const results = await geocoder.geocode(cityName);

    // If results are found, extract the latitude and longitude from the first result and return them as an object
    if (results && results.length > 0) {
      const location = {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      };
      console.log(`Location of ${cityName}:`, location);
      return location;
    } else {
      // If no results are found, log a message and return null
      console.log(`No results found for ${cityName}`);
      return null;
    }
  } catch (error) {
    // If an error occurs, log the error and return null
    console.error("Error:", error);
    return null;
  }
}