const jsc8 = require("jsc8");

client = new jsc8({
  url: "https://play.paas.macrometa.io",
  apiKey: "xxxxx",
  fabricName: "_system",
});

// Edge collections and vertices must be created before running this script.
async function createGraph() {
  const response = await client.createGraph("grocery-graph", {
    edgeDefinitions: [
      {
        // Edge collection name --> This collection holds relationships between vertices
        collection: "groceryOrders",
        // Vertex collection that is used as the start vertex of the edge
        from: ["groceryCustomers"],
        // Vertex collection that is used as the start vertex of the edge
        to: ["groceryItems"],
      },
    ],
  });
  console.log(response);
}
createGraph();