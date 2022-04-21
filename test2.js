const jsc8 = require("jsc8");

const copyFabric = "_system";

const client = new jsc8({
  url: "https://gdn.paas.macrometa.io",
  apiKey: "luka.klincarevic_macrometa.com.id1.Lx0XV13pMz97ecEnRKIu3ZxDCawaI9QjrJZo3pFot1Edbi4XXzFmlT4fC1NbGaPp692ff7",
  fabricName: copyFabric,
});

const collections = await client.listCollections(true);
console.log(collections);