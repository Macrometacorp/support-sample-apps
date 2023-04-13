import getClient from "./serverAuth.js";
const client = getClient();

export default async function createViews() {
  try {
    await client.createView("usersView", {
      users: {
        fields: {
          name: {
            analyzers: ["text_en"],
          },
        },
      },
    });
    await client.createView("productsView", {
      products: {
        fields: {
          name: {
            analyzers: ["text_en"],
          },
        },
      },
    });
  } catch (error) {
    return error;
  }
}
