import { useCallback } from "react";
import { useCustomEvent, useHMSActions } from "@100mslive/react-sdk";
import { REMOTE_STOP_SCREENSHARE_TYPE } from "../common/constants";

export function RemoteStopScreenshare() {
  const actions = useHMSActions();

  const onRemoteStopScreenshare = useCallback(async () => {
    await actions.setScreenShareEnabled(false);
  }, [actions]);

  useCustomEvent({
    type: REMOTE_STOP_SCREENSHARE_TYPE,
    onEvent: onRemoteStopScreenshare,
  });

  return <></>;
}
