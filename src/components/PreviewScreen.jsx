import React, { useContext, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSearchParam } from "react-use";
import { v4 } from "uuid";
import { Box, Flex, Loading, styled } from "@100mslive/react-ui";
import Preview from "./Preview";
import { Header } from "./Header";
import { ErrorDialog } from "../primitives/DialogContent";
import { AppContext } from "./context/AppContext";
import { QUERY_PARAM_SKIP_PREVIEW } from "../common/constants";
import getToken from "../services/tokenService";

const env = process.env.REACT_APP_ENV;
// use this field to join directly for quick testing while in local
const directJoinNoHeadless = process.env.REACT_APP_HEADLESS_JOIN === "true";
const PreviewScreen = ({ getUserToken }) => {
  const history = useHistory();
  const { tokenEndpoint, setIsHeadless } = useContext(AppContext);
  const { roomId: urlRoomId, role: userRole } = useParams(); // from the url
  const [token, setToken] = useState(null);
  const [error, setError] = useState({ title: "", body: "" });
  // skip preview for beam recording and streaming
  const beamInToken = useSearchParam("token") === "beam_recording"; // old format to remove
  let skipPreview = useSearchParam(QUERY_PARAM_SKIP_PREVIEW) === "true";
  skipPreview = skipPreview || beamInToken || directJoinNoHeadless;
  let authToken = useSearchParam("auth_token");

  useEffect(() => {
    if (authToken) {
      setToken(authToken);
      return;
    }
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
  }, [tokenEndpoint, urlRoomId, getUserToken, userRole, authToken]);

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
    <Flex direction="column" css={{ size: "100%" }}>
      <Box css={{ h: "$18", "@md": { h: "$17" } }}>
        <Header isPreview={true} />
      </Box>
      <Flex css={{ flex: "1 1 0" }} justify="center" align="center">
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
      </Flex>
    </Flex>
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

const Link = styled("a", {
  color: "#2f80e1",
});

const ErrorWithSupportLink = errorMessage => (
  <div>
    {errorMessage} If you think this is a mistake on our side, please create{" "}
    <Link
      target="_blank"
      href="https://github.com/100mslive/100ms-web/issues"
      rel="noreferrer"
    >
      an issue
    </Link>{" "}
    or reach out over{" "}
    <Link
      target="_blank"
      href="https://discord.com/invite/kGdmszyzq2"
      rel="noreferrer"
    >
      Discord
    </Link>
    .
  </div>
);

export default PreviewScreen;
