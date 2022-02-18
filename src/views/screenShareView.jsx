import React, { useCallback, useMemo, Fragment } from "react";
import {
  useHMSStore,
  useHMSActions,
  selectPeers,
  selectLocalPeer,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
  selectScreenShareByPeerID,
} from "@100mslive/react-sdk";
import { VideoPlayer, ScreenShareDisplay } from "@100mslive/hms-video-react";
import { Box, Flex } from "@100mslive/react-ui";
import { ChatView } from "./components/chatView";
import { ROLES } from "../common/roles";
import { chatStyle } from "../common/utils";
import ScreenshareTile from "./new/ScreenshareTile";
import VideoList from "./new/VideoList";
import VideoTile from "./new/VideoTile";

export const ScreenShareView = ({ showStats, isChatOpen, toggleChat }) => {
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const peerPresenting = useHMSStore(selectPeerScreenSharing);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const smallTilePeers = useMemo(
    () => peers.filter(peer => peer.id !== peerPresenting?.id),
    [peers, peerPresenting]
  );

  const amITeacher = localPeer?.roleName.toLowerCase() === ROLES.TEACHER;
  const isPresenterTeacher =
    peerPresenting?.roleName.toLowerCase() === ROLES.TEACHER;
  const amIPresenting = localPeer && localPeer.id === peerPresenting?.id;
  const showPresenterInSmallTile =
    amIPresenting || (amITeacher && isPresenterTeacher);

  if (
    showPresenterInSmallTile &&
    !smallTilePeers.some(peer => peer.id === peerPresenting?.id)
  ) {
    if (amIPresenting) {
      // put presenter on last page
      smallTilePeers.push(peerPresenting);
    } else {
      // put on first page
      smallTilePeers.unshift(peerPresenting);
    }
  }

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
      <ScreenShareComponent
        showStats={showStats}
        amIPresenting={amIPresenting}
        peerPresenting={peerPresenting}
        peerSharingPlaylist={peerSharingPlaylist}
      />
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
          showStats={showStats}
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          peerScreenSharing={peerPresenting}
          isPresenterInSmallTiles={showPresenterInSmallTile}
          smallTilePeers={smallTilePeers}
          totalPeers={peers.length}
        />
      </Flex>
    </Flex>
  );
};

// Sidepane will show the camera stream of the main peer who is screensharing
// and both camera + screen(if applicable) of others
export const SidePane = ({
  showStats,
  isChatOpen,
  toggleChat,
  isPresenterInSmallTiles,
  peerScreenSharing, // the peer who is screensharing
  smallTilePeers,
  totalPeers,
}) => {
  // The main peer's screenshare is already being shown in center view
  const shouldShowScreenFn = useCallback(
    peer => peerScreenSharing && peer.id !== peerScreenSharing.id,
    [peerScreenSharing]
  );
  return (
    <Fragment>
      {!isPresenterInSmallTiles && (
        <LargeTilePeerView
          peerScreenSharing={peerScreenSharing}
          isChatOpen={isChatOpen}
          showStatsOnTiles={showStats}
        />
      )}
      <SmallTilePeersView
        isChatOpen={isChatOpen}
        smallTilePeers={smallTilePeers}
        shouldShowScreenFn={shouldShowScreenFn}
        showStatsOnTiles={showStats}
      />
      <CustomChatView
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        totalPeers={totalPeers}
      />
    </Fragment>
  );
};

const ScreenShareComponent = ({
  showStats,
  amIPresenting,
  peerPresenting,
  peerSharingPlaylist,
}) => {
  const hmsActions = useHMSActions();
  const screenshareTrack = useHMSStore(
    selectScreenShareByPeerID(peerPresenting?.id)
  );

  if (peerSharingPlaylist) {
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
        <VideoPlayer peer={peerSharingPlaylist} />
      </Box>
    );
  }

  return (
    <Box
      css={{
        flex: "3 1 0",
        mx: "$4",
        ml: "$5",
        "@lg": { ml: "$4" },
      }}
    >
      {peerPresenting &&
        (amIPresenting &&
        !["browser", "window", "application"].includes(
          screenshareTrack?.displaySurface
        ) ? (
          <div className="object-contain h-full">
            <ScreenShareDisplay
              stopScreenShare={async () => {
                await hmsActions.setScreenShareEnabled(false);
              }}
              classes={{ rootBg: "h-full" }}
            />
          </div>
        ) : (
          <ScreenshareTile
            showStatsOnTiles={showStats}
            peerId={peerPresenting?.id}
          />
        ))}
    </Box>
  );
};

const CustomChatView = ({ isChatOpen, toggleChat, totalPeers }) => {
  return (
    isChatOpen && (
      <Box
        css={{
          h: "45%",
          flexShrink: 0,
          "@md": chatStyle,
          "@ls": {
            position: "absolute",
            top: 0,
            h: "100%",
            minHeight: 300,
            zIndex: 40,
          },
        }}
      >
        <ChatView toggleChat={toggleChat} />
      </Box>
    )
  );
};

const SmallTilePeersView = ({
  smallTilePeers,
  shouldShowScreenFn,
  showStatsOnTiles,
}) => {
  return (
    <Flex
      css={{
        flex: "2 1 0",
      }}
    >
      {smallTilePeers && smallTilePeers.length > 0 && (
        <VideoList
          peers={smallTilePeers}
          maxColCount={2}
          includeScreenShareForPeer={shouldShowScreenFn}
          showStatsOnTiles={showStatsOnTiles}
        />
      )}
    </Flex>
  );
};

const LargeTilePeerView = ({ peerScreenSharing, showStatsOnTiles }) => {
  return peerScreenSharing ? (
    <Box
      css={{
        flex: "1 1 0",
        minHeight: "25%",
        py: "$4",
        "@lg": {
          mr: "$4",
          minHeight: "unset",
          py: 0,
        },
        "@sm": {
          height: "100%",
          maxHeight: "75%",
          alignSelf: "center",
        },
      }}
    >
      <VideoTile
        showStatsOnTiles={showStatsOnTiles}
        width="100%"
        height="100%"
        peerId={peerScreenSharing.id}
      />
    </Box>
  ) : null;
};
