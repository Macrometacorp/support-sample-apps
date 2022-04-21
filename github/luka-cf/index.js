const macrometaHost = "https://api-gdn.paas.macrometa.io"
const authEndpoint = macrometaHost + "/_open/auth"
const collectionEndpoint = macrometaHost + "/_fabric/_system/_api/collection"
const type = "application/json;charset=UTF-8"
const authInfo = {
  "email": "",
  "password": "",
  "tenant": "",
  "username": "root",
  "apikey": ""
}

const newCollection = {
  "name": "mySecondCollection"
  }
const getOptions = (requestBody,token) => ({
method:'POST',
body:JSON.stringify(requestBody),
headers: { authorization:token,
       "content-type": type
        },
});

async function handleRequest() { 
  const jwtRequest = await fetch(authEndpoint,getOptions(authInfo,""))
  const jwtResponse = await jwtRequest.json();
  const jwtToken=`bearer ${jwtResponse.jwt}`

  const collectionRequest = await fetch(collectionEndpoint,getOptions(newCollection,jwtToken))
  const collectionResponse = await collectionRequest.json()
  return new Response(JSON.stringify(collectionResponse))
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest())
})
