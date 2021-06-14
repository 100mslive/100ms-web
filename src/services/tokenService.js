import axios from 'axios';
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



export async function getUserToken(name) {
  const extractUrlCode = () => {
    const path = window.location.pathname;
    let roomCode = null;
    if (path.startsWith("/preview/") || path.startsWith("/meeting/")) {
      roomCode = "";
      for (let i = 9; i < path.length; i++) {
        if (path[i] === "/") break;
        roomCode += path[i]
      }
      if (roomCode.trim() === "") roomCode = null;
    }
    return roomCode;
  }

  const code = extractUrlCode();
  axios.create({ baseURL: process.env.REACT_APP_BACKEND_API, timeout: 2000 });
  let baseUrl;
  const baseDomain = window.location.hostname;
  if (baseDomain === "qa2.100ms.live") {
    baseUrl = process.env.REACT_APP_QA_BACKEND_API;
  }
  else if (baseDomain === "prod2.100ms.live") {
    baseUrl = process.env.REACT_APP_PROD_BACKEND_API;
  }
  else {
    baseUrl = process.env.REACT_APP_BACKEND_API;
  }
  const url = baseUrl + "get-token"
  var headers = {
    "Content-Type": "application/json",
    "subdomain": process.env.REACT_APP_TOKEN_GENERATION_ENDPOINT_DOMAIN
  };

  let formData = new FormData();
  formData.append('code', code);
  formData.append('user_id', name);
  console.log(formData, url);

  return await axios.post(url, formData, { headers: headers })
    .then((res) => {
      try {
        return res.data.token;
      } catch (err) {
        throw Error(err)
      }
    })
    .catch((err) => {
      console.log(err);
    })
}

export function getBackendEndpoint() {
  let BASE_BACKEND_URL;
  const baseDomain = window.location.hostname;
  if (baseDomain === "qa2.100ms.live") {
    BASE_BACKEND_URL = process.env.REACT_APP_QA_BACKEND_API;
  }
  else if (baseDomain === "prod2.100ms.live") {
    BASE_BACKEND_URL = process.env.REACT_APP_PROD_BACKEND_API;
  }
  else {
    BASE_BACKEND_URL = process.env.REACT_APP_BACKEND_API;
  }
  return BASE_BACKEND_URL;
}
