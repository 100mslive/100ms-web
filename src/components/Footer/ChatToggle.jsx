import {
  selectUnreadHMSMessagesCount,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ChatIcon, ChatUnreadIcon } from "@100mslive/react-icons";
import { Tooltip } from "@100mslive/react-ui";
import IconButton from "../../IconButton";
import {
  useIsSidepaneTypeOpen,
  useSidepaneToggle,
} from "../AppData/useSidepane";
import { SIDE_PANE_OPTIONS } from "../../common/constants";

export const ChatToggle = () => {
  const countUnreadMessages = useHMSStore(selectUnreadHMSMessagesCount);
  const isChatOpen = useIsSidepaneTypeOpen(SIDE_PANE_OPTIONS.CHAT);
  const toggleChat = useSidepaneToggle(SIDE_PANE_OPTIONS.CHAT);

  return (
    <Tooltip key="chat" title={`${isChatOpen ? "Close" : "Open"} chat`}>
      <IconButton
        onClick={toggleChat}
        active={!isChatOpen}
        data-testid="chat_btn"
      >
        {countUnreadMessages === 0 ? (
          <ChatIcon />
        ) : (
          <ChatUnreadIcon data-testid="chat_unread_btn" />
        )}
      </IconButton>
    </Tooltip>
  );
};
