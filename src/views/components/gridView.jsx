import React from "react";
import {
  VideoList,
  FirstPersonDisplay,
  isMobileDevice,
} from "@100mslive/hms-video-react";
import { Box, Flex } from "@100mslive/react-ui";
import { ChatView } from "./chatView";
import { chatStyle, getBlurClass } from "../../common/utils";

const MAX_TILES_FOR_MOBILE = 4;

/**
 * the below variables are for showing webinar etc. related image if required on certain meeting urls
 */
const webinarProps = JSON.parse(process.env.REACT_APP_WEBINAR_PROPS || "{}");
const eventRoomIDs = webinarProps?.ROOM_IDS || [];
const eventsImg = webinarProps?.IMAGE_FILE || ""; // the image to show in center
// the link to navigate to when user clicks on the image
const webinarInfoLink = webinarProps?.LINK_HREF || "https://100ms.live/";

// The center of the screen shows bigger tiles
export const GridCenterView = ({
  peers,
  maxTileCount,
  allowRemoteMute,
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
  hideSidePane,
  totalPeers,
  videoTileProps = () => ({}),
}) => {
  return (
    <Box
      css={{
        flex: "1 1 0%",
        height: "100%",
      }}
    >
      {peers && peers.length > 0 ? (
        <VideoList
          peers={peers}
          classes={{
            videoTileContainer: "rounded-lg",
          }}
          maxTileCount={isMobileDevice() ? MAX_TILES_FOR_MOBILE : maxTileCount}
          allowRemoteMute={allowRemoteMute}
          videoTileProps={videoTileProps}
        />
      ) : eventRoomIDs.some(id => window.location.href.includes(id)) ? (
        <div className="h-full w-full grid place-items-center p-5">
          <a href={webinarInfoLink} target="_blank" rel="noreferrer">
            <img
              className="w-full rounded-lg shadow-lg p-2"
              alt=""
              src={eventsImg}
            />
          </a>
        </div>
      ) : (
        <FirstPersonDisplay classes={{ rootBg: "h-full" }} />
      )}
      {isChatOpen && hideSidePane && (
        <Box
          className={`${getBlurClass(isParticipantListOpen, totalPeers)}`}
          css={{
            height: "45%",
            position: "absolute",
            zIndex: 40,
            right: "$2",
            bottom: "$9",
            "@md": chatStyle,
            "@ls": {
              minHeight: "70%",
              bottom: "$7",
            },
          }}
        >
          <ChatView toggleChat={toggleChat} />
        </Box>
      )}
    </Box>
  );
};

// Side pane shows smaller tiles
export const GridSidePaneView = ({
  peers,
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
  totalPeers,
  videoTileProps = () => ({}),
}) => {
  const isMobile = isMobileDevice();
  const rowCount = isMobile ? 1 : undefined;

  return (
    <Box
      css={{
        display: "flex",
        flexDirection: "column",
        width: "20%",
        height: "100%",
        "@lg": { width: "30%" },
        "@md": { width: "100%", height: "25%" },
      }}
    >
      <Flex css={{ flex: "1 1 0%" }} align="end">
        {peers && peers.length > 0 && (
          <VideoList
            peers={peers}
            classes={{
              root: "",
              videoTileContainer: `rounded-lg ${isMobile ? "p-0 mr-2" : ""}`,
            }}
            maxColCount={2}
            maxRowCount={rowCount}
            compact={peers.length > 2}
            // show stats for upto 2 peers in sidepane
            videoTileProps={videoTileProps}
          />
        )}
      </Flex>
      {isChatOpen && (
        <Box
          className={`${getBlurClass(isParticipantListOpen, totalPeers)}`}
          css={{
            display: "flex",
            height: "50%",
            alignItems: "flex-end",
            p: "$2",
            "@md": chatStyle,
            "@ls": {
              ...chatStyle,
              minHeight: "85%",
            },
          }}
        >
          <ChatView toggleChat={toggleChat} />
        </Box>
      )}
    </Box>
  );
};
