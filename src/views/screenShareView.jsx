import {
  useHMSStore,
  useHMSActions,
  VideoList,
  VideoTile,
  selectPeers,
  selectLocalPeer,
  selectPeerScreenSharing,
  ScreenShareDisplay
} from "@100mslive/hms-video-react";
import React, { useCallback, useMemo } from "react";
import { ChatView } from "./components/chatView";
import { ROLES } from "../common/roles";

export const ScreenShareView = ({ isChatOpen, toggleChat }) => {
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const peerPresenting = useHMSStore(selectPeerScreenSharing);
  const smallTilePeers = useMemo(
    () => peers.filter(peer => peer.id !== peerPresenting.id),
    [peers, peerPresenting]
  );

  const amITeacher = localPeer?.role.toLowerCase() === ROLES.TEACHER;
  const isPresenterTeacher = peerPresenting?.role.toLowerCase() === ROLES.TEACHER;
  const amIPresenting = localPeer && localPeer.id === peerPresenting?.id;
  const showPresenterInSmallTile =
    amIPresenting || (amITeacher && isPresenterTeacher);

  if (
    showPresenterInSmallTile &&
    !smallTilePeers.some(peer => peer.id === peerPresenting.id)
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
      <div className="w-full h-full flex">
        <ScreenShareComponent
          amIPresenting={amIPresenting}
          peerPresenting={peerPresenting}
        />
        <div className="flex flex-wrap overflow-hidden p-2 w-2/10 h-full ">
          <SidePane
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            peerScreenSharing={peerPresenting}
            isPresenterInSmallTiles={showPresenterInSmallTile}
            smallTilePeers={smallTilePeers}
          />
        </div>
      </div>
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
  smallTilePeers
}) => {
  // The main peer's screenshare is already being shown in center view
  const shouldShowScreenFn = useCallback(
    peer => peerScreenSharing && peer.id !== peerScreenSharing.id,
    [peerScreenSharing]
  );

  return (
    <React.Fragment>
      <div className={`w-full h-full relative`}>
        <div className={`w-full flex flex-col h-full`}>
          {!isPresenterInSmallTiles && (
            <LargeTilePeerView
              peerScreenSharing={peerScreenSharing}
              isChatOpen={isChatOpen}
            />
          )}
          <SmallTilePeersView
            isChatOpen={isChatOpen}
            smallTilePeers={smallTilePeers}
            shouldShowScreenFn={shouldShowScreenFn}
          />
        <CustomChatView isChatOpen={isChatOpen} toggleChat={toggleChat} />
        </div>
      </div>
    </React.Fragment>
  );
};

const ScreenShareComponent = ({ amIPresenting, peerPresenting }) => {
  const hmsActions = useHMSActions();
  return (
    <div className="w-8/10 h-full">
      {peerPresenting &&
        (amIPresenting ? (
          <div className="object-contain h-full">
            <ScreenShareDisplay
              stopScreenShare={() => {
                hmsActions.setScreenShareEnabled(false);
              }}
              classes={{ rootBg: "h-full" }}
            />
          </div>
        ) : (
          <VideoTile
            peer={peerPresenting}
            showScreen={true}
            objectFit="contain"
          />
        ))}
    </div>
  );
};

const CustomChatView = ({ isChatOpen, toggleChat }) => {
  return (
    isChatOpen && (
      <div className="h-1/2 w-full flex-shrink-0">
        <ChatView toggleChat={toggleChat} />
      </div>
    )
  );
};

const SmallTilePeersView = ({
  isChatOpen,
  smallTilePeers,
  shouldShowScreenFn
}) => {
  return (
    <div className="w-full relative flex-1">
      {smallTilePeers && smallTilePeers.length > 0 && (
        <VideoList
          peers={smallTilePeers}
          showScreenFn={shouldShowScreenFn}
          classes={{ videoTileContainer: "rounded-lg " }}
          maxColCount={2}
          overflow="scroll-x"
          compact={true}
        />
      )}
    </div>
  );
};

const LargeTilePeerView = ({ peerScreenSharing, isChatOpen }) => (
  <div
    className="w-full relative overflow-hidden"
    style={{
      paddingTop: `${peerScreenSharing ? (isChatOpen ? "50%" : "100%") : "0"}`
    }}
  >
    {peerScreenSharing && (
      <div className="absolute left-0 top-0 w-full h-full p-3">
        <VideoTile peer={peerScreenSharing} compact={true} />
      </div>
    )}
  </div>
);
