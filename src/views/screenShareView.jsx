import React, { useCallback, useMemo, Fragment } from "react";
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
import { useWindowSize } from "./hooks/useWindowSize";
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
        amIPresenting={amIPresenting}
        peerPresenting={peerPresenting}
        peerSharingPlaylist={peerSharingPlaylist}
        videoTileProps={videoTileProps}
      />
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
          peerScreenSharing={peerPresenting}
          isPresenterInSmallTiles={showPresenterInSmallTile}
          smallTilePeers={smallTilePeers}
          isParticipantListOpen={isParticipantListOpen}
          totalPeers={peers.length}
          videoTileProps={videoTileProps}
        />
      </Flex>
    </Flex>
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
    <Fragment>
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
    </Fragment>
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
      <Box
        css={{
          mx: "$2",
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
        mx: "$2",
        ml: "$3",
        "@lg": { ml: "$2" },
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
  videoTileProps = () => ({}),
}) => {
  const { width } = useWindowSize();
  let rows = undefined;
  if (width <= 1024 && width >= 768) {
    rows = 1;
  }
  return (
    <Flex
      css={{
        flex: "2 1 0",
      }}
    >
      {smallTilePeers && smallTilePeers.length > 0 && (
        <VideoList
          peers={smallTilePeers}
          showScreenFn={shouldShowScreenFn}
          classes={{ videoTileContainer: "rounded-lg " }}
          maxColCount={2}
          maxRowCount={rows}
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
  return peerScreenSharing ? (
    <Box
      css={{
        flex: "1 1 0",
        minHeight: "25%",
        py: "$2",
        "@lg": {
          mr: "$2",
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
        peer={peerScreenSharing}
        compact={true}
        hmsVideoTrackId={peerScreenSharing.videoTrack}
        {...videoTileProps(peerScreenSharing, peerScreenSharing.videoTrack)}
      />
    </Box>
  ) : null;
};
