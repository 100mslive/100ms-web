import React, { useEffect, useState } from "react";
import { ComputerIcon } from "@100mslive/react-icons";
import screenfull from "screenfull";
import { Dropdown, Text } from "@100mslive/react-ui";
import { setFullScreenEnabled } from "../../../common/utils";

export const FullScreenItem = ({ hoverStyles }) => {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(
    screenfull.isFullscreen
  );

  useEffect(() => {
    const onChange = () => {
      setIsFullScreenEnabled(screenfull.isFullscreen);
    };
    if (screenfull.isEnabled) {
      screenfull.on("change", onChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", onChange);
      }
    };
  }, []);

  return (
    screenfull.isEnabled && (
      <Dropdown.Item
        onClick={() => {
          setFullScreenEnabled(!isFullScreenEnabled);
        }}
        css={hoverStyles}
      >
        <ComputerIcon />
        <Text variant="sm" css={{ ml: "$4" }}>
          {isFullScreenEnabled ? "Exit " : ""}Full Screen
        </Text>
      </Dropdown.Item>
    )
  );
};
