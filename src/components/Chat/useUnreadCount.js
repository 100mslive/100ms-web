import {
  selectMessagesUnreadCountByPeerID,
  selectMessagesUnreadCountByRole,
  selectUnreadHMSMessagesCount,
  useHMSStore,
} from "@100mslive/react-sdk";

export const useUnreadCount = ({ role, peerId }) => {
  const unreadCountSelector = role
    ? selectMessagesUnreadCountByRole(role)
    : peerId
    ? selectMessagesUnreadCountByPeerID(peerId)
    : selectUnreadHMSMessagesCount;

  const unreadCount = useHMSStore(unreadCountSelector);
  return unreadCount;
};
