//Check if user exist in GDN
const checkCred = async function (email, password) {
    console.log('Checking...')
    const requestOptions = {
        method: 'POST',
        body: `{"email":"${email}","password":"${password}"}`,
    }
    const response = await fetch(
        `https://api-play.paas.macrometa.io/_open/auth`,
        requestOptions
    )
    const data = await response.json()
    return data
};


export default checkCred
