import React, { Fragment } from "react";
import { FirstPersonDisplay } from "@100mslive/hms-video-react";
import { Box, Flex, config as cssConfig } from "@100mslive/react-ui";
import { ChatView } from "./chatView";
import { chatStyle } from "../../common/utils";
import VideoList from "../new/VideoList";
import { useMedia } from "react-use";

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
  isChatOpen,
  toggleChat,
  hideSidePane,
  showStatsOnTiles,
}) => {
  const mediaQueryLg = cssConfig.media.md;
  const limitMaxTiles = useMedia(mediaQueryLg);
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
          <VideoList
            showStatsOnTiles={showStatsOnTiles}
            peers={peers}
            maxTileCount={limitMaxTiles ? MAX_TILES_FOR_MOBILE : maxTileCount}
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
      </Box>
      {isChatOpen && hideSidePane && (
        <Flex
          css={{
            height: "45%",
            flex: "0 0 20%",
            zIndex: 40,
            mr: "$4",
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
  showStatsOnTiles,
}) => {
  return (
    <Flex
      direction="column"
      css={{
        flex: "0 0 20%",
        mx: "$4",
        "@lg": {
          flex: "0 0 25%",
        },
        "@md": {
          flex: "1 1 0",
        },
      }}
    >
      <Flex css={{ flex: "1 1 0" }} align="end">
        {peers && peers.length > 0 && (
          <VideoList
            showStatsOnTiles={showStatsOnTiles}
            peers={peers}
            maxColCount={2}
          />
        )}
      </Flex>
      {isChatOpen && (
        <Flex
          align="end"
          css={{
            flex: "1 1 0",
            h: "50%",
            p: "$4",
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
