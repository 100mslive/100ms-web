import React from "react";
import { ExpandIcon } from "@100mslive/react-icons";
import { Dropdown, Text } from "@100mslive/react-ui";
import { useFullscreen } from "../hooks/useFullscreen";

export const FullScreenItem = () => {
  const { allowed, isFullscreen, toggleFullscreen } = useFullscreen();

  if (!allowed) {
    return null;
  }

  return (
    <Dropdown.Item
      onClick={() => {
        toggleFullscreen();
      }}
      data-testid="full_screen_btn"
    >
      <ExpandIcon />
      <Text variant="sm" css={{ ml: "$4" }}>
        {isFullscreen ? "Exit " : "Go "}Fullscreen
      </Text>
    </Dropdown.Item>
  );
};
