import { Flex, IconButton, Tooltip } from "@100mslive/react-ui";

export const FullScreenButton = ({ icon, onToggle }) => {
  return (
    <Tooltip title="Go fullscreen" side="top">
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
