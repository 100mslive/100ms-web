import React, { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Preview } from "@100mslive/sdk-components";
import { AppContext } from "../store/AppContext";
import getToken from "../utlis/index";

const PreviewScreen = () => {
  const history = useHistory();
  const context = useContext(AppContext);
  const { loginInfo, setLoginInfo } = context;
  const { roomId: urlRoomId } = useParams();

  const join = ({ audioMuted = false, videoMuted = false }) => {
    getToken(loginInfo.username, loginInfo.role, loginInfo.roomId)
      .then((token) => {
        setLoginInfo({ token, audioMuted, videoMuted });
        history.push(`/meeting/${loginInfo.roomId}`);
      })
      .catch((error) => {
        console.log("Token API Error", error);
        alert("Unable to generate token");
      });
  };

  const goBack = () => {
    history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
  };

  useEffect(() => {
    if (loginInfo.username === "")
      history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
    // eslint-disable-next-line
  }, [loginInfo.username]);

  return loginInfo.username ? (
    <div>
      <div className="flex justify-center items-center">
        <Preview
          name={loginInfo.username}
          joinOnClick={join}
          goBackOnClick={goBack}
          messageOnClose={goBack}
        />
      </div>
    </div>
  ) : null;
};

export default PreviewScreen;
