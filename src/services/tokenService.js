export default async function getToken(tokenEndpoint, userId, role, roomId) {
  console.log(tokenEndpoint);
  const response = await fetch(`${tokenEndpoint}/api/token`, {
    method: "POST",
    //TODO remove env
    body: JSON.stringify({
      env: process.env.REACT_APP_ENV,
      role: role,
      room_id: roomId,
      user_id: userId,
    }),
  });

  const { token } = await response.json();

  return token;
}
