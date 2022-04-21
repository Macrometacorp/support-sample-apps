const jsc8 = require("jsc8");

const copyFabric = "_system";
const pasteFabric = "test";

const client1 = new jsc8({
  url: "https://gdn.paas.macrometa.io",
  apiKey: "luka.klincarevic_macrometa.com.id1.Lx0XV13pMz97ecEnRKIu3ZxDCawaI9QjrJZo3pFot1Edbi4XXzFmlT4fC1NbGaPp692ff7",
  fabricName: copyFabric,
});
const client2 = new jsc8({
  url: "https://gdn.paas.macrometa.io",
  apiKey: "luka.klincarevic_macrometa.com.id1.Lx0XV13pMz97ecEnRKIu3ZxDCawaI9QjrJZo3pFot1Edbi4XXzFmlT4fC1NbGaPp692ff7",
  fabricName: pasteFabric,
});
const deleteAllCollections = async function() {
  const collections = await client2.listCollections(true);
  for (let i of collections) {
    await client2.deleteCollection(i.name);
  }
};

const index = async function() {
  const collections = await client1.listCollections(true);
  let arr = [];
  for (let i of collections) {
    const collectionIndexes = await client1.getCollectionIndexes(i.name);
    for (let i of collectionIndexes) {
      if (i.type !== "primary" && i.type !== "edge" && i.fields[0] !== "expireAt") {
        arr.push(i);
      }
    }
  }
  console.log(arr);
  for (let i of arr) {
    if (i.type === "fulltext") {
      let name = i.id.split("/")[0];
      console.log(name);
      await client2.addFullTextIndex(name, i.fields);
    } else if (i.type === "geo") {
      let name = i.id.split("/")[0];
      console.log(name);
      await client2.addGeoIndex(name, i.fields);
    } else if (i.type === "ttl") {
      let name = i.id.split("/")[0];
      console.log(name);
      await client2.addTtlIndex(name, i.fields, i.expireAfter);
    } else if (i.type === "persistent") {
      let name = i.id.split("/")[0];
      console.log(name);
      await client2.addPersistentIndex(name, i.fields, {
        unique: i.unique ? true : false,
        sparse: i.sparse ? true : false,
        deduplicate: i.deduplicate ? true : false,
      });
    }
  }
};

const cloneCollections = async function() {
  const collections = await client1.listCollections(true);

  console.log(collections);
  for (let i of collections) {
    if (i.collectionModel === "DOC") {
      if (i.type === 2) {
        await client2.createCollection(i.name, { stream: i.hasStream ? true : false });
      } else {
        await client2.createCollection(i.name, { stream: i.hasStream ? true : false }, { isEdge: true });
      }
    } else if (i.collectionModel === "KV") {
      const result = await client2.createKVCollection(i.name, { expiration: true, stream: i.hasStream ? true : false });
    } else if (i.collectionModel === "DYNAMO") {
      console.log("DYNAMO dont have driver support");
    } else {
      console.log("I dont know this type");
    }
  }
};

const readData = async function() {
  let obj = new Object();
  const collections = await client1.listCollections(true);

  for (let i of collections) {
    let name = i.name;
    const cursor = await client1.query(`FOR x IN ${name} return x`, {}, { batchSize: 1000, count: true, stream: true });
    let result = await cursor.all();
    obj[name] = result;
  }
  console.log(obj.knows);
  for (let i of collections) {
    console.log(obj[i.name]);
    await client2.insertDocumentMany(i.name, obj[i.name]);
  }
};
//deleteAllCollections();

cloneCollections();
//index();

//readData();