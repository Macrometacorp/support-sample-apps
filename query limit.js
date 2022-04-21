const assert = require("assert");
const util = require("util");
const jsc8 = require("jsc8");
const fs = require("fs");
const path = require("path");

const key =
  "luka.klincarevic_macrometa.com.id1.Lx0XV13pMz97ecEnRKIu3ZxDCawaI9QjrJZo3pFot1Edbi4XXzFmlT4fC1NbGaPp692ff7"; //CHAGE THIS FOR YOUR API KEY

const client = new jsc8({
  url: "https://gdn.paas.macrometa.io",
  apiKey: key,
  fabricName: "_system",
});
num=36//this needs to b
const data=[]
const c = async function() {
  try {
    for (i = 1; i <= num; i++) {
      let b = 1000;
      let a = i*1000
      query = "FOR doc IN fulltext_test limit ${a}, ${b} return doc";
      const u = await client.query(query, {}, { batchSize: 1000 });
      await data.push.apply(data, u._result);
    }
    await console.log(data);
  } catch (e) {
    console.log(e);

  }
};

c();