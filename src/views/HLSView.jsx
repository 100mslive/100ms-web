import Hls from "hls.js";
import {
  FirstPersonDisplay,
  isMobileDevice,
  selectLocalPeer,
  selectPeers,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
  useHMSStore,
  VideoList,
} from "../../../hms-video-react";
import eventsImg from "../images/event-zoom-clone.png";
import { getBlurClass } from "../common/utils";
import { ChatView } from "./components/chatView";
import React, { useMemo } from "react";
import { ScreenShareComponent, SidePane } from "./screenShareView";
import { ROLES } from "../common/roles";

export const HLSView = () => {
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
      <div className="w-full h-full flex flex-col md:flex-row">
        <ScreenShareComponent
          amIPresenting={amIPresenting}
          peerPresenting={peerPresenting}
          peerSharingPlaylist={peerSharingPlaylist}
          videoTileProps={videoTileProps}
        />
        <div className="flex flex-wrap overflow-hidden p-2 w-full h-1/3 md:w-2/10 md:h-full ">
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
        </div>
      </div>
    </React.Fragment>
  );
};
