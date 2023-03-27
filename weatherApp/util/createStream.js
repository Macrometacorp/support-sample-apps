import getClient from "./iotMonitoring/util/serverAuth.js";
const client = getClient();
export default async function createStream(name, local, isCollectionStream) {
    try {
        return await client.createStream(name, local);
    } catch (error) {
        return error;
    }
}
