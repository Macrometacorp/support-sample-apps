import getClient from "../util/serverAuth.js";
import express from "express";
import insertOrder from "../queries/insertOrder.js";
import deleteOrderByKey from "../queries/deleteOrder.js";
const orderRoutres = express.Router();
const client = getClient();

orderRoutres.post("/", async (req, res) => {
  try {
    const newOrder = req.body;
    const response = await insertOrder(newOrder, client);
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({
      message: `Error creating product: ${error}`,
    });
  }
});
orderRoutres.delete("/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    // Call the deleteOrder function here and pass orderId as an argument
    const response = await deleteOrderByKey(orderId, client);
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({
      message: `Error creating product: ${error}`,
    });
  }
});
export { orderRoutres };
