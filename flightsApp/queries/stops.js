// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "../util/serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient();

export default async function stops(bind) {
    const c8ql = ` FOR i IN airports
    FILTER i._id == @id
    FOR v, e, p IN 2..2 OUTBOUND i @flights
    PRUNE v._id == @to
    OPTIONS { bfs: true, uniqueVertices: 'path' }
    FILTER v._id == @to
    LIMIT 10
    RETURN p`

    const result = await client.executeQuery(c8ql, bind);
    return result;
}
