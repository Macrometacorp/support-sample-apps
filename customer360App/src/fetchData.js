//Fetch data using query workers saved on GDN or IGDN. This function receives a query, bind variable for the query, API key, and domain. 
const fetchData = async function (query, inputVal, apikey, domain) {
  console.log('Fetching data...')
  const myHeaders = new Headers()
  myHeaders.append(
    'Authorization',
    `apikey ${apikey}`
  )
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,

    body: `{"bindVars":${inputVal}}`,
    redirect: 'follow'
  }
  const response = await fetch(
    `https://${domain}.paas.macrometa.io/_fabric/_system/_api/restql/execute/${query}`,
    requestOptions
  )

  const data = await response.json()
  return data
};


export default fetchData
