import {
  useHMSStore,
  VideoList,
  VideoTile,
  selectPeers,
  selectLocalPeer,
  selectPeerScreenSharing,
} from "@100mslive/sdk-components";
import React, {useMemo} from "react";
import { ChatView } from "./components/chatView";
import {ROLES} from "../common/roles";

export const ScreenShareView = ({ isChatOpen, toggleChat }) => {
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  const peerPresenting = useHMSStore(selectPeerScreenSharing);
  const smallTilePeers = useMemo(() => peers.filter(peer => peer.id !== peerPresenting.id),
        [peers, peerPresenting]);

  const amITeacher = localPeer.role === ROLES.TEACHER;
  const isPresenterTeacher = peerPresenting.role === ROLES.TEACHER;
  const amIPresenting = localPeer.id === peerPresenting.id;
  const showPresenterInSmallTile = amIPresenting || (amITeacher && isPresenterTeacher);

  if (showPresenterInSmallTile) {
      if (amIPresenting) { // put presenter on last page
          smallTilePeers.push(peerPresenting);
      } else {  // put on first page
          smallTilePeers.unshift(peerPresenting);
      }
  }

  const ScreenShareComponent = () => <div className="w-8/10 h-full">
    {peerPresenting && (
        <VideoTile peer={peerPresenting} showScreen={true} objectFit="contain"/>
    )}
  </div>

  return <React.Fragment>
        <div className="w-full h-full flex">
          <ScreenShareComponent/>
          <div className="flex flex-wrap overflow-hidden p-2 w-2/10 h-full ">
            <SidePane
                isChatOpen={isChatOpen}
                toggleChat={toggleChat}
                peerScreenSharing={!showPresenterInSmallTile && peerPresenting}
                smallTilePeers={smallTilePeers}
            />
          </div>
        </div>
      </React.Fragment>
};

// Sidepane will show the camera stream of the main peer who is screensharing
// and both camera + screen(if applicable) of others
export const SidePane = ({
  isChatOpen,
  toggleChat,
  peerScreenSharing,  // the peer who is screensharing
  smallTilePeers
}) => {
  
  const LargeTilePeerView = () => <div className="w-full relative overflow-hidden"
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

  const SmallTilePeersView = () => <div className={`w-full relative ${isChatOpen ? "h-1/3" : "flex-grow"}`}>
    {smallTilePeers && (smallTilePeers.length > 0) && (
        <VideoList
            peers={isChatOpen ? [peerScreenSharing, ...smallTilePeers] : smallTilePeers}
            showScreenFn={shouldShowScreen}
            classes={{videoTileContainer: "rounded-lg p-2"}}
            maxColCount={2}
            overflow="scroll-x"
        />
    )}
  </div>

  const CustomChatView = () => isChatOpen && <div className="h-2/3 w-full absolute z-40 bottom-0 right-0">
        <ChatView toggleChat={toggleChat} />
      </div>

  return <React.Fragment>
      <div className={`w-full h-full relative`}>
          <div className={`w-full flex flex-col h-full`}>
              <LargeTilePeerView/>
              <SmallTilePeersView/>
          </div>
          <CustomChatView/>
      </div>
  </React.Fragment>
};
