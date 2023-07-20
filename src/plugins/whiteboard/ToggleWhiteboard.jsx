import { selectLocalPeerRoleName, useHMSStore } from "@100mslive/react-sdk";
import { WidgetCard } from "../../components/Footer/WidgetCard";
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
    <WidgetCard
      title="Whiteboard"
      subtitle={`${
        whiteboardActive
          ? amIWhiteboardOwner
            ? `Stop whiteboard`
            : `Can't stop whiteboard as it was started by another peer`
          : "Collaboratively sketch ideas"
      }`}
      imageSrc={require("../../images/whiteboard.png")}
      onClick={() => toggleWhiteboard()}
    />
  );
};
