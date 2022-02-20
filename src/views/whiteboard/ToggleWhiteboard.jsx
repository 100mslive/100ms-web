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
        onClick={toggleWhiteboard}
        active={!whiteboardActive}
        disabled={whiteboardActive && !amIWhiteboardOwner}
      >
        <PencilDrawIcon />
      </IconButton>
    </Tooltip>
  );
};
