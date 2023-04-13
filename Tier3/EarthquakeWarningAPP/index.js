import express from "express";
import bodyParser from "body-parser";
import createCollection from "./util/createCollection.js";
import createSW from "./util/createSW.js";
import createQW from "./util/createQW.js";
import publishMsg from "./util/publishMsg.js";
import createConusmer from "./util/createConsumer.js";
import createIndex from "./util/createIndex.js";
import { sensoreData } from "./workrers/swDetectEQ.js";
import { findUsers } from "./workrers/qwFindUsersNearby.js";
import insertDocument from "./util/insertDocument.js";
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
// setting env
(async function () {
    const sensoreDataDefention = sensoreData(
        process.env.SW_NAME,
        process.env.STREAM_NAME,
        process.env.DATA_COLLECTION)
    const queryDefenition = findUsers()
    await createCollection(process.env.DATA_COLLECTION, true)
    await createCollection(process.env.USERS_COLLECTION, false)
    await createSW(process.env.SW_NAME, sensoreDataDefention);
    await createQW(process.env.QUERY_NAME, queryDefenition);
    await createConusmer(process.env.DATA_COLLECTION)
    await createIndex(process.env.USERS_COLLECTION, ["location"])


})();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.post("/data", async function (req, res) {
    const newData = JSON.stringify(req.body)
    try {
        const response =
            await publishMsg(process.env.STREAM_NAME, true, newData)
        res.status(200).send(newData)
    }
    catch (e) {
        // console.log(e);
        res.status(500).send(newData)

    }
})

app.post("/user", async function (req, res) {
    const newData = req.body
    try {
        const response =
            await insertDocument(process.env.USERS_COLLECTION, newData)
        res.status(200).send(newData)
    }
    catch (e) {
        // console.log(e);
        res.status(500).send(newData)

    }
})
app.all("*", function (req, res) {
    res.status(404).send("Not Found")
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
