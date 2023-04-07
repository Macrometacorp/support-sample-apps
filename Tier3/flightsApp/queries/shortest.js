// Import the 'getClient' function from the 'serverAuth.js' module
import getClient from "../util/serverAuth.js";

// Call the 'getClient' function to create a Macrometa client instance
const client = getClient();

export default async function shortest(bind) {
    const c8ql = `    FOR v, e IN OUTBOUND SHORTEST_PATH @origin TO @destination
    GRAPH @flight
    OPTIONS {weightAttribute: @select}
    RETURN { edge: e}`;

    const result = await client.executeQuery(c8ql, bind);
    return result;
}
