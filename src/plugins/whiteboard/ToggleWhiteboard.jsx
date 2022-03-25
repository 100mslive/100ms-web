import { IconButton, Tooltip } from "@100mslive/react-ui";
import { PencilDrawIcon } from "@100mslive/react-icons";
import { useWhiteboardMetadata } from "./useWhiteboardMetadata";

export const ToggleWhiteboard = () => {
  const {
    whiteboardEnabled,
    whiteboardOwner: whiteboardActive,
    amIWhiteboardOwner,
    toggleWhiteboard,
  } = useWhiteboardMetadata();

  if (!whiteboardEnabled) {
    return null;
  }

  return (
    <Tooltip
      title={`${
        whiteboardActive
          ? amIWhiteboardOwner
            ? `Stop whiteboard`
            : `Can't stop whiteboard`
          : "Start whiteboard"
      }`}
      key="whiteboard"
    >
      <IconButton
        css={{
          mx: "$4",
        }}
        onClick={toggleWhiteboard}
        active={!whiteboardActive}
        disabled={whiteboardActive && !amIWhiteboardOwner}
        data-testid="white_board_btn"
      >
        <PencilDrawIcon />
      </IconButton>
    </Tooltip>
  );
};
