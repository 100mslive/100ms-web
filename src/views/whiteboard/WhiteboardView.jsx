import React from "react";
import { Tldraw } from "@tldraw/tldraw";
import { selectPeers, selectRoomID, useHMSStore } from "@100mslive/react-sdk";
import { Box, Flex } from "@100mslive/react-ui";
import { SidePane } from "../screenShareView";
import { useMultiplayerState } from "./useMultiplayerState";

const Editor = React.memo(({ roomId }) => {
  const { error, ...events } = useMultiplayerState(roomId);

  return (
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
  );
});

export const WhiteboardView = ({ isChatOpen, toggleChat }) => {
  const peers = useHMSStore(selectPeers);
  const roomId = useHMSStore(selectRoomID);
  return (
    <Flex
      css={{
        size: "100%",
      }}
      direction={{
        "@initial": "row",
        "@lg": "column",
      }}
    >
      <Editor roomId={roomId} />
      <Flex
        direction={{ "@initial": "column", "@lg": "row" }}
        css={{
          overflow: "hidden",
          p: "$2",
          flex: "0 0 20%",
          "@lg": {
            flex: "1 1 0",
          },
        }}
      >
        <SidePane
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
