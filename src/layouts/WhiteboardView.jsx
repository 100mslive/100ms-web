import React from "react";
import { useMedia } from "react-use";
import { Tldraw } from "@tldraw/tldraw";
import { selectPeers, selectRoomID, useHMSStore } from "@100mslive/react-sdk";
import { Box, Flex, config as cssConfig } from "@100mslive/react-ui";
import { SidePane } from "./screenShareView";
import { useMultiplayerState } from "../plugins/whiteboard/useMultiplayerState";

const Editor = React.memo(({ roomId }) => {
  const events = useMultiplayerState(roomId);

  return (
    <Box
      css={{
        mx: "$4",
        flex: "3 1 0",
        "@lg": {
          flex: "2 1 0",
          "& video": {
            objectFit: "contain",
          },
        },
      }}
    >
      <Box css={{ position: "relative", width: "100%", height: "100%" }}>
        <Tldraw
          autofocus
          disableAssets={true}
          showSponsorLink={false}
          showPages={false}
          showMenu={false}
          {...events}
        />
      </Box>
    </Box>
  );
});

export const WhiteboardView = ({ showStats, isChatOpen, toggleChat }) => {
  // for smaller screen we will show sidebar in bottom
  const mediaQueryLg = cssConfig.media.lg;
  const showSidebarInBottom = useMedia(mediaQueryLg);
  const peers = useHMSStore(selectPeers);
  const roomId = useHMSStore(selectRoomID);
  return (
    <Flex
      css={{
        size: "100%",
      }}
      direction={showSidebarInBottom ? "column" : "row"}
    >
      <Editor roomId={roomId} />
      <Flex
        direction={{ "@initial": "column", "@lg": "row" }}
        css={{
          overflow: "hidden",
          p: "$4",
          flex: "0 0 20%",
          "@lg": {
            flex: "1 1 0",
          },
        }}
      >
        <SidePane
          showSidebarInBottom={showSidebarInBottom}
          showStats={showStats}
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          isPresenterInSmallTiles={true}
          smallTilePeers={peers}
          totalPeers={peers.length}
        />
      </Flex>
    </Flex>
  );
};
