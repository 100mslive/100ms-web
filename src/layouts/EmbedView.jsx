import { forwardRef, useEffect, useMemo } from "react";
import { useMedia } from "react-use";
import {
  selectAppData,
  selectLocalPeerID,
  selectLocalPeerRoleName,
  selectPeers,
  selectPeerScreenSharing,
  useEmbedShare,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Box, config as cssConfig, Flex } from "@100mslive/roomkit-react";
import { ToastManager } from "../components/Toast/ToastManager";
import { SidePane } from "./screenShareView";
import { useResetEmbedConfig } from "../components/AppData/useUISettings";
import { APP_DATA } from "../common/constants";

/**
 * EmbedView is responsible for rendering the iframe and managing the screen sharing functionality.
 */
export const EmbedView = () => {
  const embedConfig = useHMSStore(selectAppData(APP_DATA.embedConfig));
  const resetConfig = useResetEmbedConfig();

  // need to send resetConfig to clear configuration, if stop screenshare occurs.
  const { iframeRef, startEmbedShare, isEmbedShareInProgress } =
    useEmbedShare(resetConfig);

  useEffect(() => {
    (async () => {
      if (embedConfig && !isEmbedShareInProgress) {
        try {
          await startEmbedShare(embedConfig);
        } catch (err) {
          resetConfig();
          ToastManager.addToast({
            title: `Error while sharing embed url ${err.message || ""}`,
            variant: "error",
          });
        }
      }
    })();
  }, [isEmbedShareInProgress, embedConfig, startEmbedShare, resetConfig]);

  return <EmbedScreenShareView ref={iframeRef} />;
};

export const EmbedScreenShareView = forwardRef((props, ref) => {
  const peers = useHMSStore(selectPeers);

  const mediaQueryLg = cssConfig.media.lg;
  const showSidebarInBottom = useMedia(mediaQueryLg);
  const localPeerID = useHMSStore(selectLocalPeerID);
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const peerPresenting = useHMSStore(selectPeerScreenSharing);
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
  }, [peers, showPresenterInSmallTile, peerPresenting]);
  return (
    <Flex
      css={{ size: "100%" }}
      direction={showSidebarInBottom ? "column" : "row"}
    >
      <Box
        css={{
          mx: "$8",
          flex: "3 1 0",
          "@lg": {
            flex: "2 1 0",
            display: "flex",
            alignItems: "center",
          },
        }}
      >
        <iframe
          title="Embed View"
          ref={ref}
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            borderRadius: "0.75rem",
          }}
          allow="autoplay; clipboard-write;"
          referrerPolicy="no-referrer"
        />
      </Box>
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
});

export default EmbedView;
