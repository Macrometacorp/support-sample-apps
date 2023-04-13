import getClient from "./serverAuth.js";
import atob from 'atob'
import executeQueryWorker from "./executeQueryWorker.js";
import sendEmail from "./sendEmail.js";
import * as dotenv from "dotenv";
dotenv.config();
const client = getClient();
const userCollection = process.env.USERS_COLLECTION
const queryName = process.env.QUERY_NAME
export default async function createConusmer(name) {
    try {
        const consumer = await client.createStreamReader(
            name,
            "subscriber1",
            true,
            true,

        );
        consumer.on("open", async (msg) => {
            console.log("Connection to collection is open!");
        });
        consumer.on("message", async (msg) => {
            try {
                const { payload, messageId } = JSON.parse(msg);
                let data = JSON.parse(atob(payload));
                consumer.send(JSON.stringify({ messageId }));

                const queryRes = await executeQueryWorker(queryName,
                    { users: userCollection, lat: data.latitude, long: data.longitude })
                const emails = queryRes.result.map(user => user.email);
                await sendEmail(
                    emails,
                    "Earthquake warning!",
                    `Earthquakes happen near your location. 
                Latitude: ${data.latitude}
                Longitude: ${data.longitude}
                Magnitude: ${data.magnitude}
                Time:${new Date(data.timestamp)}`)

            } catch (e) {
                console.log(e);
            }
        });
        consumer.on("close", async (msg) => {
            consumer.close()
        });
        consumer.on("error", async (msg) => {
            console.log(msg, "WebSocket error!");
        });
    }
    catch (e) {
        console.log(e);
    }
};
