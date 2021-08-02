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
  isMobileDevice,
} from "@100mslive/hms-video-react";
import { ChatView } from "./components/chatView";
import { ROLES } from "../common/roles";
import { getBlurClass } from "../common/utils";

export const ScreenShareView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const peerPresenting = useHMSStore(selectPeerScreenSharing);
  const smallTilePeers = useMemo(
    () => peers.filter(peer => peer.id !== peerPresenting.id),
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
      <div className="w-full h-full flex flex-col md:flex-row">
        <ScreenShareComponent
          amIPresenting={amIPresenting}
          peerPresenting={peerPresenting}
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
  smallTilePeers,
  isParticipantListOpen,
  totalPeers,
}) => {
  // The main peer's screenshare is already being shown in center view
  const shouldShowScreenFn = useCallback(
    peer => peerScreenSharing && peer.id !== peerScreenSharing.id,
    [peerScreenSharing]
  );

  return (
    <React.Fragment>
      <div className="w-full h-full relative">
        <div className="w-full flex flex-row md:flex-col h-full">
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
          <CustomChatView
            isChatOpen={isChatOpen}
            toggleChat={toggleChat}
            isParticipantListOpen={isParticipantListOpen}
            totalPeers={totalPeers}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

const ScreenShareComponent = ({ amIPresenting, peerPresenting }) => {
  const hmsActions = useHMSActions();
  return (
    <div className="mr-2 ml-2 md:ml-3 md:w-8/10 h-2/3 md:h-full">
      {peerPresenting &&
        (amIPresenting ? (
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
          />
        ))}
    </div>
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
      <div
        className={`h-1/2 w-full flex-shrink-0 ${getBlurClass(
          isParticipantListOpen,
          totalPeers
        )}`}
      >
        <ChatView toggleChat={toggleChat} />
      </div>
    )
  );
};

const SmallTilePeersView = ({
  isChatOpen,
  smallTilePeers,
  shouldShowScreenFn,
}) => {
  return (
    <div className="w-1/2 md:w-full relative md:flex-1">
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

const LargeTilePeerView = ({ peerScreenSharing, isChatOpen }) => {
  const isMobile = isMobileDevice();
  return (
    <div
      className="w-1/2 md:w-full relative overflow-hidden"
      style={{
        paddingTop: isMobile
          ? 0
          : `${peerScreenSharing ? (isChatOpen ? "50%" : "100%") : "0"}`,
      }}
    >
      {peerScreenSharing && (
        <div className="absolute left-0 top-0 w-full h-full p-3">
          <VideoTile peer={peerScreenSharing} compact={true} />
        </div>
      )}
    </div>
  );
};
