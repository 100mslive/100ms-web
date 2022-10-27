import React, { useRef } from "react";
import {
  selectDominantSpeaker,
  selectPeers,
  useHMSStore,
} from "@100mslive/react-sdk";
import { Flex } from "@100mslive/react-ui";
import { GridCenterView, GridSidePaneView } from "../components/gridView";

const ActiveSpeakerView = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  const latestDominantSpeakerRef = useRef(dominantSpeaker);
  const peers = (useHMSStore(selectPeers) || []).filter(
    peer =>
      peer.videoTrack || peer.audioTrack || peer.auxiliaryTracks.length > 0
  );
  // if there is no current dominant speaker latest keeps pointing to last
  if (dominantSpeaker) {
    latestDominantSpeakerRef.current = dominantSpeaker;
  }
  if (peers.length === 0) {
    return null;
  }
  // show local peer if there hasn't been any dominant speaker
  const activeSpeaker = latestDominantSpeakerRef.current || peers[0];
  const showSidePane = activeSpeaker && peers.length > 1;

  return (
    <Flex css={{ size: "100%", "@lg": { flexDirection: "column" } }}>
      <GridCenterView
        peers={[activeSpeaker]}
        maxTileCount={1}
        hideSidePane={!showSidePane}
      />
      {showSidePane && (
        <GridSidePaneView
          peers={peers.filter(peer => peer.id !== activeSpeaker.id)}
        />
      )}
    </Flex>
  );
};

export default ActiveSpeakerView;
