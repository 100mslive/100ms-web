import { ShareScreenIcon } from "@100mslive/react-icons";
import {
  selectIsAllowedToPublish,
  useHMSStore,
  useScreenShare,
} from "@100mslive/react-sdk";
import { IconButton, Tooltip } from "@100mslive/react-ui";
import { UI_SETTINGS } from "../common/constants";
import { isScreenshareSupported } from "../common/utils";
import { useUISettings } from "./AppData/useUISettings";

export const ScreenshareToggle = ({ css }) => {
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const isAudioOnly = useUISettings(UI_SETTINGS.isAudioOnly);
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
        disabled={isAudioOnly}
        onClick={() => {
          toggleScreenShare();
        }}
        data-testid="screen_share_btn"
      >
        <ShareScreenIcon />
      </IconButton>
    </Tooltip>
  );
};
