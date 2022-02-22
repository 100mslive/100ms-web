import { ShareScreenIcon } from "@100mslive/react-icons";
import {
  selectIsAllowedToPublish,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { IconButton, Tooltip } from "@100mslive/react-ui";

export const Screenshare = ({ css }) => {
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const {
    amIScreenSharing,
    screenShareVideoTrackId: video,
    toggleScreenShare,
  } = useScreenShare();
  const isVideoScreenshare = amIScreenSharing && !!video;
  if (!isAllowedToPublish.screen) {
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
