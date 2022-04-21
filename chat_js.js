//run in two terminal window and start chat


const jsc8 = require("jsc8");
const key =
  "ljubisav.jakovljevic_macrometa.com.teastttt2.0XX3ZaPZavyciw0r79cFTxhclLybCEOeU0O2g5TH9K2G4E5iVC6gYKn9JJ2AaPNha57637"; //CHAGE THIS FOR YOUR API KEY
const atob = require("atob");

const client = new jsc8({
  url: "https://gdn.paas.macrometa.io",
  apiKey: key,
  fabricName: "_system",
});
let streamName= "IN2"
async function streams() {
    try{

      const stream_local = await client.createStream(streamName, true);
    } catch(e){
      
    }
}
streams();

let randomUser = "User" + Math.floor(Math.random() * 100);
let myArgs = process.argv.slice(2, 3);
let sub = randomUser;
if (myArgs.length === 0) {
  myArgs = randomUser;
}
let userName = myArgs + " :";

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const a = function() {
  readline.question("", async msg => {
    const stream = await client.getStream(streamName, true);
    let m = msg + "." + userName;
    const producerOTP = await stream.getOtp();
    const producer = stream.producer("gdn.paas.macrometa.io", { otp: producerOTP });
    producer.on("open", () => {
      const payloadObj = { payload: Buffer.from(m).toString("base64") };
      producer.send(JSON.stringify(payloadObj));
    });
    a();
  });
};
const b = async function() {
  const consumer = await client.createStreamReader(streamName, sub, true);
  consumer.on("message", async msg => {
    const { payload, messageId } = JSON.parse(msg);
    let m = atob(payload).split(".");
    await console.log(m[1], m[0]);

    consumer.send(JSON.stringify({ messageId }));
  });
  a();
};
b();