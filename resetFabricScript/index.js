import jsc8 from "jsc8";
import dotenv from "dotenv";

dotenv.config();

const client = new jsc8({
  url: process.env.URL,
  apiKey: process.env.API_KEY,
  fabricName: process.env.FABRIC,
});

const deleteAllCollections = async function () {
  try {
    const collections = await client.listCollections(true);
    for (const collection of collections) {
      await client.deleteCollection(collection.name);
    }
    console.log(`All collections are deleted`);
  } catch (error) {
    console.error(`Error deleting collections: ${error.message}`);
  }
};

const deleteAllRestqls = async function () {
  try {
    const restqls = await client.getRestqls();
    for (const restql of restqls.result) {
      await client.deleteRestql(restql.name);
    }
    console.log("All RESTqls are deleted");
  } catch (error) {
    console.error(`Error deleting RESTqls: ${error.message}`);

  }
};

const deleteAllStreams = async function () {
  try {
    const streams = await client.getStreams();
    for (const stream of streams.result) {
      await client.deleteStream(stream.topic, true);
    }
    console.log("Streams are deleted");
  } catch (error) {
    console.error(`Error deleting streams: ${error.message}`);

  }
};

const deleteAllStreamWorkers = async function () {
  try {
    const streamapps = await client.retrieveStreamApp();
    for (const streamapp of streamapps.streamApps) {
      await client.deleteStreamApp(streamapp.name);
    }
    console.log("Stream workers are deleted");
  } catch (error) {
    console.error(`Error deleting stream workers: ${error.message}`);

  }
};

const deleteAllViews = async function () {
  try {
    const views = await client.getListOfViews();
    for (const view of views.result) {
      await client.deleteView(view.name);
    }
    console.log("Views are deleted");
  } catch (error) {
    console.error(`Error deleting views: ${error.message}`);
  }
};

const deleteAllGraphs = async function () {
  try {
    const graphs = await client.getGraphs();
    for (const graph of graphs) {
      await client.deleteGraph(graph.name);
    }
    console.log("Graphs are deleted");
  } catch (error) {
    console.error(`Error deleting graphs: ${error.message}`);
  }
};

const runInSeries = async () => {
  const list = [
    deleteAllCollections,
    deleteAllRestqls,
    deleteAllStreams,
    deleteAllStreamWorkers,
    deleteAllViews,
    deleteAllGraphs,
  ];
  for (const fn of list) {
    try {
      await fn(); // call function to get returned Promise
    } catch (error) {
      console.error(`Error while deleting resources: ${error.message}`);
      break;
    }
  }
};

if (!process.env.URL || !process.env.API_KEY || !process.env.FABRIC) {
  console.error("Missing environment variable(s). Please check .env file.");
} else {
  runInSeries();
}