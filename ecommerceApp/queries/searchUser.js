export default async function searchUserByName(userName, client) {
  const c8ql = `
    FOR user IN usersView
    SEARCH PHRASE (user.name, @user, "text_en")
    RETURN user
    `;

  const result = await client.executeQuery(c8ql, {
    user: userName.name,
  });
  return result;
}
