/**
 * @param {RequestInfo} url
 * @param {RequestInit} options
 * @returns {Promise<Response>}
 */
const fetchWithRetry = async (url, options) => {
  const MAX_RETRIES = 4;
  let error = Error("something went wrong");
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      error = err;
    }
  }
  console.error("Fetch failed after max retries", { url, options });
  throw error;
};

export default async function getToken(tokenEndpoint, userId, role, roomId) {
  try {
    const response = await fetchWithRetry(`${tokenEndpoint}api/token`, {
      method: "POST",
      body: JSON.stringify({
        role,
        room_id: roomId,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      let error = new Error("Request failed!");
      error.response = response;
      throw error;
    }

    const data = await response.json();
    const { token } = data;
    // response will be sucess and token is null when url is valid but response
    // domain is not present in 100ms
    if (token === null) {
      throw Error(data.msg);
    }
    return token;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
