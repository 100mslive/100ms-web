import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AppContext } from "../store/AppContext";

export const BotMode = () => {
    const history = useHistory();
    var { env, roomId, role } = useParams();
    const { setLoginInfo } = useContext(AppContext);
    role = role.toLowerCase()
    if (!env || !roomId) {
        history.push("/")
    }
    const username = "100ms-Beam-Bot"
    getToken(username, role, roomId, env)
        .then((token) => {
            setLoginInfo({
                token: token,
                username: username,
                role: role,
                roomId: roomId,
                endpoint: init(env),
                audioMuted: true,
                videoMuted: true,
                selectedVideoOutput: 'default',
                selectedAudioInput: 'default',
                selectedAudioOutput: 'default'
            })
            history.push(`/meeting/${roomId}/${role}`);
        })
        .catch((error) => {
            console.log("Token API Error", error);
            alert("Unable to generate token");
        });

    return (
        <div>
            Loading... Please wait
        </div>
    );
};

const tokenEndpoint = {
    "prod":"https://100ms-services.vercel.app/api/token",
    "qa":"https://100ms-services.vercel.app/api/token",
}

const init = (env)=>{
    return "https://"+env + "-init.100ms.live/init"
}


async function getToken(userId, role, roomId, env) {
    console.log("in otken",userId, role, roomId, env);
    console.log("in token",tokenEndpoint[env]);
    const response = await fetch(
        tokenEndpoint[env],
      {
        method: "POST",
        //TODO remove env
        body: JSON.stringify({
          env: env + "-in",
          role: role,
          room_id: roomId,
          user_id: userId
        })
      }
    );
  
    const { token } = await response.json();
  
    return token;
  }
  