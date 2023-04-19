import { selectLocalPeerRoleName, useHMSStore } from "@100mslive/react-sdk";
import { PencilDrawIcon } from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/react-ui";
import IconButton from "../../IconButton";
import { useHLSViewerRole } from "../../components/AppData/useUISettings";
import { useIsFeatureEnabled } from "../../components/hooks/useFeatures";
import { useWhiteboardMetadata } from "./useWhiteboardMetadata";
import { FEATURE_LIST } from "../../common/constants";

export const ToggleWhiteboard = () => {
  const {
    whiteboardEnabled,
    whiteboardOwner: whiteboardActive,
    amIWhiteboardOwner,
    toggleWhiteboard,
  } = useWhiteboardMetadata();
  const hlsViewerRole = useHLSViewerRole();
  const localPeerRole = useHMSStore(selectLocalPeerRoleName);
  const isFeatureEnabled = useIsFeatureEnabled(FEATURE_LIST.WHITEBOARD);

  if (
    !whiteboardEnabled ||
    localPeerRole === hlsViewerRole ||
    !isFeatureEnabled
  ) {
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
