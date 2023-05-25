const jsc8 = require("jsc8");

const client = new jsc8({url: "https://play.paas.macrometa.io", apiKey: "XXXX", fabricName: '_system'});

// Variables
const collectionName = "ddos";
let listener;
const data = [
  { ip: "10.1.1.1", action: "block", rule: "blocklistA" },
  { ip: "20.1.1.2", action: "block", rule: "blocklistA" },
  { ip: "30.1.1.3", action: "block", rule: "blocklistB" },
  { ip: "40.1.1.4", action: "block", rule: "blocklistA" },
  { ip: "50.1.1.5", action: "block", rule: "blocklistB" }
];

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

async function main () {
    async function createCollection () {
        console.log("\n1. Log in.");

    // Create a collection if one does not exist.
        console.log("\n2. Create collection.");
        try {
          console.log(`Creating the collection ${collectionName}...`);
          const existsColl = await client.hasCollection(collectionName);
          if (existsColl === false) {
            await client.createCollection(collectionName, { stream: true });
          }

      // Subscribe to be notified when changes are made to collection.
          listener = await client.onCollectionChange(collectionName);
          listener.on("message", (msg) => {
            const receivedMsg = msg && JSON.parse(msg);
            console.log("message=>", Buffer.from(receivedMsg.payload, "base64").toString("ascii"))
          });

      // Open connection to GDN. You will be routed to closest region.
          listener.on("open", () => console.log("Connection open"));
          listener.on("close", () => console.log("Connection closed"));
        } catch (e) {
          await console.log("Collection creation did not succeed due to " + e);
        }
    }
    await createCollection();

  // Insert documents into the collection to trigger a notification.
    async function insertData () {
        console.log(`\n3. Insert data`);
        await client.insertDocumentMany(collectionName, data);
    }
    await sleep(2000);
    await insertData();

  // Delete collection.
    async function deleteCollection () {
        console.log("\n4. Delete collection");
        await client.deleteCollection(collectionName);
    }
    await sleep(10000);

    await listener.close();
    await deleteCollection();  
}
main();