export default async function insertProduct (product, client) {
    const c8ql = `
      INSERT @product INTO products
      RETURN NEW
    `;
      const result = await client.executeQuery(c8ql, { product: product })
      return result      
  }