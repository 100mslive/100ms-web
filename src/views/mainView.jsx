import React, {useEffect} from "react";
import {
  selectLocalPeer,
  selectIsSomeoneScreenSharing,
  useHMSStore,
    useHMSActions
} from "@100mslive/hms-video-react";
import { ScreenShareView } from "./screenShareView";
import { MainGridView } from "./mainGridView";
import {HMSBackgroundProcessor} from "@100mslive/hms-virtual-background";

export const ConferenceMainView = ({
  isChatOpen,
  toggleChat,
  isParticipantListOpen,
}) => {
  const localPeer = useHMSStore(selectLocalPeer);
  const isSomeoneScreenSharing = useHMSStore(selectIsSomeoneScreenSharing);
  const hmsActions = useHMSActions();

  async function startProcessor(){
    const processor = new HMSBackgroundProcessor("blur", 30);
    window.BGPROCESSOR = processor;
    console.log("Processor", processor);
    window.HMSACTION = hmsActions;
    await hmsActions.addVideoProcessor(processor);
  }
  //
  useEffect(() =>{
    if(localPeer && localPeer.videoTrack){
     startProcessor();
    }
  },[localPeer]);

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
        isParticipantListOpen={isParticipantListOpen}
      />
    )
  );
};
