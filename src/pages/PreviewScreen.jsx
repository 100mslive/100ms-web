import React, { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Preview } from "@100mslive/hms-video-react";
import { AppContext } from "../store/AppContext";
import getToken from "../services/tokenService";

const PreviewScreen = () => {
  const history = useHistory();
  const context = useContext(AppContext);
  const { loginInfo, setLoginInfo, setMaxTileCount } = context;
  const { roomId: urlRoomId } = useParams();

  const join = ({audioMuted, videoMuted}) => {
      getToken(loginInfo.userId, loginInfo.role, loginInfo.roomId, loginInfo.endpoint)
          .then((token) => {
              setLoginInfo({ token , audioMuted, videoMuted});
              // send to meeting room now
              history.push(`/meeting/${loginInfo.roomId}`);
          })
          .catch((error) => {
              console.log("Token API Error", error);
          });
  };

  const onChange = ({selectedVideoInput, selectedAudioInput, selectedAudioOutput, maxTileCount}) => {
    console.debug("app: Selected Video Input", selectedVideoInput);
    console.debug("app: Selected Audio Input", selectedVideoInput);
    console.debug("app: Selected Audio Output", selectedAudioOutput);
    setLoginInfo({selectedVideoInput, selectedAudioInput, selectedAudioOutput});
    setMaxTileCount(maxTileCount);
  }

  const goBack = () => {
    history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
  };

  useEffect(() => {
    if (loginInfo.userId === "")
      history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
    // eslint-disable-next-line
  }, [loginInfo.userId]);

  return loginInfo.userId ? (
    <div>
      <div className="flex justify-center items-center">
        <Preview
          name={loginInfo.userId}
          joinOnClick={join}
          goBackOnClick={goBack}
          messageOnClose={goBack}
          onChange={onChange}
        />
      </div>
    </div>
  ) : null;
};

export default PreviewScreen;
