import getClient from "./serverAuth.js";
const client = getClient()

let queryDefinition= `FOR c IN @items
LET product = DOCUMENT(CONCAT('products/', c.productId))
UPDATE product._key WITH {stock: product.stock - c.quantity} IN products`
export default async function createQW(){
    try {
        await client.createRestql("updateStock1", queryDefinition);
    } catch (error) {
        return error    }

}