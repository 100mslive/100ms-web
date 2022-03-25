import React, { useState } from "react";
import { selectLocalPeer, useHMSStore } from "@100mslive/react-sdk";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { PipIcon } from "@100mslive/react-icons";
import ActivatedPIP from "./ActivatedPIP";
import { PictureInPicture } from "./PIPManager";
import { DEFAULT_HLS_VIEWER_ROLE } from "../../common/constants";

/**
 * shows a button which when clicked shows some videos in PIP, clicking
 * again turns it off.
 */
const PIPComponent = () => {
  const localPeer = useHMSStore(selectLocalPeer);
  const [isPipOn, setIsPipOn] = useState(PictureInPicture.isOn());

  if (
    !PictureInPicture.isSupported() ||
    localPeer.roleName === DEFAULT_HLS_VIEWER_ROLE
  ) {
    return null;
  }

  return (
    <>
      <Tooltip
        title={`${isPipOn ? "Deactivate" : "Activate"} Person in Person view`}
      >
        <IconButton
          active={!isPipOn}
          key="pip"
          onClick={() => setIsPipOn(!isPipOn)}
          data-testid="pip_btn"
        >
          <PipIcon />
        </IconButton>
      </Tooltip>
      {isPipOn && <ActivatedPIP setIsPipOn={setIsPipOn} />}
    </>
  );
};

export default PIPComponent;
