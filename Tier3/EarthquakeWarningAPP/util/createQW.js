import getClient from "./serverAuth.js";
const client = getClient();

export default async function createQW(name, queryDefinition) {
  try {
    await client.createRestql(name, queryDefinition);
  } catch (error) {
    return error;
  }
}
