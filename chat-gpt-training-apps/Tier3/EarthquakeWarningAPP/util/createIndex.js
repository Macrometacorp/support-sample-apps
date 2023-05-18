import getClient from "./serverAuth.js";
const client = getClient();
export default async function createIndex(collectionName, fields) {
    try {
        await client.addGeoIndex(collectionName, fields);
    } catch (error) {
        return error;
    }
}
