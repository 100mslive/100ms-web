import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { MessageModal } from "@100mslive/hms-video-react";
import { Loading } from "@100mslive/react-ui";
import { v4 } from "uuid";
import { AppContext } from "../store/AppContext";
import PeerlistPreview from "../views/components/PeerlistPreview";
import Preview from "../views/new/Preview";
import getToken from "../services/tokenService";
import { useSearchParam } from "react-use";
import { SKIP_PREVIEW } from "../common/constants";

const env = process.env.REACT_APP_ENV;

const PreviewScreen = ({ getUserToken }) => {
  const history = useHistory();
  const { tokenEndpoint, setIsHeadless } = useContext(AppContext);
  const { roomId: urlRoomId, role: userRole } = useParams(); // from the url
  const [token, setToken] = useState(null);
  const [error, setError] = useState({ title: "", body: "" });
  // skip preview for beam recording and streaming
  const beamInToken = useSearchParam("token") === "beam_recording"; // old format to remove
  let skipPreview = useSearchParam(SKIP_PREVIEW) === "true";
  skipPreview = skipPreview || beamInToken;

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
        setError(convertPreviewError(error));
      });
  }, [tokenEndpoint, urlRoomId, getUserToken, userRole]);

  const onJoin = () => {
    setIsHeadless(skipPreview);
    let meetingURL = `/meeting/${urlRoomId}`;
    if (userRole) {
      meetingURL += `/${userRole}`;
    }
    history.push(meetingURL);
  };

  const leaveRoom = () => {
    let leaveURL = `/leave/${urlRoomId}`;
    if (userRole) {
      leaveURL += `/${userRole}`;
    }
    history.push(leaveURL);
  };

  if (error.title) {
    return (
      <MessageModal title={error.title} body={error.body} onClose={leaveRoom} />
    );
  }
  return (
    <div className="h-full flex flex-col">
      <PeerlistPreview />
      <div className="flex flex-col justify-center h-full items-center">
        {token ? (
          <>
            <Preview
              initialName={skipPreview ? "Beam" : ""}
              skipPreview={skipPreview}
              env={env}
              onJoin={onJoin}
              token={token}
            />
          </>
        ) : (
          <Loading size={100} />
        )}
      </div>
    </div>
  );
};

const convertPreviewError = error => {
  console.error("[error]", { error });
  if (error.response && error.response.status === 404) {
    return {
      title: "Room does not exist",
      body: ErrorWithSupportLink(
        "We could not find the room corresponding to this link."
      ),
    };
  } else if (error.response && error.response.status === 403) {
    return {
      title: "Accessing room using this link format is disabled",
      body: ErrorWithSupportLink(""),
    };
  } else {
    console.error("Token API Error", error);
    return {
      title: "Error fetching token",
      body: "An error occurred while fetching token. Please look into logs for more details",
    };
  }
};

const ErrorWithSupportLink = errorMessage => (
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

export default PreviewScreen;
