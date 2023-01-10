import PIPComponent from "./PIPComponent";
import { usePinnedTrack } from "../AppData/useUISettings";

export const PIP = () => {
  const pinnedTrack = usePinnedTrack();

  return (
    <PIPComponent
      peers={
        pinnedTrack && pinnedTrack.enabled ? [pinnedTrack.peerId] : undefined
      }
      showLocalPeer={true}
    />
  );
};
