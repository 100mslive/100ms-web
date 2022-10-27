import React, { Fragment } from "react";
import { useMedia } from "react-use";
import { Box, config as cssConfig, Flex } from "@100mslive/react-ui";
import { FirstPersonDisplay } from "./FirstPersonDisplay";
import { Image } from "./Image";
import VideoList from "./VideoList";

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
export const GridCenterView = ({ peers, maxTileCount }) => {
  const mediaQueryLg = cssConfig.media.md;
  const limitMaxTiles = useMedia(mediaQueryLg);
  return (
    <Fragment>
      <Box
        css={{
          flex: "1 1 0",
          height: "100%",
          mx: "$8",
          "@md": { flex: "2 1 0" },
        }}
      >
        {peers && peers.length > 0 ? (
          <VideoList
            peers={peers}
            maxTileCount={limitMaxTiles ? MAX_TILES_FOR_MOBILE : maxTileCount}
          />
        ) : eventRoomIDs.some(id => window.location.href.includes(id)) ? (
          <Box
            css={{
              display: "grid",
              placeItems: "center",
              size: "100%",
              p: "$12",
            }}
          >
            <a href={webinarInfoLink} target="_blank" rel="noreferrer">
              <Image
                css={{ p: "$4", boxShadow: "$sm" }}
                alt="Event template"
                src={eventsImg}
              />
            </a>
          </Box>
        ) : (
          <FirstPersonDisplay />
        )}
      </Box>
    </Fragment>
  );
};

// Side pane shows smaller tiles
export const GridSidePaneView = ({ peers }) => {
  return (
    <Flex
      direction="column"
      css={{
        flex: "0 0 20%",
        mx: "$8",
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
          <VideoList peers={peers} maxColCount={2} />
        )}
      </Flex>
    </Flex>
  );
};
