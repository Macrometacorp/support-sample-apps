const WebSocket = require('ws');
class APIRequest {
  _headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  constructor (httpUrl, apiKey) {
    this._url = httpUrl;
    this._headers.authorization = `apikey ${apiKey}`; // apikey keyword is needed here
  }

  _handleResponse (response, resolve, reject) {
    if (response.ok) {
      resolve(response.json());
    } else {
      reject(response);
    }
  }

  req (endpoint, { body, ...options } = {}) {
    const self = this;
    return new Promise(function (resolve, reject) {
      fetch(self._url + endpoint, {
        headers: self._headers,
        body: body ? JSON.stringify(body) : undefined,
        ...options
      }).then((response) => self._handleResponse(response, resolve, reject));
    });
  }
}

const apiKey = "XXXXX" // Use your API key here
const globalUrl = "api-play.paas.macrometa.io";
const httpUrl = `https://${globalUrl}`;
const tenant = "XXXXX" // Use your tenant name here

const stream = "api_tutorial_streams";
const consumerName = "api_tutorial_streams_consumer";
const isGlobal = true;

const run = async function () {
  try {
    const connection = new APIRequest(httpUrl, apiKey);

    /* ------------------------------ Create stream ----------------------------- */

    try {
      await connection.req(
        `/_fabric/_system/streams/${stream}?global=${isGlobal}`,
        {
          body: { name: stream },
          method: "POST"
        }
      );
      console.log("Stream created successfully");
    } catch (e) {
      if (e.status === 409) {
        console.log("Stream already exists, skipping creation of stream");
      } else {
        console.log("Error while creating stream");
        throw e;
      }
    }

    /* ----------------- Publish and subscribe message to stream ---------------- */

    const region = isGlobal ? "c8global" : "c8local";
    const streamName = `${region}s.${stream}`;

    // Fetching local URL in case the stream is local
    const localDcDetails = await connection.req(`/datacenter/local`, {
      method: "GET"
    });

    const dcUrl = localDcDetails.tags.url;

    const url = isGlobal
      ? globalUrl
      : `api-${dcUrl}`;

    const otpConsumer = await connection.req(`/apid/otp`, {
      method: "POST"
    });
    const otpProducer = await connection.req(`/apid/otp`, {
      method: "POST"
    });

    const consumerUrl = `wss://${url}/_ws/ws/v2/consumer/persistent/${tenant}/${region}._system/${streamName}/${consumerName}?otp=${otpConsumer.otp}`;

    const producerUrl = `wss://${url}/_ws/ws/v2/producer/persistent/${tenant}/${region}._system/${streamName}?otp=${otpProducer.otp}`;

    let consumer;
    let producer;
    let producerInterval;

    /* -------------------------- Initialize consumer -------------------------- */

    const initConsumer = () => {
      return new Promise((resolve) => {
        consumer = new WebSocket(consumerUrl);

        consumer.onopen = function () {
          console.log("WebSocket:Consumer is open now for " + streamName);
          resolve();
        };

        consumer.onerror = function () {
          console.log(
            "Failed to establish WebSocket:Consumer connection for " +
              streamName
          );
        };

        consumer.onclose = function () {
          console.log("Closed WebSocket:Consumer connection for " + streamName);
        };

        consumer.onmessage = function (message) {
          const receivedMsg = message.data && JSON.parse(message.data);

          console.log(
            `WebSocket:Consumer message received at ${new Date()}`,
            receivedMsg
          );

          const ackMsg = { messageId: receivedMsg.messageId };
          consumer.send(JSON.stringify(ackMsg));
        };
      });
    };

    /* -------------------------- Initialize producer -------------------------- */

    const initProducer = () => {
      producer = new WebSocket(producerUrl);

      producer.onopen = function () {
        console.log("WebSocket:Producer is open now for " + streamName);
        producerInterval = setInterval(function () {
          console.log(`WebSocket:Producer message sent at ${new Date()}`);
          producer.send(JSON.stringify({ payload: `test` }));
        }, 10000);
      };

      producer.onclose = function (e) {
        console.log("Closed WebSocket:Producer connection for " + streamName);
        clearInterval(producerInterval);
      };

      producer.onerror = function (e) {
        console.log(
          "Failed to establish WebSocket:Producer connection for " + streamName
        );
      };
    };

    initConsumer().then(() => {
      initProducer();
    });

    await new Promise((resolve) => setTimeout(resolve, 1 * 40 * 1000));
    consumer.close();
    console.log("CONSUMER CLOSING...");
    producer.close();
    console.log("PRODUCER CLOSING...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    /* ------------------------ Unsubscribe from stream ------------------------ */

    const consumerUnsubscribe = await connection.req(
      `/_fabric/_system/_api/streams/subscription/${consumerName}`,
      {
        method: "DELETE"
      }
    );
    console.log(
      `${consumerName} unsubscribed successfully`,
      consumerUnsubscribe
    );
  } catch (e) {
    console.error(e);
  }
};

run();