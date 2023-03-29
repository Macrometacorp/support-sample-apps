import getClient from "./serverAuth.js";
const client = getClient();

export default async function executeQueryWorker(name, bind) {
    try {
        return await client.executeRestql(name, bind);
    } catch (error) {
        return error;
    }
}
