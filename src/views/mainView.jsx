import React from "react";
import {
  selectLocalPeer,
  selectIsSomeoneScreenSharing,
  useHMSStore,
} from "@100mslive/hms-video-react";
import { ScreenShareView } from "./screenShareView";
import { MainGridView } from "./mainGridView";

export const ConferenceMainView = ({ isChatOpen, toggleChat }) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const isSomeoneScreenSharing = useHMSStore(selectIsSomeoneScreenSharing);

  if (!localPeer) {
    // we don't know the role yet to decide how to render UI
    return null;
  }

  let ViewComponent;

  if (isSomeoneScreenSharing) {
    ViewComponent = ScreenShareView;
  } else {
    ViewComponent = MainGridView;
  }

  return (
    ViewComponent && (
      <ViewComponent
        isChatOpen={isChatOpen}
        toggleChat={toggleChat}
        role={localPeer.role}
      />
    )
  );
};
