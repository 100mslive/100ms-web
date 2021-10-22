import React, { useEffect, useState, Fragment } from "react";
import { Button, PIPIcon } from "@100mslive/hms-video-react";

import ActivatedPIP from "./ActivatedPIP";

const PIP = () => {
  const [isPipOn, setIsPipOn] = useState(!!document.pictureInPictureElement);

  const togglePIP = () => {
    if (!isPipOn) {
      setIsPipOn(true);
    } else {
      setIsPipOn(false);
    }
  };

  return (
    <Fragment>
      <Button
        variant="no-fill"
        iconSize="md"
        shape="rectangle"
        key="pip"
        onClick={togglePIP}
      >
        <PIPIcon />
      </Button>
      {isPipOn && <ActivatedPIP setIsPipOn={setIsPipOn} />}
    </Fragment>
  );
};

export default PIP;
