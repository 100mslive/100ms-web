import React, { useContext, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Preview } from "@100mslive/hms-video-react";
import { AppContext } from "../store/AppContext";
import getToken from "../services/tokenService";

const PreviewScreen = (props) => {
  const history = useHistory();
  const userId = "dummy-name";
  const context = useContext(AppContext);
  const { loginInfo, setLoginInfo, setMaxTileCount, tokenEndpoint } = context;
  const { roomId: urlRoomId, role: userRole } = useParams();
  const location = useLocation();

  useEffect(() => {
    const isPreview = location.pathname.startsWith('/preview');
    if (!urlRoomId || !userRole) {
      history.push(`/`);
    }
    else if ((isPreview && urlRoomId === "preview") || urlRoomId === 'meeting' || urlRoomId === "leave") {
      history.push(`/`);
    }
    else if (!isPreview) {
      history.push(`/preview/${urlRoomId}/${userRole}`);
    }
    // eslint-disable-next-line
  }, [])


  const join = ({ audioMuted, videoMuted }) => {
    getToken(tokenEndpoint, userId, userRole, urlRoomId)
      .then((token) => {
        setLoginInfo({ token, audioMuted, videoMuted, role: userRole, roomId: urlRoomId });
        // send to meeting room now
        history.push(`/meeting/${urlRoomId}/${userRole}`);
      })
      .catch((error) => {
        console.log("Token API Error", error);
      });
  };

  const onChange = ({
    selectedVideoInput,
    selectedAudioInput,
    selectedAudioOutput,
    maxTileCount,
  }) => {
    console.debug("app: Selected Video Input", selectedVideoInput);
    console.debug("app: Selected Audio Input", selectedVideoInput);
    console.debug("app: Selected Audio Output", selectedAudioOutput);
    setLoginInfo({
      selectedVideoInput,
      selectedAudioInput,
      selectedAudioOutput,
    });
    setMaxTileCount(maxTileCount);
  };

  const goBack = () => {
    history.push(`/${loginInfo.roomId || ""}`);
  };

  // useEffect(() => {
  //   if (loginInfo.username === "")
  //     history.push(`/${loginInfo.roomId || urlRoomId || ""}`);
  //   // eslint-disable-next-line
  // }, [loginInfo.username]);

  return (
    <div>
      <div className="flex justify-center items-center">
        <Preview
          name={userId}
          joinOnClick={join}
          goBackOnClick={goBack}
          messageOnClose={goBack}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default PreviewScreen;
