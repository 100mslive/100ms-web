import { useCallback } from "react";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { APP_DATA } from "../../common/constants";

export const useChatDraftMessage = () => {
  const hmsActions = useHMSActions();
  let chatDraftMessage = useHMSStore(selectAppData(APP_DATA.chatDraft));
  if (chatDraftMessage === undefined || chatDraftMessage === null) {
    chatDraftMessage = "";
  }
  const setDraftMessage = useCallback(
    message => {
      hmsActions.setAppData(APP_DATA.chatDraft, message, true);
    },
    [hmsActions]
  );
  return [chatDraftMessage, setDraftMessage];
};
