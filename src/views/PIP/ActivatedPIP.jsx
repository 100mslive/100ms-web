import { useEffect } from "react";
import { PIP } from "./PIPManager";
import {
  selectRemotePeers,
  selectTracksMap,
  useHMSStore,
  useHMSActions,
} from "@100mslive/hms-video-react";
import { hmsToast } from "../components/notifications/hms-toast";

const ActivatedPIP = ({ setIsPipOn }) => {
  const hmsActions = useHMSActions();
  const tracksMap = useHMSStore(selectTracksMap);
  const remotePeers = useHMSStore(selectRemotePeers);

  useEffect(() => {
    PIP.subscribeToStateChange(setIsPipOn);
    try {
      PIP.start();
    } catch (error) {
      console.error(error);
    }

    //clean-up
    return () => {
      PIP.cleanup(setIsPipOn);
    };
  }, []);

  useEffect(() => {
    try {
      PIP.update(tracksMap, remotePeers, hmsActions);
    } catch (error) {
      hmsToast(error.message);
    }
  }, [tracksMap, remotePeers]);

  return null;
};

export default ActivatedPIP;
