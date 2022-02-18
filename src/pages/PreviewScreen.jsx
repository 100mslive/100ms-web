import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { MessageModal } from "@100mslive/hms-video-react";
import { Loading, Button } from "@100mslive/react-ui";
import { v4 } from "uuid";
import { AppContext } from "../store/AppContext";
import PeerlistPreview from "../views/components/PeerlistPreview";
import Preview from "../views/new/Preview";
import getToken from "../services/tokenService";

const PreviewScreen = ({ getUserToken }) => {
  const history = useHistory();
  const context = useContext(AppContext);
  const { loginInfo, tokenEndpoint, setLoginInfo } = context;
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

  useEffect(() => {
    const getTokenFn = !userRole
      ? () => getUserToken(v4())
      : () => getToken(tokenEndpoint, v4(), userRole, urlRoomId);
    getTokenFn()
      .then(token => {
        console.log({ token });
        setToken(token);
      })
      .catch(error => {
        setError(convertError(error));
      });
  }, [tokenEndpoint, urlRoomId, getUserToken, userRole]);

  const onJoin = () => {
    setLoginInfo({ isHeadlessMode: skipPreview });
    if (userRole) {
      history.push(`/meeting/${urlRoomId}/${userRole}`);
    } else {
      history.push(`/meeting/${urlRoomId}`);
    }
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
    <>
      <div className="h-full flex flex-col">
        <PeerlistPreview />
        <div className="flex flex-col justify-center h-full items-center">
          {token ? (
            <>
              <Preview
                initialName={skipPreview ? "Beam" : ""}
                skipPreview={skipPreview}
                env={loginInfo.env}
                onJoin={onJoin}
                token={token}
              />
            </>
          ) : (
            <Loading size={100} />
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
      <div className="flex flex-col justify-center h-full items-center bg-red-400">
        {token ? (
          <>
            <Preview
              skipPreview={skipPreview}
              env={loginInfo.env}
              onJoin={onJoin}
              token={token}
            />
          </>
        ) : (
          <Loading size={100} />
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
    </>
  );
};

const tokenErrorBody = errorMessage => (
  <div>
    {errorMessage} If you think this is a mistake, please create{" "}
    <a
      className="text-blue-standard"
      target="_blank"
      href="https://github.com/100mslive/100ms-web/issues"
      rel="noreferrer"
    >
      an issue
    </a>{" "}
    or reach out over{" "}
    <a
      className="text-blue-standard"
      target="_blank"
      href="https://discord.com/invite/kGdmszyzq2"
      rel="noreferrer"
    >
      Discord
    </a>
    .
  </div>
);

const convertError = error => {
  console.log("[error]", { error });
  if (error.response && error.response.status === 404) {
    return {
      title: "Room does not exist",
      body: tokenErrorBody(
        "We could not find the room corresponding to this link."
      ),
      fatal: true,
      hideLeave: true,
    };
  } else if (error.response && error.response.status === 403) {
    return {
      title: "Accessing room using this link format is disabled",
      body: tokenErrorBody(""),
      fatal: true,
      hideLeave: true,
    };
  } else {
    console.error("Token API Error", error);
    return {
      title: "Error fetching token",
      body: "An error occurred while fetching token. Please look into logs for more details",
      fatal: true,
    };
  }
};

export default PreviewScreen;
