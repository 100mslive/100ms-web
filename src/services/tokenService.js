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

export async function getUserToken(name) {
  const extractUrlCode = () => {
    const path = window.location.pathname;
    const regex = /(\/streaming)?\/(preview|meeting)\/(?<code>[^/]+)/;
    return path.match(regex)?.groups?.code || null;
  };

  const code = extractUrlCode();

  const url = getBackendEndpoint() + "get-token";

  const headers = {
    "Content-Type": "application/json",
    subdomain: process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN,
  };

  const response = await fetchWithRetry(url, {
    method: "post",
    body: JSON.stringify({
      code: code,
      user_id: name,
    }),
    headers,
  });

  if (!response.ok) {
    let error = new Error("Request failed!");
    error.response = response;
    throw error;
  }

  const { token } = await response.json();
  return token;
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
    const env = process.env.REACT_APP_ENV || "prod";
    const apiBasePath = `https://${env}-in2.100ms.live/hmsapi/`;
    BASE_BACKEND_URL = apiBasePath || "https://prod-in.100ms.live/hmsapi/";
  }
  return BASE_BACKEND_URL;
}
