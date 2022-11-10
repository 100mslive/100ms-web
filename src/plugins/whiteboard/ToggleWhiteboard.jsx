import { PencilDrawIcon } from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/react-ui";
import IconButton from "../../IconButton";
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
