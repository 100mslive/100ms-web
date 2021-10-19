import React, { useContext, useEffect } from "react";
import {
  selectLocalPeerID,
  selectPeers,
  useHMSStore,
} from "@100mslive/hms-video-react";
import { GridCenterView, GridSidePaneView } from "./components/gridView";
import { AppContext } from "../store/AppContext";
import {
  selectPeerAudioByID,
  selectDominantSpeaker,
  selectSpeakers,
  selectLocalPeer,
} from "@100mslive/hms-video-store";

export const ActiveSpeakerView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const { maxTileCount } = useContext(AppContext);
  const peers = useHMSStore(selectPeers);
  const localPeerId = useHMSStore(selectLocalPeerID);
  let [centerPeers, setcenterPeers] = React.useState({});
  let [sidebarPeers, setsidebarPeers] = React.useState({});
  const localPeer = useHMSStore(selectLocalPeer);
  let dominantSpeaker = useHMSStore(selectDominantSpeaker);
  let showSidePane;
  let itsOnlyMeInTheRoom;
  let nooneIsPublishing;
  let [prevDominantSpeaker,setprevDominantSpeaker] = React.useState(localPeer);

  /* here we are using peer filter function to change the centerPeers and sidebarPeers,
   on first mount our prevDominantSpeaker points to the localPeer and on each update it points
   to the dominantSpeaker
   */
  
  const peerFilter = async dominantSpeaker => {
    
    if (dominantSpeaker) {
      setcenterPeers([dominantSpeaker]);
      const sidebarPeer = peers.filter(peer => peer.id !== dominantSpeaker.id);
      setsidebarPeers(sidebarPeer);
      setprevDominantSpeaker(dominantSpeaker)
    } else {
      setcenterPeers([prevDominantSpeaker]);
      const sidePeer = peers.filter(peer => peer.id !== prevDominantSpeaker.id);
      setsidebarPeers(sidePeer);
    }
  };

  useEffect(() => {
    peerFilter(dominantSpeaker);
    }, [dominantSpeaker]);  
  showSidePane = centerPeers.length > 0 && sidebarPeers.length > 0;

  return (
    <React.Fragment>
      <GridCenterView
        peers={centerPeers}
        maxTileCount={1}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        allowRemoteMute={false}
        hideSidePane={showSidePane}
        isParticipantListOpen={isParticipantListOpen}
        totalPeers={peers.length}
      />
      {showSidePane && (
        <GridSidePaneView
          peers={sidebarPeers}
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          isParticipantListOpen={isParticipantListOpen}
          totalPeers={peers.length - 1}
        />
      )}
    </React.Fragment>
  );
};
