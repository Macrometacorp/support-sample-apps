export default async function insertUser(user, client) {
  const c8ql = `
      INSERT @user INTO users
      RETURN NEW
    `;

  const result = await client.executeQuery(c8ql, { user: user });
  return result;
}
