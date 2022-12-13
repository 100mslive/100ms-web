import { forwardRef } from "react";
import { Box } from "@100mslive/react-ui";

export const HMSVideo = forwardRef(({ children }, videoRef) => {
  return (
    <Box data-testid="hms-video" css={{ size: "100%" }}>
      <video
        style={{ height: "100%", margin: "auto" }}
        ref={videoRef}
        playsInline
      />
      {children}
    </Box>
  );
});
