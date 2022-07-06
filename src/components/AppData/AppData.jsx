import { useEffect } from "react";
import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { useSidepaneReset, useSidepaneState } from "./useSidepane";
import { APP_DATA, UI_SETTINGS } from "../../common/constants";

export const getAppDetails = appDetails => {
  try {
    return !appDetails ? {} : JSON.parse(appDetails);
  } catch (error) {
    return {};
  }
};

export function AppData({ appDetails, recordingUrl }) {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const sidePane = useSidepaneState();
  const resetSidePane = useSidepaneReset();

  useEffect(() => {
    if (!isConnected && sidePane) {
      resetSidePane();
    }
  }, [isConnected, sidePane, resetSidePane]);

  useEffect(() => {
    const initialAppData = {
      [APP_DATA.uiSettings]: {
        [UI_SETTINGS.isAudioOnly]: false,
        [UI_SETTINGS.isHeadless]: false,
      },
      [APP_DATA.chatOpen]: false,
      [APP_DATA.chatDraft]: "",
      [APP_DATA.sidePane]: "",
      [APP_DATA.recordingUrl]: recordingUrl,
      [APP_DATA.appConfig]: getAppDetails(appDetails),
    };
    hmsActions.initAppData(initialAppData);
  }, [hmsActions, appDetails, recordingUrl]);

  return null;
}
