import { PauseIcon, PlayIcon } from "@100mslive/react-icons";
import { IconButton, Tooltip } from "@100mslive/react-ui";

export const PlayButton = ({ onClick, isPaused }) => {
  return (
    <Tooltip title={`${isPaused ? "Play" : "Pause"}`} side="top">
      <IconButton onClick={onClick} data-testid="play_pause_btn">
        {isPaused ? (
          <PlayIcon width={32} height={32} />
        ) : (
          <PauseIcon width={32} height={32} />
        )}
      </IconButton>
    </Tooltip>
  );
};
