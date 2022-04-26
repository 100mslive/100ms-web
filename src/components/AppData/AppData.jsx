import { useHMSActions } from "@100mslive/react-sdk";
import { useEffect } from "react";
import { APP_DATA, UI_SETTINGS } from "../../common/constants";

export function AppData() {
  const hmsActions = useHMSActions();
  useEffect(() => {
    const initialAppData = {
      [APP_DATA.uiSettings]: {
        [UI_SETTINGS.isAudioOnly]: false,
      },
      [APP_DATA.chatOpen]: false,
      [APP_DATA.chatDraft]: "",
    };
    hmsActions.initAppData(initialAppData);
  }, [hmsActions]);

  return null;
}
