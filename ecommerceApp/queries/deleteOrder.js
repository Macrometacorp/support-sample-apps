export default async function deleteOrderByKey(key, client) {
    const c8ql = `
      REMOVE @key IN orders
      RETURN OLD
    `;
  
    const result = await client.executeQuery(c8ql, { key: key });
    return result;
  }