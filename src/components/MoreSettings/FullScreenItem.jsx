import React from "react";
import { ComputerIcon } from "@100mslive/react-icons";
import { Dropdown, Text } from "@100mslive/react-ui";
import { useFullscreen } from "../hooks/useFullscreen";

export const FullScreenItem = ({ hoverStyles }) => {
  const { allowed, isFullscreen, toggleFullscreen } = useFullscreen();

  if (!allowed) {
    return null;
  }

  return (
    <Dropdown.Item
      onClick={() => {
        toggleFullscreen();
      }}
      css={hoverStyles}
      data-testid="full_screen_btn"
    >
      <ComputerIcon />
      <Text variant="sm" css={{ ml: "$4" }}>
        {isFullscreen ? "Exit " : ""}Full Screen
      </Text>
    </Dropdown.Item>
  );
};
