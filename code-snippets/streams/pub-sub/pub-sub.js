// Connect to GDN.
const jsc8 = require("jsc8");
const readline = require("readline");
const globalUrl = "https://play.paas.macrometa.io";
const apiKey = "xxxx"; //Change this to your API Key

// Create an authenticated instance with an API key (recommended)
const client = new jsc8({
  url: globalUrl,
  apiKey: apiKey,
  fabricName: "_system"
});

/* Authenticate via JSON Web Token (JWT)
const client = new jsc8({ url: globalUrl, token: "XXXX", fabricName: "_system" });
*/
  
/* Create an authenticated client instance via email and password
const client = new jsc8(globalUrl);
await client.login("your@email.com", "password");
*/

// Variables
const stream = "streamQuickstart";
let prefix_text = "";
const is_local = false; //For a local stream pass this variable as True, or False for a global stream

// Get the right prefix for the stream
if (is_local) {
  prefix_text = "c8locals.";
} else {
  prefix_text = "c8globals.";
}

async function createMyStream () {
  let streamName = { "stream-id": "" };
  if (await client.hasStream(stream, is_local)) {
    console.log("This stream already exists!");
    streamName["stream-id"] = prefix_text + stream;
    console.log(`Old Producer = ${streamName["stream-id"]}`);
  } else {
    streamName = await client.createStream(stream, is_local);
    console.log(`New Producer = ${streamName.result["stream-id"]}`);
  }
}

async function sendData () {
  console.log("\n ------- Publish Messages  ------");
  const producer = await client.createStreamProducer(stream, is_local);

  producer.on("open", () => {
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Repeatedly ask the user for message to be published to the stream. User can always exit by typing 0
    var recursiveUserInput = () => {
      input.question(
        "Enter your message to publish or Type 0 to exit:\n",
        (userInput) => {
          if (userInput === "0") {
            producer.close();
            return input.close();
          }

          const data = {
            payload: Buffer.from(userInput).toString("base64")
          };
          producer.send(JSON.stringify(data));
          console.log(`Message sent: ${userInput}`);
          recursiveUserInput();
        }
      );
    }
    recursiveUserInput();
  });
  producer.onclose = function () {
    console.log("Closed WebSocket:Producer connection for " + stream);
  };
}

async function receiveData () {
  console.log("\n ------- Receive Messages  ------");
  const consumer = await client.createStreamReader(
    stream,
    "test-subscription-1",
    is_local
  );
  
  // Close consumer connection when user types 0
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  input.question(
    "Type '0' to exit anytime:\n",
    (userInput) => {
      if (userInput === "0") {
        consumer.close();
        return input.close();
      } 
    }
  );

  consumer.on("message", (msg) => {
    const { payload, messageId } = JSON.parse(msg);
    console.log(Buffer.from(payload, "base64").toString("ascii"));
    // Send message acknowledgement
    consumer.send(JSON.stringify({ messageId }));
  });

  consumer.onclose = function () {
    console.log("Closed WebSocket:Consumer connection for " + stream);
  };
}

async function selectAction () {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  input.question(
    "Type 'w' to write data. Type 'r' to read data: ",
    (userInput) => {
      if (userInput === "w") {
        sendData();
      } else if (userInput === "r") {
        receiveData();
      } else {
        console.log("Invalid user input. Stopping program.");
        return false;
      }
      input.close();
    }
  );
}

(async function () {
  await createMyStream();
  await selectAction();
})();