var AWS = require("aws-sdk");

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

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "Movies",
    KeySchema: [       
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});