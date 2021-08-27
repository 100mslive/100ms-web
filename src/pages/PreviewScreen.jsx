import React, { useContext } from "react";
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
import { useState } from "react";
import { useEffect } from "react";
import { Notifications } from "../views/components/notifications/Notifications";

const PreviewScreen = ({ getUserToken }) => {
  const history = useHistory();
  const context = useContext(AppContext);
  const { loginInfo, setLoginInfo, setMaxTileCount, tokenEndpoint } = context;
  const { roomId: urlRoomId, role: userRole } = useParams();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [error, setError] = useState({
    title: "",
    body: "",
    fatal: false,
  });

  useEffect(() => {
    if (!userRole) {
      getUserToken(v4())
        .then(token => setToken(token))
        .catch(error => {
          console.error("Token API Error", error);
          setError({
            title: "Error fetching token",
            body: "An error occurred while fetching token. Please look into logs for more details",
            fatal: true,
          });
        });
    } else {
      getToken(tokenEndpoint, loginInfo.env, v4(), userRole, urlRoomId)
        .then(token => setToken(token))
        .catch(error => {
          console.error("Token API Error", error);
          setError({
            title: "Error fetching token",
            body: "An error occurred while fetching token. Please look into logs for more details",
            fatal: true,
          });
        });
    }
  }, [loginInfo.env, tokenEndpoint, urlRoomId, getUserToken, userRole]);

  const join = ({ audioMuted, videoMuted, name }) => {
    if (!userRole) {
      getUserToken(name)
        .then(() => {
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
        .then(() => {
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
    window.location.reload();
  };

  const leaveRoom = () => {
    history.push(`/leave/${urlRoomId}/${userRole}`);
  };

  const clearError = () => {
    setError({ title: "", body: "", fatal: false });
  };

  const isPreview = location.pathname.startsWith("/preview");
  // for beam recording
  const urlSearchParams = new URLSearchParams(window.location.search);
  const skipPreview = urlSearchParams.get("token") === "beam_recording";

  if (error.title && error.fatal) {
    return (
      <MessageModal
        title={error.title}
        body={error.body}
        onClose={leaveRoom}
        footer={<Button onClick={leaveRoom}>Leave</Button>}
      />
    );
  }

  if (!urlRoomId) {
    history.push(`/`);
  } else if (
    (isPreview && urlRoomId === "preview") ||
    urlRoomId === "meeting" ||
    urlRoomId === "leave"
  ) {
    history.push(`/`);
  } else if (!isPreview) {
    if (userRole) history.push(`/preview/${urlRoomId}/${userRole}`);
    else history.push(`/preview/${urlRoomId}`);
  } else if (skipPreview) {
    join({ audioMuted: true, videoMuted: true, name: "beam" });
  } else {
    if (
      urlRoomId === "preview" ||
      urlRoomId === "meeting" ||
      urlRoomId === "leave"
    ) {
      history.push(`/`);
    } else if (!isPreview) {
      history.push(`/preview/${urlRoomId}`);
    } else {
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
            <Notifications />
          </div>
        </div>
      );
    }
  }

  return null;
};

export default PreviewScreen;
