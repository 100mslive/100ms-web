import React, { Fragment, useCallback, useMemo } from "react";
import { useMedia } from "react-use";
import {
  selectLocalPeerID,
  selectLocalPeerRoleName,
  selectPeers,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
  selectScreenShareByPeerID,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, config as cssConfig, Flex } from "@100mslive/react-ui";
import { VideoPlayer } from "../components/Playlist/VideoPlayer";
import { ScreenshareDisplay } from "../components/ScreenshareDisplay";
import ScreenshareTile from "../components/ScreenshareTile";
import VideoList from "../components/VideoList";
import VideoTile from "../components/VideoTile";

const ScreenShareView = () => {
  // for smaller screen we will show sidebar in bottom
  const mediaQueryLg = cssConfig.media.xl;
  const showSidebarInBottom = useMedia(mediaQueryLg);
  const peers = useHMSStore(selectPeers);
  const localPeerID = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const peerPresenting = useHMSStore(selectPeerScreenSharing);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const isPresenterFromMyRole =
    peerPresenting?.roleName?.toLowerCase() === localPeerRole?.toLowerCase();
  const amIPresenting = localPeerID === peerPresenting?.id;
  const showPresenterInSmallTile =
    showSidebarInBottom || amIPresenting || isPresenterFromMyRole;

  const smallTilePeers = useMemo(() => {
    const smallTilePeers = peers.filter(peer => peer.id !== peerPresenting?.id);
    if (showPresenterInSmallTile && peerPresenting) {
      smallTilePeers.unshift(peerPresenting); // put presenter on first page
    }
    return smallTilePeers;
  }, [peers, peerPresenting, showPresenterInSmallTile]);

  return (
    <Flex
      css={{
        size: "100%",
      }}
      direction={showSidebarInBottom ? "column" : "row"}
    >
      <ScreenShareComponent
        amIPresenting={amIPresenting}
        peerPresenting={peerPresenting}
        peerSharingPlaylist={peerSharingPlaylist}
      />
      <Flex
        direction={{ "@initial": "column", "@lg": "row" }}
        css={{
          overflow: "hidden",
          p: "$4 $8",
          flex: "0 0 20%",
          "@xl": {
            flex: "1 1 0",
          },
        }}
      >
        <SidePane
          showSidebarInBottom={showSidebarInBottom}
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
  isPresenterInSmallTiles,
  peerScreenSharing, // the peer who is screensharing
  smallTilePeers,
  totalPeers,
  showSidebarInBottom,
}) => {
  // The main peer's screenshare is already being shown in center view
  const shouldShowScreenFn = useCallback(
    peer => peerScreenSharing && peer.id !== peerScreenSharing.id,
    [peerScreenSharing]
  );
  return (
    <Fragment>
      {!isPresenterInSmallTiles && (
        <LargeTilePeerView peerScreenSharing={peerScreenSharing} />
      )}
      <SmallTilePeersView
        showSidebarInBottom={showSidebarInBottom}
        smallTilePeers={smallTilePeers}
        shouldShowScreenFn={shouldShowScreenFn}
      />
    </Fragment>
  );
};

const ScreenShareComponent = ({
  amIPresenting,
  peerPresenting,
  peerSharingPlaylist,
}) => {
  const screenshareTrack = useHMSStore(
    selectScreenShareByPeerID(peerPresenting?.id)
  );

  if (peerSharingPlaylist) {
    return (
      <Box
        css={{
          mx: "$8",
          flex: "3 1 0",
          "@xl": {
            flex: "2 1 0",
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <VideoPlayer peerId={peerSharingPlaylist.id} />
      </Box>
    );
  }

  return (
    <Box
      css={{
        flex: "3 1 0",
        mx: "$8",
        "@xl": { ml: "$4", maxHeight: "80%", minHeight: 0 },
      }}
    >
      {peerPresenting &&
        (amIPresenting &&
        !["browser", "window", "application"].includes(
          screenshareTrack?.displaySurface
        ) ? (
          <Box css={{ objectFit: "contain", h: "100%" }}>
            <ScreenshareDisplay />
          </Box>
        ) : (
          <ScreenshareTile peerId={peerPresenting?.id} />
        ))}
    </Box>
  );
};

const SmallTilePeersView = ({
  smallTilePeers,
  shouldShowScreenFn,
  showStatsOnTiles,
  showSidebarInBottom,
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
          maxColCount={showSidebarInBottom ? undefined : 2}
          maxRowCount={showSidebarInBottom ? 1 : undefined}
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

export default ScreenShareView;
