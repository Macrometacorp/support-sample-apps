export default async function deleteProductByKey(key, client) {
    const c8ql = `
      REMOVE @key IN products
      RETURN OLD
    `;
  
    const result = await client.executeQuery(c8ql, { key: key });
    return result;
  }
  