import { forwardRef } from "react";
import { Flex } from "@100mslive/roomkit-react";

export const HMSVideo = forwardRef(({ children }, videoRef) => {
  return (
    <Flex data-testid="hms-video" css={{ size: "100%" }} direction="column">
      <video
        style={{ flex: "1 1 0", margin: "0 auto", minHeight: "0" }}
        ref={videoRef}
        playsInline
      />
      {children}
    </Flex>
  );
});
