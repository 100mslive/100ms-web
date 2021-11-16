import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import {
  Button,
  MessageModal,
  Preview,
  ProgressIcon,
} from "@100mslive/hms-video-react";
import { v4 } from "uuid";
import { AppContext } from "../store/AppContext";
import getToken from "../services/tokenService";
import { convertLoginInfoToJoinConfig } from "../store/appContextUtils";
import { USERNAME_KEY } from "../common/constants";

const PreviewScreen = ({ getUserToken }) => {
  const history = useHistory();
  const context = useContext(AppContext);
  const { loginInfo, setLoginInfo, setMaxTileCount, tokenEndpoint } = context;
  const { roomId: urlRoomId, role: userRole } = useParams();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [error, setError] = useState({
    title: "",
    body: "",
    fatal: false,
    hideLeave: false,
  });
  const urlSearchParams = new URLSearchParams(location.search);
  const skipPreview = urlSearchParams.get("token") === "beam_recording";

  const usernameFromStorage = localStorage.getItem(USERNAME_KEY);

  const tokenErrorBody = (
    <div>
      We could not find the room corresponding to this link. If you think this
      is wrong, please contact us{" "}
      <a
        className="text-blue-standard"
        target="_blank"
        href="https://www.100ms.live/contact"
        rel="noreferrer"
      >
        here
      </a>{" "}
      or join{" "}
      <a
        className="text-blue-standard"
        target="_blank"
        href="https://discord.com/invite/kGdmszyzq2"
        rel="noreferrer"
      >
        our Discord Community
      </a>
    </div>
  );

  useEffect(() => {
    if (skipPreview) {
      join({ audioMuted: true, videoMuted: true, name: "beam" });
      return;
    }
    if (!userRole) {
      getUserToken(v4())
        .then(token => {
          setToken(token);
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setError({
              title: "Room does not exist",
              body: tokenErrorBody,
              fatal: true,
              hideLeave: true,
            });
          } else {
            console.error("Token API Error", error);
            setError({
              title: "Error fetching token",
              body: "An error occurred while fetching token. Please look into logs for more details",
              fatal: true,
            });
          }
        });
    } else {
      getToken(tokenEndpoint, loginInfo.env, v4(), userRole, urlRoomId)
        .then(token => {
          setToken(token);
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setError({
              title: "Room does not exist",
              body: tokenErrorBody,
              fatal: true,
              hideLeave: true,
            });
          } else {
            console.error("Token API Error", error);
            setError({
              title: "Error fetching token",
              body: "An error occurred while fetching token. Please look into logs for more details",
              fatal: true,
            });
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loginInfo.env,
    tokenEndpoint,
    urlRoomId,
    getUserToken,
    userRole,
    skipPreview,
  ]);

  const join = ({ audioMuted, videoMuted, name }) => {
    if (!userRole) {
      getUserToken(name)
        .then(token => {
          setLoginInfo({
            token,
            audioMuted,
            videoMuted,
            roomId: urlRoomId,
            username: name,
          });
          if (userRole) history.push(`/meeting/${urlRoomId}/${userRole}`);
          else history.push(`/meeting/${urlRoomId}`);
        })
        .catch(error => {
          console.log("Token API Error", error);
          setError({
            title: "Unable to join room",
            body: "Please check your internet connection and try again.",
            fatal: false,
          });
        });
    } else {
      getToken(tokenEndpoint, loginInfo.env, name, userRole, urlRoomId)
        .then(token => {
          setLoginInfo({
            token,
            audioMuted,
            videoMuted,
            role: userRole,
            roomId: urlRoomId,
            username: name,
          });
          // send to meeting room now
          if (userRole) history.push(`/meeting/${urlRoomId}/${userRole}`);
          else history.push(`/meeting/${urlRoomId}`);
        })
        .catch(error => {
          console.log("Token API Error", error);
          setError({
            title: "Unable to join room",
            body: "Please check your internet connection and try again.",
            fatal: false,
          });
        });
    }
  };

  const onChange = ({
    selectedVideoInput,
    selectedAudioInput,
    selectedAudioOutput,
    maxTileCount,
  }) => {
    setLoginInfo({
      selectedVideoInput,
      selectedAudioInput,
      selectedAudioOutput,
    });
    setMaxTileCount(maxTileCount);
  };

  const goBack = () => {
    window.location.reload();
  };

  const leaveRoom = () => {
    if (userRole) {
      history.push(`/leave/${urlRoomId}/${userRole}`);
    } else {
      history.push(`/leave/${urlRoomId}`);
    }
  };

  const clearError = () => {
    setError({ title: "", body: "", fatal: false });
  };

  if (error.title && error.fatal) {
    return (
      <MessageModal
        title={error.title}
        body={error.body}
        onClose={leaveRoom}
        footer={!error.hideLeave && <Button onClick={leaveRoom}>Leave</Button>}
      />
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-center h-full items-center">
        {token ? (
          <Preview
            joinOnClick={join}
            goBackOnClick={goBack}
            messageOnClose={goBack}
            onChange={onChange}
            config={convertLoginInfoToJoinConfig({
              role: userRole,
              roomId: urlRoomId,
              token,
              env: loginInfo.env,
              username: usernameFromStorage,
            })}
          />
        ) : (
          <ProgressIcon width="100" height="100" />
        )}
        {error.title && (
          <MessageModal
            title={error.title}
            body={error.body}
            onClose={clearError}
            footer={<Button onClick={clearError}>Dismiss</Button>}
          />
        )}
      </div>
    </div>
  );
};

export default PreviewScreen;
