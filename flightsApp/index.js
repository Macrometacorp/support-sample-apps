import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import importData from "./util/importDocuments.js";
import { airports } from "./data/airports.js";
import { flights } from "./data/flights.js";
import createCollection from "./util/createCollections.js";
import listAirports from "./queries/listAirports.js";
import createGraph from "./util/createGraph.js";
import shortest from "./queries/shortest.js";
import stops from "./queries/stops.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT;

dotenv.config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// An immediately-invoked async function to set up the environment
(async function () {
    const airCollection = await createCollection(process.env.AIRPORTS_COLLECTION);
    const flightCollection = await createCollection(
        process.env.FLIGHTS_COLLECTION,
        {},
        true
    );
    if (airCollection.code != 409)
        await importData(process.env.AIRPORTS_COLLECTION, airports, "_key");
    if (flightCollection.code != 409)
        await importData(process.env.FLIGHTS_COLLECTION, flights);
    const graph = await createGraph(process.env.GRAPH_NAME, {
        edgeDefinitions: [{
            collection: 'flights',
            from: ['airports'],
            to: ['airports']
        }]
    })
})();

app.get("/", async (req, res) => {
    const airports = await listAirports();
    console.log(airports);
    res.render("index", { airports: airports });
});
app.post("/search", async (req, res) => {
    try {
        // Extract the city from the request body
        const fcity = "airports/" + req.body.fcity;
        const tcity = "airports/" + req.body.tcity;
        const select = req.body.select

        console.log(fcity, tcity, select);
        if (select == "Price" || select == "Distance") {
            const response = await shortest({ origin: fcity, destination: tcity, flight: process.env.GRAPH_NAME, select: select })
            console.log(response);
            const filteredData = response.filter((item) => item.edge !== null);

            res.render("result", { message: filteredData });

        }

        // res.render("result", { message: [{ _key: "1" }, { _key: "2" }] });

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

app.all("*", (req, res) => {
    res.render("404page");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
