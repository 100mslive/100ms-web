import { useEffect, useRef, useState } from "react";
import { useHMSVanillaStore } from "@100mslive/react-sdk";
import PeersSorter from "./PeersSorter";
import { useActiveSpeakerSorting } from "../components/AppData/useUISettings";

function useSortedPeers({ peers, maxTileCount = 9 }) {
  const [sortedPeers, setSortedPeers] = useState([]);
  const store = useHMSVanillaStore();
  const activeSpeakerSorting = useActiveSpeakerSorting();
  const peerSortedRef = useRef(new PeersSorter(store));
  peerSortedRef.current.onUpdate(setSortedPeers);

  useEffect(() => {
    const peersSorter = peerSortedRef.current;
    if (peers?.length > 0 && maxTileCount && activeSpeakerSorting) {
      peersSorter.setPeersAndTilesPerPage({
        peers,
        tilesPerPage: maxTileCount,
      });
    } else if (!activeSpeakerSorting) {
      peersSorter.stop();
    }
  }, [maxTileCount, peers, activeSpeakerSorting]);

  return activeSpeakerSorting ? sortedPeers : peers;
}

export default useSortedPeers;
