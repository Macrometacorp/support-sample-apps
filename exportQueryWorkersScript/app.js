// Import required modules
const jsc8 = require("jsc8");
const fs = require("fs");
const path = require("path");

// User configuration
const FABRIC_NAME = "_system"; // Name of fabric that you want to export
const URL = "https://play.macrometa.io"; //Federation url
const API_KEY = ""; //API key of fabric that you want to export

// Create JSC8 client
const client = new jsc8({
  url: URL,
  apiKey: API_KEY,
  fabricName: FABRIC_NAME
});

// Export RESTqls
async function cloneRestqls() {
  try {
    const listOfCreatedRestql = await client.getRestqls();
    console.log("All RESTqls are exported");
    return listOfCreatedRestql.result;
  } catch (e) {
    console.error("Error exporting RESTqls:", e.message);
    return [];
  }
}

// Save data to a JSON file
async function saveDataToFile(filename, data) {
  const dir = path.join(".", "data");

  try {
    // Create the data directory if it does not exist
    await fs.promises.mkdir(dir, { recursive: true });

    // Write the data to a JSON file
    await fs.promises.writeFile(
      path.join(dir, `${filename}.json`),
      JSON.stringify(data, null, 2)
    );

    console.log(`The "${filename}" file has been saved!`);
  } catch (e) {
    console.error(`Error saving "${filename}" file:`, e.message);
  }
}

// Main function
async function main() {
  try {
    // Export RESTqls and save to a JSON file
    const restqls = await cloneRestqls();
    await saveDataToFile("config", { restql: restqls });
  } catch (e) {
    console.error("Error exporting data:", e.message);
  }
}

// Run the main function
main();