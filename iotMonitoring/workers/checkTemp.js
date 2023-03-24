// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "../util/serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient()

// Define an async function for checking the temperature of a device at a given latitude and longitude
// The function takes two parameters: the latitude and longitude of the device
export default async function checkTemp(lat, long) {
    console.log(lat, long);
    // Define a C8QL query for finding the device closest to the given latitude and longitude, and returning its temperature data
    const c8ql = `
    LET findDevice = (
        FOR loc IN WITHIN (devices, @lat,@long, 100 *1000)
            LIMIT 1
        RETURN loc)[0]
    FOR i IN devicesData
        FILTER i.deviceId == findDevice._key
    RETURN i
    `;

    // Execute the query using the Macrometa client, passing the latitude and longitude as parameters
    const result = await client.executeQuery(c8ql, { lat: lat, long: long });

    // Return the result of the query
    return result;
}