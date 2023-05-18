export default async function searchProductByName(productName, client) {
  const c8ql = `
    FOR product IN productsView
    SEARCH PHRASE (product.name, @product, "text_en")
    RETURN product
    `;

  const result = await client.executeQuery(c8ql, {
    product: productName.name,
  });
  return result;
}
