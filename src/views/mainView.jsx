import React from "react";

import {
  selectLocalPeer,
  selectIsSomeoneScreenSharing,
  useHMSStore,
  selectPeerScreenSharing,
  selectScreenShareByPeerID,
} from "@100mslive/hms-video-react";
import { ScreenShareView } from "./screenShareView";
import { MainGridView } from "./mainGridView";

export const ConferenceMainView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const peerScreenSharing = useHMSStore(selectPeerScreenSharing);
  const isSomeoneScreenSharing = useHMSStore(selectIsSomeoneScreenSharing);
  const screenshareVidoeTrack = useHMSStore(
    selectScreenShareByPeerID(peerScreenSharing?.id)
  );

  if (!localPeer) {
    // we don't know the role yet to decide how to render UI
    return null;
  }

  let ViewComponent;

  if (isSomeoneScreenSharing && screenshareVidoeTrack) {
    ViewComponent = ScreenShareView;
  } else {
    ViewComponent = MainGridView;
  }

  return (
    ViewComponent && (
      <ViewComponent
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        role={localPeer.roleName}
        isParticipantListOpen={isParticipantListOpen}
      />
    )
  );
};
