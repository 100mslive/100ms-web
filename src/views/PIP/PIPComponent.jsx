import React, { useState, Fragment } from "react";
import { Button, PIPIcon } from "@100mslive/hms-video-react";

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
    <Fragment>
      <Button
        variant="no-fill"
        iconSize="md"
        shape="rectangle"
        key="pip"
        onClick={() => setIsPipOn(!isPipOn)}
      >
        <PIPIcon />
      </Button>
      {isPipOn && <ActivatedPIP setIsPipOn={setIsPipOn} />}
    </Fragment>
  );
};

export default PIPComponent;
