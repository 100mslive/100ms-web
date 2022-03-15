import React, { useState, useEffect } from "react";
import {
  selectPeers,
  useHMSStore,
  selectDominantSpeaker,
  selectLocalPeer,
} from "@100mslive/react-sdk";
import { Flex } from "@100mslive/react-ui";
import { GridCenterView, GridSidePaneView } from "../components/gridView";

export const ActiveSpeakerView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const peers = useHMSStore(selectPeers);
  const localPeer = useHMSStore(selectLocalPeer);
  let [activeSpeaker, setActiveSpeaker] = useState(localPeer);
  let dominantSpeaker = useHMSStore(selectDominantSpeaker);
  let showSidePane = activeSpeaker && peers.length > 1;

  /** here we are using peer filter function to change the activeSpeaker and sidebarPeers,
   * on first mount activeSpeaker points to the localPeer and on each update it points
   * to the dominantSpeaker
   */
  const peerFilter = dominantSpeaker => {
    if (dominantSpeaker) {
      setActiveSpeaker(dominantSpeaker);
    }
  };

  useEffect(() => {
    peerFilter(dominantSpeaker);
  }, [dominantSpeaker]);

  return (
    <Flex css={{ size: "100%", "@lg": { flexDirection: "column" } }}>
      <GridCenterView
        peers={[activeSpeaker]}
        maxTileCount={1}
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        allowRemoteMute={false}
        hideSidePane={!showSidePane}
        isParticipantListOpen={isParticipantListOpen}
        totalPeers={1}
      />
      {showSidePane && (
        <GridSidePaneView
          peers={peers.filter(peer => peer.id !== activeSpeaker.id)}
          isChatOpen={isChatOpen}
          toggleChat={toggleChat}
          isParticipantListOpen={isParticipantListOpen}
          totalPeers={peers.length - 1}
        />
      )}
    </Flex>
  );
};
