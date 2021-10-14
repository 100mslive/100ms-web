import React, { useContext,useEffect } from "react";
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
  selectLocalPeer
} from "@100mslive/hms-video-store";

export const ActiveSpeakerView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const {
    maxTileCount,
    
  } = useContext(AppContext);
  const peers = useHMSStore(selectPeers);
  const localPeerId = useHMSStore(selectLocalPeerID);
  let [centerPeers,setcenterPeers]=React.useState({});
  let [sidebarPeers,setsidebarPeers]=React.useState({});
  const localPeer = useHMSStore(selectLocalPeer);
  let dominantSpeaker = useHMSStore(selectDominantSpeaker);
  let showSidePane
  let itsOnlyMeInTheRoom
  let nooneIsPublishing
  const  peerFilter = async dominantSpeaker => {
    
    if(dominantSpeaker){
    
      setcenterPeers([dominantSpeaker]);
      const sidebarPeer=peers.filter(peer=>peer.id!==dominantSpeaker.id)
      setsidebarPeers(sidebarPeer);
      console.log("main: center:",centerPeers,"side",sidebarPeers )
    }
    else{
      
      setcenterPeers([localPeer]);
      const sidePeer=peers.filter(peer=>peer.id!==localPeer.id)
      setsidebarPeers(sidePeer);
      console.log("main2: center:",centerPeers,"side",sidebarPeers )
    }
  };

  useEffect(() => {
    peerFilter(dominantSpeaker)
    console.log("show",showSidePane)
    console.log("c",centerPeers)
    console.log("d",sidebarPeers)
    showSidePane = centerPeers.length > 0 && sidebarPeers.length > 0;
    if (centerPeers.length === 0) {
      // we'll show the sidepane for banner in this case too if 1). it's only me
      // in the room. or 2). noone is publishing in the room
      itsOnlyMeInTheRoom =
        peers.length === 1 && peers[0].id === localPeerId;
       nooneIsPublishing = sidebarPeers.length === 0;
      showSidePane = itsOnlyMeInTheRoom || nooneIsPublishing;
    }
    
  }, [dominantSpeaker])
  /**
   * If there are peers from many publishing roles, then it's possible to divide
   * them into two parts, those who show in center and those who show in sidepane.
   * In case there is only one person in the room, then too sidepane will be shown
   * and center would be taken up by a banner image.
   * There is an issue currently, where the banner is still shown if there are
   * multiple viewers in the room but no publisher. Depending on the use case
   * this can be useful(for webinar) or look odd(for showing you're the only one).
   * Note that both center peers and sidebar peers have only publishing peers in them.
   */
showSidePane = centerPeers.length > 0 && sidebarPeers.length > 0;
  if (centerPeers.length === 0) {
    // we'll show the sidepane for banner in this case too if 1). it's only me
    // in the room. or 2). noone is publishing in the room
     itsOnlyMeInTheRoom =
      peers.length === 1 && peers[0].id === localPeerId;
     nooneIsPublishing = sidebarPeers.length === 0;
    showSidePane = itsOnlyMeInTheRoom || nooneIsPublishing;
  }
 
 
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
          totalPeers={peers.length-1}
        />
      )}
    </React.Fragment>
  );
};