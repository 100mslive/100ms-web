import React, { Fragment } from "react";
import { VideoList, FirstPersonDisplay } from "@100mslive/hms-video-react";
import { Box, Flex } from "@100mslive/react-ui";
import { ChatView } from "./chatView";
import { useWindowSize } from "../hooks/useWindowSize";
import { chatStyle, getBlurClass } from "../../common/utils";
import { HmsVideoList } from "../UIComponents";
import { FeatureFlags } from "../../store/FeatureFlags";

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
  showStatsOnTiles,
  videoTileProps = () => ({}),
}) => {
  const { width } = useWindowSize();
  const isMobile = width < 760;
  const rowCount = width < 760 ? 1 : undefined;
  return (
    <Fragment>
      <Box
        css={{
          flex: "1 1 0",
          height: "100%",
          "@md": { flex: "2 1 0" },
        }}
      >
        {peers && peers.length > 0 ? (
          FeatureFlags.enableNewComponents ? (
            <HmsVideoList
              showStatsOnTiles={showStatsOnTiles}
              peers={peers}
              maxTileCount={isMobile ? MAX_TILES_FOR_MOBILE : maxTileCount}
            />
          ) : (
            <VideoList
              peers={peers}
              classes={{
                root: "",
                videoTileContainer: `rounded-lg ${isMobile ? "p-0 mr-2" : ""}`,
              }}
              maxTileCount={isMobile ? MAX_TILES_FOR_MOBILE : maxTileCount}
              maxColCount={2}
              maxRowCount={rowCount}
              compact={peers.length > 2}
              // show stats for upto 2 peers in sidepane
              videoTileProps={videoTileProps}
            />
          )
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
      </Box>
      {isChatOpen && hideSidePane && (
        <Flex
          className={`${getBlurClass(isParticipantListOpen, totalPeers)}`}
          css={{
            height: "45%",
            flex: "0 0 20%",
            zIndex: 40,
            mr: "$2",
            alignSelf: "flex-end",
            "@md": chatStyle,
            "@ls": {
              minHeight: "100%", // no sidepeer tiles will be present
              bottom: "$7",
            },
          }}
        >
          <ChatView toggleChat={toggleChat} />
        </Flex>
      )}
    </Fragment>
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
  const { width } = useWindowSize();
  let rows = undefined;
  if (width < 768) {
    rows = 2;
  } else if (width === 768) {
    rows = 1;
  }

  return (
    <Flex
      direction="column"
      css={{
        flex: "0 0 20%",
        mx: "$2",
        "@lg": {
          flex: "1 1 0",
        },
      }}
    >
      <Flex css={{ flex: "1 1 0" }} align="end">
        {peers && peers.length > 0 && (
          <VideoList
            peers={peers}
            classes={{
              root: "",
              videoTileContainer: `rounded-lg ${
                width <= 768 ? "p-0 mr-2" : ""
              }`,
            }}
            maxColCount={2}
            maxRowCount={rows}
            compact={peers.length > 2}
            // show stats for upto 2 peers in sidepane
            videoTileProps={videoTileProps}
          />
        )}
      </Flex>
      {isChatOpen && (
        <Flex
          className={`${getBlurClass(isParticipantListOpen, totalPeers)}`}
          align="end"
          css={{
            flex: "1 1 0",
            h: "50%",
            p: "$2",
            "@md": chatStyle,
            "@ls": {
              ...chatStyle,
              minHeight: "85%",
            },
          }}
        >
          <ChatView toggleChat={toggleChat} />
        </Flex>
      )}
    </Flex>
  );
};
