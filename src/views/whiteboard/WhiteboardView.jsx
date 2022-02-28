import React from "react";
import { Tldraw } from "@tldraw/tldraw";
import { selectPeers, selectRoomID, useHMSStore } from "@100mslive/react-sdk";
import { Box, Flex, config as cssConfig } from "@100mslive/react-ui";
import { SidePane } from "../screenShareView";
import { useMultiplayerState } from "./useMultiplayerState";
import { useMedia } from "react-use";

const Editor = React.memo(({ roomId }) => {
  const {
    metadata: { amIWhiteboardOwner, whiteboardOwner },
    events,
  } = useMultiplayerState(roomId);

  if (!whiteboardOwner) {
    return null;
  }

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
        <Box css={{ position: "absolute", zIndex: 4, p: "$3" }}>
          {amIWhiteboardOwner ? "You are " : `${whiteboardOwner.name} is `} sharing
          whiteboard
        </Box>
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
