export default async function deleteUserByKey(key, client) {
  const c8ql = `
      REMOVE @key IN users
      RETURN OLD
    `;

  const result = await client.executeQuery(c8ql, { key: key });
  return result;
}
