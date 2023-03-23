export default async function insertOrder(order, client) {
  const c8ql = `
      INSERT @order INTO orders
      RETURN NEW
    `;

  const result = await client.executeQuery(c8ql, { order: order });
  return result;
}
