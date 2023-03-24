import getClient from "./serverAuth.js";
const client = getClient();
const appName = "Update_product";
export default async function createSW() {
  let appDefinition = `
    @App:name("${appName}")
    @App:qlVersion("2")

CREATE SOURCE ordersEvents WITH (type = 'database', collection = "orders", collection.type="doc" , replication.type="global", map.type='json') (items object);

CREATE SINK updateStock WITH (type='query-worker', query.worker.name="updateStock")(items object);

INSERT INTO updateStock
SELECT *
FROM ordersEvents;
    `;

  try {
    const data = await client.getAllEdgeLocations();
    const edgeLocations = data.map((obj) => obj._key);
    await client.createStreamApp(
      edgeLocations,
      appDefinition
    );
    await client.activateStreamApp(appName, true);
  } catch (error) {
    return error;
  }
}
