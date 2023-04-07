import getClient from "../util/serverAuth.js";
import express from "express";
import insertProduct from "../queries/insertProduct.js";
import deleteProductByKey from "../queries/deleteProduct.js";
import searchProductByName from "../queries/searchProduct.js";

const productRoutes = express.Router();
const client = getClient();

productRoutes.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    const response = await insertProduct(newProduct, client);
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({
      message: `Error creating product: ${error}`,
    });
  }
});

productRoutes.delete("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    // Call the deleteProduct function here and pass productId as an argument
    const response = await deleteProductByKey(productId, client);
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({
      message: `Error creating product: ${error}`,
    });
  }
});

productRoutes.post("/search", async (req, res) => {
  try {
    const product = req.body;
    console.log(product);
    // Call the getProduct function here and pass productId as an argument
    const response = await searchProductByName(product, client);
    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({
      message: `Error creating product: ${error}`,
    });
  }
});
export { productRoutes };
