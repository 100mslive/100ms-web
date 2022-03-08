import { ShareScreenIcon } from "@100mslive/react-icons";
import {
  selectIsAllowedToPublish,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { isScreenshareSupported } from "../common/utils";

export const Screenshare = ({ css }) => {
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    toggleScreenShare,
  } = useScreenShare();
  const isVideoScreenshare = amIScreenSharing && !!video;
  if (!isAllowedToPublish.screen || !isScreenshareSupported()) {
    return null;
  }
  return (
    <Tooltip title={`${!isVideoScreenshare ? "Start" : "Stop"} Screen sharing`}>
      <IconButton
        active={!isVideoScreenshare}
        css={css}
        onClick={() => {
          toggleScreenShare();
        }}
      >
        <ShareScreenIcon />
      </IconButton>
    </Tooltip>
  );
};
