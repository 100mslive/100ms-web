import { useEffect } from "react";
import { PIP } from "./PIPManager";
import {
  selectRemotePeers,
  selectTracksMap,
  useHMSStore,
  useHMSActions,
} from "@100mslive/hms-video-react";
import { hmsToast } from "../components/notifications/hms-toast";

const ActivatedPIP = props => {
  const hmsActions = useHMSActions();
  const tracksMap = useHMSStore(selectTracksMap);
  const remotePeers = useHMSStore(selectRemotePeers);
  const { setIsPipOn } = props;

  useEffect(() => {
    PIP.registerEventListeners(setIsPipOn);

    if (!document.pictureInPictureElement) {
      PIP.start();
    }

    //clean-up
    return () => {
      PIP.deregisterEventListeners(setIsPipOn);

      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      }
    };
  }, []);

  useEffect(() => {
    const updatePIP = async () => {
      await PIP.update(tracksMap, remotePeers, hmsActions);
      console.log(tracksMap, remotePeers);
    };

    try {
      updatePIP();
    } catch (error) {
      hmsToast(error.message);
      setIsPipOn(false);
    }
  }, [tracksMap, remotePeers]);

  return null;
};

export default ActivatedPIP;
