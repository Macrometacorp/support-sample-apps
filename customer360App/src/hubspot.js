const hubspotFetch = async function (id, apikey, objectType, array, object) {
    console.log('Fetching data...')
    const myHeaders = new Headers()
    myHeaders.append(
        'Authorization',
        `Bearer ${apikey}`
    )
    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }
    let query = ""
    for (i of array) {
        query = query + `associations=${i}&`
    }

    const response = await fetch(
        `https://api.hubapi.com/crm/v3/${object}/${objectType}/${id}?${query}`,
        requestOptions
    )
    const data = await response.json()

    return data
};


export default hubspotFetch