import getClient from "./serverAuth.js";
const client = getClient()

export default async function createViews(){
    try {
        const usersView = await client.createView("usersView", { "users":{"fields":{"name":{"analyzers":["text_en"]}}}});
        const productView = await client.createView("productsView", { "products":{"fields":{"name":{"analyzers":["text_en"]}}}});
    } catch (error) {
        return error    }

}