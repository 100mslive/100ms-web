import { useRecordingStreaming } from "@100mslive/react-sdk";
import { Button } from "@100mslive/react-ui";
import { GoLiveIcon } from "@100mslive/react-icons";
import {
  useSidepaneToggle,
  useIsSidepaneTypeOpen,
} from "./AppData/useSidepane";
import { SIDE_PANE_OPTIONS } from "./../common/constants";

const GoLiveButton = () => {
  const isStreamingSidepaneOpen = useIsSidepaneTypeOpen(
    SIDE_PANE_OPTIONS.STREAMING
  );
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  const { isHLSRunning, isRTMPRunning } = useRecordingStreaming();
  if (isHLSRunning && !isRTMPRunning) {
    return null;
  }
  return (
    <Button
      variant={isStreamingSidepaneOpen ? "standard" : "primary"}
      onClick={toggleStreaming}
      icon
    >
      <GoLiveIcon />
      Go Live
    </Button>
  );
};

export default GoLiveButton;
