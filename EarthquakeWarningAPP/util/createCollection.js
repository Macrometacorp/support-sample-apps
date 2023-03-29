import getClient from "./serverAuth.js";
const client = getClient();
export default async function createCollection(name, stream) {
    try {
        await client.createCollection(name, { stream: stream });
    } catch (error) {
        return error;
    }
}
