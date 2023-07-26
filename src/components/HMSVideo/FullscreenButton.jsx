import { Flex, IconButton, Tooltip } from "@100mslive/roomkit-react";

export const FullScreenButton = ({ isFullScreen, icon, onToggle }) => {
  return (
    <Tooltip title={`${isFullScreen ? "Exit" : "Go"} fullscreen`} side="top">
      <IconButton
        variant="standard"
        css={{ margin: "0px" }}
        onClick={onToggle}
        key="fullscreen_btn"
        data-testid="fullscreen_btn"
      >
        <Flex>{icon}</Flex>
      </IconButton>
    </Tooltip>
  );
};
