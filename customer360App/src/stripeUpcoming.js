const upcomingInvoices = async function (id, apikey) {
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
    const response = await fetch(
        `https://api.stripe.com/v1/invoices/upcoming?customer=${id}`,
        requestOptions
    )
    const data = await response.json()

    return data
};


export default upcomingInvoices