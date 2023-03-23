
const dotenv = require("dotenv")
const path = require("path");
const jsc8 = require("jsc8");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  pingTimeout: 30000, // Ping timeout in milliseconds (30 seconds)
  pingInterval: 10000, // Interval between pings in milliseconds (10 seconds)
});
const atob = require("atob");
dotenv.config()
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const collectionAndStreamName = "ChatCollection"; // Name of collection

//connection
const client = new jsc8({
  url: process.env.URL,
  apiKey: process.env.API_KEY,
  fabric: process.env.FABRIC
});

(async function createCollection() {
  try {
    const newColl = await client.createCollection(collectionAndStreamName, {
      stream: true,
    });
    console.log(newColl);
  } catch (e) {
    console.log(e.response.body);
  }
})()

app.get("/", (req, res) => {
  res.render("index");
});
app.post("/chat", async (req, res) => {
  let name = req.body.name;
  const docs = await client.executeQuery(
    `FOR i IN ${collectionAndStreamName} sort i.time asc RETURN i`
  );
  res.render("chat", { data: { name: name, docs: docs } });
});
app.get("/chat", async (req, res) => {
  const docs = await client.executeQuery(
    `FOR i IN ${collectionAndStreamName} sort i.time asc RETURN i`
  );
  res.render("chat", { data: { name: name, docs: docs } });
});

const saveMsg = async function (msg) {
  const insertedDoc = await client.insertDocument(collectionAndStreamName, msg);
};

const createConusmer = async function () {
  try {
    const consumer = await client.createStreamReader(
      collectionAndStreamName,
      "sub",
      true,
      true,

    );
    consumer.on("message", async (msg) => {
      const { payload, messageId } = JSON.parse(msg);
      let m = JSON.parse(atob(payload)).chat;
      console.log(m);
      io.emit("time", { time: m });
      consumer.send(JSON.stringify({ messageId }));
    });
  }
  catch (e) {
    // console.log(e);
  }
};
createConusmer();
io.on("connection", function (socket) {
  // Use socket to communicate with this particular client only, sending it it's own id
  socket.on("chat message", (msg) => {
    msg = { chat: msg, time: Date.now() };
    saveMsg(msg);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
