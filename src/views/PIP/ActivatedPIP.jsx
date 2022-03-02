import { useEffect } from "react";
import { PictureInPicture } from "./PIPManager";
import {
  selectTracksMap,
  useHMSStore,
  useHMSActions,
  selectRemotePeers,
} from "@100mslive/react-sdk";

const ActivatedPIP = ({ setIsPipOn }) => {
  const hmsActions = useHMSActions();
  const tracksMap = useHMSStore(selectTracksMap);
  const remotePeers = useHMSStore(selectRemotePeers);

  useEffect(() => {
    const startPip = async () => {
      await PictureInPicture.start(hmsActions, setIsPipOn);
      await PictureInPicture.updatePeersAndTracks(remotePeers, tracksMap);
    };
    startPip().catch(err => console.error("error in starting pip", err));

    return () => {
      PictureInPicture.stop().catch(err =>
        console.error("error in stopping pip", err)
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hmsActions, setIsPipOn]);

  useEffect(() => {
    PictureInPicture.updatePeersAndTracks(remotePeers, tracksMap).catch(err => {
      console.error("error in updating pip", err);
    });
  }, [tracksMap, remotePeers]);

  return null;
};

export default ActivatedPIP;
