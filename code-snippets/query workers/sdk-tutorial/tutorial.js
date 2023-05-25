const jsc8 = require("jsc8");

const globalUrl = "https://play.paas.macrometa.io";

/*
// Create auth instance with token
const client = new jsc8({
    url: gdnUrl,
    token: "XXXX",
    fabricName: '_system'
});

// ----- OR -----
// Create an auth instance with an API key
const client = new jsc8({
    url: gdnUrl,
    apiKey: "XXXX",
    fabricName: '_system'
});

// ----- OR -----
// Create an auth instance using an email and password
const client = new jsc8(gdnUrl);
await client.login("nemo@nautilus.com", "xxxxx");
*/

// Connect to GDN
const client = new jsc8({ url: globalUrl, apiKey: "XXXXX", fabricName: "_system" });

// Variables
const collectionName = "address";

// Variables - Query Workers
const parameter = { firstname: "", lastname: "", email: "", zipcode: "" };

const insertDataValue = {
  query: {
    name: "insertRecord",
    value: `INSERT {'firstname':@firstname, 'lastname':@lastname, 'email':@email, 'zipcode':@zipcode, '_key': 'abc'} 
      IN ${collectionName}`,
    parameter
  }
};

const getDataValue = {
  query: {
    name: "getRecords",
    value: `FOR doc IN ${collectionName} RETURN doc`
  }
};

const updateDataValue = {
  query: {
    name: "updateRecord",
    value: `UPDATE 'abc' WITH { "lastname": "cena" } IN ${collectionName}`
  }
};

const deleteDataValue = {
  query: {
    name: "deleteRecord",
    value: `REMOVE 'abc' IN ${collectionName}`
  }
};

const getCountValue = {
  query: {
    name: "countRecords",
    value: `RETURN COUNT(FOR doc IN ${collectionName} RETURN 1)`
  }
};

// Step 1: Open connection to GDN. You will be routed to the closest region.
console.log(`\n1. Connecting to federation: ${globalUrl}`);

async function createCollection () {
  console.log("\n2. Creating collection.");

  try {
    console.log(`Creating the collection ${collectionName}...`);
    const existsColl = await client.hasCollection(collectionName);
    if (existsColl === false) {
      await client.createCollection(collectionName);
      console.log(`Collection ${collectionName} has been created successfully.`);
    } else {
      console.log(`Collection ${collectionName} already exists.`);
    }
  } catch (e) {
    console.log("Collection creation did not succeed due to " + e);
  }
}

// This function creates the needed collection or displays a message if it already exists.
async function insertQueryWorker (nameToCheck, value, parameterToCheck) {
  let queryAlreadyExists = false;
  const queryList = await client.getRestqls();
  try {
    for (let i = 0; i < queryList.result.length; i++) {
      if (queryList.result[i].name === nameToCheck) {
        queryAlreadyExists = true;
        break;
      }
    }

    if (queryAlreadyExists) {
      console.log(`Query worker ${nameToCheck} already exists.`);
    } else {
      await client.createRestql(nameToCheck, value, parameterToCheck);
      console.log(`Query worker ${nameToCheck} created successfully.`);
    }
  } catch (e) {
    console.log("Could not check the list of query workers due to " + e);
  }
}

async function createRestQL () {
  console.log("\n3. Creating query workers.");

  try {
    await insertQueryWorker(insertDataValue.query.name.toString(), insertDataValue.query.value.toString(), insertDataValue.query.parameter);
    await insertQueryWorker(getDataValue.query.name.toString(), getDataValue.query.value.toString(), {});
    await insertQueryWorker(updateDataValue.query.name.toString(), updateDataValue.query.value.toString(), {});
    await insertQueryWorker(deleteDataValue.query.name.toString(), deleteDataValue.query.value.toString(), {});
    await insertQueryWorker(getCountValue.query.name.toString(), getCountValue.query.value.toString(), {});

    console.log("All query workers are now in the system.");
  } catch (e) {
    console.log("Query workers could not be created due to " + e);
  }
}

async function executeRestQL () {
  console.log("\n4. Running query workers");
  console.log("\n a. Insert data");

  let resp = await client.executeRestql(insertDataValue.query.name.toString(), {
    firstname: "john",
    lastname: "doe",
    email: "john.doe@macrometa.io",
    zipcode: "511037"
  }).catch(e => console.log(console.error(e)));
  console.log(resp.result);

  console.log("\n b. Get data");
  resp = await client.executeRestql(getDataValue.query.name.toString(), {});
  console.log(resp.result);

  console.log("\n c. Update data");
  resp = await client.executeRestql(updateDataValue.query.name.toString(), {});
  console.log(resp.result);

  console.log("\n d. Get data");
  resp = await client.executeRestql(getDataValue.query.name.toString(), {});
  console.log(resp.result);

  console.log("\n e. Count records");
  resp = await client.executeRestql(getCountValue.query.name.toString(), {});
  console.log(resp.result);

  console.log("\n f. Delete record");
  resp = await client.executeRestql(deleteDataValue.query.name.toString(), {});
  console.log(resp.result);
}

async function deleteRestQL () {
  console.log("\n5a. Deleting query workers.");

  try {
    await client.deleteRestql(insertDataValue.query.name.toString());
    await client.deleteRestql(getDataValue.query.name.toString());
    await client.deleteRestql(updateDataValue.query.name.toString());
    await client.deleteRestql(getCountValue.query.name.toString());
    await client.deleteRestql(deleteDataValue.query.name.toString());

    console.log("All query workers deleted.");
  } catch (e) {
    console.log("Could not delete query workers due to " + e);
  }
}

async function deleteCollection () {
  console.log("\n5b. Deleting the collection.");

  try {
    console.log(`Removing the collection ${collectionName}...`);
    const existsColl = await client.hasCollection(collectionName);
    if (existsColl === false) {
      console.log(`Can't remove non-existent collection: ${collectionName}.`);
    } else {
      await client.deleteCollection(collectionName);
      console.log(`Collection ${collectionName} has been deleted successfully.`);
    }
  } catch (e) {
    console.log("Collection creation did not succeed due to " + e);
  }
}

(async function () {
  await createCollection();
  await createRestQL();
  await executeRestQL();
  await deleteRestQL();
  await deleteCollection();
})();