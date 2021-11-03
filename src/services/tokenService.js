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

export default async function getToken(
  tokenEndpoint,
  env,
  userId,
  role,
  roomId
) {
  const response = await fetchWithRetry(`${tokenEndpoint}api/token`, {
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

export async function getUserToken(name) {
  const extractUrlCode = () => {
    const path = window.location.pathname;
    let roomCode = null;
    if (path.startsWith("/preview/") || path.startsWith("/meeting/")) {
      roomCode = "";
      for (let i = 9; i < path.length; i++) {
        if (path[i] === "/") break;
        roomCode += path[i];
      }
      if (roomCode.trim() === "") roomCode = null;
    }
    return roomCode;
  };

  const code = extractUrlCode();

  const url = getBackendEndpoint() + "get-token";

  const headers = {
    "Content-Type": "application/json",
    subdomain: process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN,
  };

  try {
    const response = await fetchWithRetry(url, {
      method: "post",
      body: JSON.stringify({
        code: code,
        user_id: name,
      }),
      headers,
    });
    const { token } = await response.json();
    return token;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export function getBackendEndpoint() {
  let BASE_BACKEND_URL;
  const baseDomain = window.location.hostname;
  if (baseDomain === "qa2.100ms.live" || process.env.REACT_APP_ENV === "qa") {
    BASE_BACKEND_URL =
      process.env.REACT_APP_QA_BACKEND_API ||
      "https://qa-in.100ms.live/hmsapi/";
  } else if (
    baseDomain === "prod2.100ms.live" ||
    process.env.REACT_APP_ENV === "prod"
  ) {
    BASE_BACKEND_URL =
      process.env.REACT_APP_PROD_BACKEND_API ||
      "https://prod-in.100ms.live/hmsapi/";
  } else {
    BASE_BACKEND_URL =
      process.env.REACT_APP_BACKEND_API || "https://prod-in.100ms.live/hmsapi/";
  }
  return BASE_BACKEND_URL;
}
