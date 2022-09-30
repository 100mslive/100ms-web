import React, { useCallback, useEffect, useState } from "react";
import {
  selectLocalPeerRoleName,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
  selectRemotePeers,
  selectTracksMap,
} from "@100mslive/react-sdk";
import { Tooltip } from "@100mslive/react-ui";
import { PipIcon } from "@100mslive/react-icons";
import { PictureInPicture } from "./PIPManager";
import IconButton from "../../IconButton";
import { DEFAULT_HLS_VIEWER_ROLE } from "../../common/constants";
import { MediaSession } from "./SetupMediaSession";

/**
 * shows a button which when clicked shows some videos in PIP, clicking
 * again turns it off.
 */
const PIPComponent = () => {
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const [isPipOn, setIsPipOn] = useState(PictureInPicture.isOn());
  const hmsActions = useHMSActions();
  const store = useHMSVanillaStore();

  const onPipToggle = useCallback(() => {
    if (!isPipOn) {
      PictureInPicture.start(hmsActions, setIsPipOn).catch(err =>
        console.error("error in starting pip", err)
      );
      MediaSession.setup(hmsActions, store);
    } else {
      PictureInPicture.stop().catch(err =>
        console.error("error in stopping pip", err)
      );
    }
  }, [hmsActions, isPipOn, store]);

  // stop pip on unmount
  useEffect(() => {
    return () => {
      PictureInPicture.stop().catch(err =>
        console.error("error in stopping pip on unmount", err)
      );
    };
  }, []);

  if (
    !PictureInPicture.isSupported() ||
    localPeerRole === DEFAULT_HLS_VIEWER_ROLE
  ) {
    return null;
  }
  return (
    <>
      <Tooltip
        title={`${isPipOn ? "Deactivate" : "Activate"} picture in picture view`}
      >
        <IconButton
          active={!isPipOn}
          key="pip"
          onClick={() => onPipToggle()}
          data-testid="pip_btn"
        >
          <PipIcon />
        </IconButton>
      </Tooltip>
      {isPipOn && <ActivatedPIP setIsPipOn={setIsPipOn} />}
    </>
  );
};

/**
 * this is a separate component so it can be conditionally rendered and
 * the subscriptions to store are done only if required.
 */
const ActivatedPIP = () => {
  const tracksMap = useHMSStore(selectTracksMap);
  const remotePeers = useHMSStore(selectRemotePeers);

  useEffect(() => {
    PictureInPicture.updatePeersAndTracks(remotePeers, tracksMap).catch(err => {
      console.error("error in updating pip", err);
    });
  }, [tracksMap, remotePeers]);

  return null;
};

export default PIPComponent;
