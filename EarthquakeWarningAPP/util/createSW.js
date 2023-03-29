import getClient from "./serverAuth.js";
const client = getClient();
export default async function createSW(swName, swDefinition) {

  try {
    const data = await client.getAllEdgeLocations();
    const edgeLocations = data.map((obj) => obj._key);
    await client.createStreamApp(
      edgeLocations,
      swDefinition
    );
    await client.activateStreamApp(swName, true);
  } catch (error) {
    return error;
  }
}
