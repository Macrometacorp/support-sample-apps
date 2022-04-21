import fetch from "node-fetch";
class APIRequest {
  _headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  constructor(url) {
    this._url = url;
  }

  login(email, password) {
    const endpoint = "/_open/auth";

    const self = this;

    return new Promise(function (resolve, reject) {
      self
        .req(endpoint, {
          body: { email, password },
          method: "POST",
        })
        .then(({ jwt, ...data }) => {
          self._headers.authorization = `bearer ${jwt}`;
          resolve(data);
        })
        .catch(reject);
    });
  }

  _handleResponse(response, resolve, reject) {
    if (response.ok) {
      resolve(response.json());
    } else {
      reject(response);
    }
  }

  req(endpoint, { body, ...options } = {}) {
    const self = this;
    return new Promise(function (resolve, reject) {
      fetch(self._url + endpoint, {
        headers: self._headers,
        body: body ? JSON.stringify(body) : undefined,
        ...options,
      }).then((response) => self._handleResponse(response, resolve, reject));
    });
  }
}
const EMAIL = "luka.klincarevic@macrometa.com";
const PASSWORD = "Malfurion123!";
const FEDERATION_URL = "https://api-gdn.paas.macrometa.io";

const run = async function () {
  try {
    const connection = new APIRequest(FEDERATION_URL);

  /* -------------------- Login ([email protected]/xxxxxx) -------------------- */

  await connection.login(EMAIL, PASSWORD);

  console.log("Login Successfully using", EMAIL);

     /* -------------------------- Create Doc Collection ------------------------- */

     const query = await connection.req(
      "/_fabric/_system/_api/restql",
      {
        body: {
          "query": {
            "name": "testtest",
            "parameter": {
            },
            "value": "FOR i IN test RETURN i"
          }
        },
        method: "POST",
      }
    );

    console.log("QUERY SAVED SUCCESSFULLY", query);

} catch (e) {
  console.error(e);
}
};

run();