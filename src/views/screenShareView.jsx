import React, { useCallback, useMemo } from "react";
import {
  useHMSStore,
  useHMSActions,
  VideoList,
  VideoTile,
  selectPeers,
  selectLocalPeer,
  selectPeerScreenSharing,
  ScreenShareDisplay,
  selectPeerSharingVideoPlaylist,
  VideoPlayer,
  selectScreenShareByPeerID,
} from "@100mslive/hms-video-react";
import { Box, Flex } from "@100mslive/react-ui";
import { ChatView } from "./components/chatView";
import { ROLES } from "../common/roles";
import { chatStyle, getBlurClass } from "../common/utils";

export const ScreenShareView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
  videoTileProps = () => ({}),
}) => {
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
    <React.Fragment>
      <Flex
        css={{
          size: "100%",
        }}
        direction={{
          "@initial": "row",
          "@md": "column",
        }}
      >
        <ScreenShareComponent
          amIPresenting={amIPresenting}
          peerPresenting={peerPresenting}
          peerSharingPlaylist={peerSharingPlaylist}
          videoTileProps={videoTileProps}
        />
        <Flex
          css={{
            flexWrap: "wrap",
            overflow: "hidden",
            p: "$2",
            width: "20%",
            height: "100%",
            "@md": { height: "30%", width: "100%" },
          }}
        >
          <SidePane
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            peerScreenSharing={peerPresenting}
            isPresenterInSmallTiles={showPresenterInSmallTile}
            smallTilePeers={smallTilePeers}
            isParticipantListOpen={isParticipantListOpen}
            totalPeers={peers.length}
            videoTileProps={videoTileProps}
          />
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

// Sidepane will show the camera stream of the main peer who is screensharing
// and both camera + screen(if applicable) of others
export const SidePane = ({
  isChatOpen,
  toggleChat,
  isPresenterInSmallTiles,
  peerScreenSharing, // the peer who is screensharing
  smallTilePeers,
  isParticipantListOpen,
  totalPeers,
  videoTileProps = () => ({}),
}) => {
  // The main peer's screenshare is already being shown in center view
  const shouldShowScreenFn = useCallback(
    peer => peerScreenSharing && peer.id !== peerScreenSharing.id,
    [peerScreenSharing]
  );

  return (
    <Box css={{ size: "100%", position: "relative" }}>
      <Flex
        css={{ size: "100%" }}
        direction={{ "@initial": "column", "@md": "row" }}
      >
        {!isPresenterInSmallTiles && (
          <LargeTilePeerView
            peerScreenSharing={peerScreenSharing}
            isChatOpen={isChatOpen}
            videoTileProps={videoTileProps}
          />
        )}
        <SmallTilePeersView
          isChatOpen={isChatOpen}
          smallTilePeers={smallTilePeers}
          shouldShowScreenFn={shouldShowScreenFn}
          videoTileProps={videoTileProps}
        />
        <CustomChatView
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          isParticipantListOpen={isParticipantListOpen}
          totalPeers={totalPeers}
        />
      </Flex>
    </Box>
  );
};

const ScreenShareComponent = ({
  amIPresenting,
  peerPresenting,
  peerSharingPlaylist,
  videoTileProps = () => ({}),
}) => {
  const hmsActions = useHMSActions();
  const screenshareTrack = useHMSStore(
    selectScreenShareByPeerID(peerPresenting?.id)
  );

  if (peerSharingPlaylist) {
    return (
      <Box css={{ mx: "$2", flex: "1 1 0%" }}>
        <VideoPlayer peer={peerSharingPlaylist} />
      </Box>
    );
  }

  return (
    <Box
      css={{
        flex: "1 1 0%",
        mx: "$2",
        ml: "$3",
        "@md": { ml: "$2" },
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
          <VideoTile
            peer={peerPresenting}
            showScreen={true}
            objectFit="contain"
            hmsVideoTrackId={screenshareTrack?.id}
            {...videoTileProps(peerPresenting, screenshareTrack)}
          />
        ))}
    </Box>
  );
};

const CustomChatView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
  totalPeers,
}) => {
  return (
    isChatOpen && (
      <Box
        className={getBlurClass(isParticipantListOpen, totalPeers)}
        css={{
          height: "45%",
          flexShrink: 0,
          "@md": chatStyle,
          "@ls": {
            position: "absolute",
            top: 0,
            height: "100%",
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
  isChatOpen,
  smallTilePeers,
  shouldShowScreenFn,
  videoTileProps = () => ({}),
}) => {
  return (
    <Flex
      css={{
        width: "100%",
        flex: "1 1 0%",
        "@md": {
          width: "50%",
        },
      }}
    >
      {smallTilePeers && smallTilePeers.length > 0 && (
        <VideoList
          peers={smallTilePeers}
          showScreenFn={shouldShowScreenFn}
          classes={{ videoTileContainer: "rounded-lg " }}
          maxColCount={2}
          overflow="scroll-x"
          compact={true}
          // dont show stats for small tiles during screenshare
          videoTileProps={videoTileProps}
        />
      )}
    </Flex>
  );
};

const LargeTilePeerView = ({
  peerScreenSharing,
  videoTileProps = () => ({}),
}) => {
  return (
    <Box
      css={{
        width: "100%",
        height: "35%",
        "@md": { width: "50%", height: "100%", p: "$3" },
      }}
    >
      {peerScreenSharing && (
        <VideoTile
          peer={peerScreenSharing}
          compact={true}
          hmsVideoTrackId={peerScreenSharing.videoTrack}
          {...videoTileProps(peerScreenSharing, peerScreenSharing.videoTrack)}
        />
      )}
    </Box>
  );
};
