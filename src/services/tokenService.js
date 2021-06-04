export default async function getToken(
  tokenEndpoint,
  env,
  userId,
  role,
  roomId
) {
  const response = await fetch(`${tokenEndpoint}/api/token`, {
    method: "POST",
    //TODO remove env
    body: JSON.stringify({
      env,
      role,
      room_id: roomId,
      user_id: userId,
    }),
  });

  const { token } = await response.json();

  return token;
}
