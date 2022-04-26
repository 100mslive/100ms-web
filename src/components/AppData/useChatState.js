import { useCallback } from "react";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { APP_DATA } from "../../common/constants";

export const useIsChatOpen = () => {
  const isChatOpen = useHMSStore(selectAppData(APP_DATA.chatOpen));
  return !!isChatOpen;
};

export const useToggleChat = () => {
  const hmsActions = useHMSActions();
  const vanillaStore = useHMSVanillaStore();
  const toggleChat = useCallback(() => {
    const isChatOpen = vanillaStore.getState(selectAppData(APP_DATA.chatOpen));
    hmsActions.setAppData(APP_DATA.chatOpen, !isChatOpen, true);
  }, [vanillaStore, hmsActions]);
  return toggleChat;
};

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
