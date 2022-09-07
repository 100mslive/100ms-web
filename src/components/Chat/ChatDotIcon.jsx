import React from "react";
import { Box } from "@100mslive/react-ui";

export const ChatDotIcon = ({ css = {} }) => {
  return (
    <Box
      css={{ size: "$6", bg: "$brandDefault", mx: "$2", r: "$round", ...css }}
    />
  );
};
