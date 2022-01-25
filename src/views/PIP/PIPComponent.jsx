import React, { useState } from "react";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { PipIcon } from "@100mslive/react-icons";
import ActivatedPIP from "./ActivatedPIP";
import { PictureInPicture } from "./PIPManager";

/**
 * shows a button which when clicked shows some videos in PIP, clicking
 * again turns it off.
 */
const PIPComponent = () => {
  const [isPipOn, setIsPipOn] = useState(PictureInPicture.isOn());

  if (!PictureInPicture.isSupported()) {
    return null;
  }

  return (
    <>
      <Tooltip
        title={`${isPipOn ? "Deactivate" : "Activate"} Person in Person view`}
      >
        <IconButton
          css={{ width: "40px", height: "40px" }}
          active={!isPipOn}
          key="pip"
          onClick={() => setIsPipOn(!isPipOn)}
        >
          <PipIcon />
        </IconButton>
      </Tooltip>
      {isPipOn && <ActivatedPIP setIsPipOn={setIsPipOn} />}
    </>
  );
};

export default PIPComponent;
