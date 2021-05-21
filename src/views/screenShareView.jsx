import {
  useHMSStore,
  VideoList,
  VideoTile,
  selectPeers,
  selectPeerScreenSharing,
} from "@100mslive/sdk-components";
import React, {useMemo} from "react";
import { ChatView } from "./chatView";

export const ScreenShareView = ({ isChatOpen, toggleChat }) => {
  const peers = useHMSStore(selectPeers);
  const peerScreenSharing = useHMSStore(selectPeerScreenSharing);

  const ScreenShareComponent = <div className="w-8/10 h-full">
    {peerScreenSharing && (
        <VideoTile peer={peerScreenSharing} showScreen={true} objectFit="contain"/>
    )}
  </div>

  return (
      <React.Fragment>
        <div className="w-full h-full flex">
          <ScreenShareComponent/>
          <div className="flex flex-wrap overflow-hidden p-2 w-2/10 h-full ">
            <SidePane
                isChatOpen={isChatOpen}
                toggleChat={toggleChat}
                peerScreenSharing={peerScreenSharing}
                allPeers={peers}
            />
          </div>
        </div>
      </React.Fragment>
  );
};

const SidePane = ({
  isChatOpen,
  toggleChat,
  peerScreenSharing,
  allPeers
}) => {
  const remainingPeers = useMemo(() => allPeers.filter(peer => peer.id !== peerScreenSharing.id),
      [allPeers, peerScreenSharing]);

  const PeerScreenSharingView = <div className="w-full relative overflow-hidden"
      style={{
        paddingTop: `${peerScreenSharing ? "100%" : "0"}`,
      }}>
    {peerScreenSharing && (
        <div className="absolute left-0 top-0 w-full h-full p-3">
          <VideoTile peer={peerScreenSharing}/>
        </div>
    )}
  </div>

  // The main screen is already being shown
  const shouldShowScreen = (peer) => peer.id !== peerScreenSharing.id;

  const RemainingPeersView = <div className={`w-full relative ${isChatOpen ? "h-1/3" : "flex-grow"}`}>
    {remainingPeers && (
        <VideoList
            peers={isChatOpen ? [peerScreenSharing, ...remainingPeers] : remainingPeers}
            showScreen={shouldShowScreen}
            classes={{videoTileContainer: "rounded-lg p-2"}}
            maxColCount={2}
            overflow="scroll-x"
        />
    )}
  </div>

  const CustomChatView = isChatOpen && <div className="h-2/3 w-full absolute z-40 bottom-0 right-0">
        <ChatView toggleChat={toggleChat} />
      </div>

  return (
    <>
      <div className={`w-full h-full relative`}>
        <div className={`w-full flex flex-col h-full`}>
          <PeerScreenSharingView/>
          <RemainingPeersView/>
        </div>
        <CustomChatView/>
      </div>
    </>
  );
};
