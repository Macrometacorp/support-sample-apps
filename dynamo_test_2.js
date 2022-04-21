var AWS = require("aws-sdk");
var fs = require('fs');


const dcName = "gdn.paas.macrometa.io";

const host = "https://api-" + dcName;
const apiKey =
"luka.klincarevic_macrometa.com.id1.Lx0XV13pMz97ecEnRKIu3ZxDCawaI9QjrJZo3pFot1Edbi4XXzFmlT4fC1NbGaPp692ff7";
const region = "us-east-1";
const endpoint = host + "/_api/dynamo";
// secretAccessKey is a required parameter for aws-sdk we recommend you to pass "c8"
const secretAccessKey = "c8";
const accessKeyId = "apikey " + apiKey;
AWS.config.update({
    region,
    endpoint,
    accessKeyId,
    secretAccessKey,
});

var docClient = new AWS.DynamoDB.DocumentClient()

var table = "Movies";

var year = 2015;
var title = "The Big New Movie";

// Update the item, unconditionally,

var params = {
    TableName:table,
    Key:{
        "year": year,
        "title": title
    },
    UpdateExpression: "set info.rating = :r, info.plot=:p, info.actors=:a",
    ExpressionAttributeValues:{
        ":r":5.5,
        ":p":"Everything happens all at once.",
        ":a":["Larry", "Moe", "Curly"]
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Updating the item...");
docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
}); 