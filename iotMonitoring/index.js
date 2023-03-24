import express from "express";
import bodyParser from "body-parser";
import { deviceRoutes } from "./routes/devices.js";
import * as dotenv from "dotenv";
import createCollection from "./util/createCollections.js";
import createSW from "./util/createSW.js";
import { IoTdata } from "./workers/IoTdata.js";
import path from 'path';
import { fileURLToPath } from 'url';
import getCityLocation from "./util/getCityLocation.js"
import checkTemp from "./workers/checkTemp.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
dotenv.config(); // Load environment variables from .env file

// An immediately-invoked async function to set up the environment
(async function () {
    // Create a collection to store devices
    await createCollection(process.env.DEVICES_COLLECTION);
    const IoTdefenition = IoTdata(
        process.env.SW_NAME,
        process.env.STREAM_NAME,
        process.env.DATA_COLLECTION
    );
    await createSW(process.env.SW_NAME, IoTdefenition);
})();

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get("/", (req, res) => {
    res.render("index");
});
app.post("/search", async (req, res) => {
    try {
        // Extract the city from the request body
        const city = req.body;
        console.log(city, "test");
        // Use the 'getCityLocation' function to retrieve the latitude and longitude of the city
        const location = await getCityLocation(city)
        // Use the 'checkTemp' function to retrieve the temperature data for the city
        const response = await checkTemp(location.latitude, location.longitude)

        // Send a response with a JSON object containing the temperature data
        res.render("result", { message: response })

        // TODO: Query your database to retrieve the status of devices and return the results in the response.
    } catch (error) {
        // If an error occurs, log it to the console and send a 500 status code
        console.error(error);
        res.sendStatus(500);
    }
    /*
  Data example
  {
  "city": "New York"
  }
*/
});
// Use deviceRoutes for handling "/devices" routes
app.use("/devices", deviceRoutes);
app.all("*", (req, res) => {
    res.render("404page");
});
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
