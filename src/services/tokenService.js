export default async function getToken(userId, role, roomId) {
  console.log(userId, role, roomId, process.env.REACT_APP_ENV);
  console.log(process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT);
  const response = await fetch(
    process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT,
    {
      method: "POST",
      //TODO remove env
      body: JSON.stringify({
        env: process.env.REACT_APP_ENV,
        role: role,
        room_id: roomId,
        user_id: userId
      })
    }
  );

  const { token } = await response.json();

  return token;
}
