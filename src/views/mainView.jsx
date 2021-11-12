import React, { useEffect, useContext } from "react";
import {
  useHMSStore,
  useHMSActions,
  HMSRoomState,
  selectPeerSharingAudio,
  selectPeerScreenSharing,
  selectPeerSharingVideoPlaylist,
  selectRoomState,
  selectLocalPeer,
} from "@100mslive/hms-video-react";
import { ScreenShareView } from "./screenShareView";
import { MainGridView } from "./mainGridView";
import { AppContext } from "../store/AppContext";
import { isJSONString } from "../common/utils";

export const ConferenceMainView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const peerSharing = useHMSStore(selectPeerScreenSharing);
  const peerSharingAudio = useHMSStore(selectPeerSharingAudio);
  const peerSharingPlaylist = useHMSStore(selectPeerSharingVideoPlaylist);
  const roomState = useHMSStore(selectRoomState);
  const hmsActions = useHMSActions();
  const { audioPlaylist, videoPlaylist } = useContext(AppContext);

  useEffect(() => {
    // set list only when room state is connected
    if (roomState !== HMSRoomState.Connected) {
      return;
    }
    hmsActions.videoPlaylist.setList(videoPlaylist);
    hmsActions.audioPlaylist.setList(audioPlaylist);
  }, [roomState]); //eslint-disable-line

  if (!localPeer) {
    // we don't know the role yet to decide how to render UI
    return null;
  }

  const videoTileProps = function (HMSPeer, HMSTrack) {
    const customerDescription = HMSPeer.customerDescription;
    const data =
      customerDescription && isJSONString(customerDescription)
        ? JSON.parse(customerDescription)
        : undefined;
    const isHandRaised = typeof data === "object" ? data.raiseHand : false;
    return { isHandRaised: isHandRaised };
  };

  let ViewComponent;

  if (
    (peerSharing && peerSharing.id !== peerSharingAudio?.id) ||
    peerSharingPlaylist
  ) {
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
        videoTileProps={videoTileProps}
      />
    )
  );
};
