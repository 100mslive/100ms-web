import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Box, Loading } from "@100mslive/react-ui";
import { v4 } from "uuid";
import { AppContext } from "../store/AppContext";
import Preview from "../views/new/Preview";
import getToken from "../services/tokenService";
import { useSearchParam } from "react-use";
import { SKIP_PREVIEW } from "../common/constants";
import { Header } from "../views/new/Header";
import { ErrorDialog } from "../views/new/DialogContent";

const env = process.env.REACT_APP_ENV;
// use this field to join directly for quick testing while in local
const directJoinNoHeadless = false;

const PreviewScreen = ({ getUserToken }) => {
  const history = useHistory();
  const { tokenEndpoint, setIsHeadless } = useContext(AppContext);
  const { roomId: urlRoomId, role: userRole } = useParams(); // from the url
  const [token, setToken] = useState(null);
  const [error, setError] = useState({ title: "", body: "" });
  // skip preview for beam recording and streaming
  const beamInToken = useSearchParam("token") === "beam_recording"; // old format to remove
  let skipPreview = useSearchParam(SKIP_PREVIEW) === "true";
  skipPreview = skipPreview || beamInToken || directJoinNoHeadless;

  useEffect(() => {
    const getTokenFn = !userRole
      ? () => getUserToken(v4())
      : () => getToken(tokenEndpoint, v4(), userRole, urlRoomId);
    getTokenFn()
      .then(token => {
        setToken(token);
      })
      .catch(error => {
        setError(convertPreviewError(error));
      });
  }, [tokenEndpoint, urlRoomId, getUserToken, userRole]);

  const onJoin = () => {
    !directJoinNoHeadless && setIsHeadless(skipPreview);
    let meetingURL = `/meeting/${urlRoomId}`;
    if (userRole) {
      meetingURL += `/${userRole}`;
    }
    history.push(meetingURL);
  };

  if (error.title) {
    return <ErrorDialog title={error.title}>{error.body}</ErrorDialog>;
  }
  return (
    <div className="h-full flex flex-col">
      <Box css={{ h: "$18", "@md": { h: "$17" } }}>
        <Header isPreview={true} />
      </Box>
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
        "We could not find a room corresponding to this link."
      ),
    };
  } else if (error.response && error.response.status === 403) {
    return {
      title: "Accessing room using this link format is disabled",
      body: ErrorWithSupportLink(
        "You can re-enable this from the developer section in Dashboard."
      ),
    };
  } else {
    console.error("Token API Error", error);
    return {
      title: "Error fetching token",
      body: ErrorWithSupportLink(
        "An error occurred while fetching the app token. Please look into logs for more details."
      ),
    };
  }
};

const ErrorWithSupportLink = errorMessage => (
  <div>
    {errorMessage} If you think this is a mistake on our side, please create{" "}
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
