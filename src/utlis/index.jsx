export default async function getToken(username, role) {
  const response = await fetch("https://100ms-services.vercel.app/api/token", {
    method: "POST",
    body: JSON.stringify({
      env: "qa-in",
      role: role,
      room_id: "6077d5e1dcee704ca43caea3",
      user_name: username,
    }),
  });

  const { token } = await response.json();

  return token;
}
