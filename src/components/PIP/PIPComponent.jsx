import React, { useCallback, useEffect, useState } from "react";
import {
  selectLocalPeerRoleName,
  selectPeers,
  selectRemotePeers,
  selectTracksMap,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { PipIcon } from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/react-ui";
import IconButton from "../../IconButton";
import { PictureInPicture } from "./PIPManager";
import { MediaSession } from "./SetupMediaSession";
import { DEFAULT_HLS_VIEWER_ROLE } from "../../common/constants";

/**
 * shows a button which when clicked shows some videos in PIP, clicking
 * again turns it off.
 */
const PIPComponent = ({ peers, showLocalPeer }) => {
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const [isPipOn, setIsPipOn] = useState(PictureInPicture.isOn());
  const hmsActions = useHMSActions();
  const store = useHMSVanillaStore();

  const onPipToggle = useCallback(() => {
    if (isPipOn) {
      PictureInPicture.stop().catch(err =>
        console.error("error in stopping pip", err)
      );
    } else {
      PictureInPicture.start(hmsActions, setIsPipOn).catch(err =>
        console.error("error in starting pip", err)
      );
      MediaSession.setup(hmsActions, store);
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
      {isPipOn && <ActivatedPIP showLocalPeer={showLocalPeer} peers={peers} />}
    </>
  );
};

/**
 * this is a separate component so it can be conditionally rendered and
 * the subscriptions to store are done only if required.
 */
const ActivatedPIP = ({ showLocalPeer, peers }) => {
  const tracksMap = useHMSStore(selectTracksMap);
  const storePeers = useHMSStore(
    showLocalPeer ? selectPeers : selectRemotePeers
  );

  useEffect(() => {
    let pipPeers = storePeers;
    if (peers) {
      pipPeers = storePeers.filter(peer => peers.includes(peer.id));
    }
    PictureInPicture.updatePeersAndTracks(pipPeers, tracksMap).catch(err => {
      console.error("error in updating pip", err);
    });
  }, [peers, storePeers, tracksMap]);

  return null;
};

export default PIPComponent;
