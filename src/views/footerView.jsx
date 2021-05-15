import {
  useHMSRoom,
  Button,
  ControlBar,
  HangUpIcon,
} from "@100mslive/sdk-components";
import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory } from "react-router-dom";
import {Settings} from "@100mslive/sdk-components";

const SettingsView = () => {
  const {maxTileCount, setMaxTileCount} = useContext(AppContext);
  const {localPeer} = useHMSRoom();

  //TODO implement HMSLocalPeer to avoid type errors
  const selectedVideoInput = localPeer && localPeer.videoTrack && localPeer.videoTrack.settings && localPeer.videoTrack.settings.deviceId;
  const selectedAudioInput = localPeer && localPeer.audioTrack && localPeer.audioTrack.settings && localPeer.audioTrack.settings.deviceId;

  console.log(maxTileCount);
  const onChange = ({maxTileCount:newMaxTileCount, ...props}) => {
    setMaxTileCount(newMaxTileCount);
  }
  return (
    <>
          <Settings
          initialValues={{maxTileCount, selectedVideoInput, selectedAudioInput}}
          onChange={onChange}
        />,                  
    </>
  )
}

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const { toggleMute, toggleScreenShare, localPeer } = useHMSRoom();
  const {
    isConnected,
    leave,
  } = useContext(AppContext);
  const history = useHistory();

  return (
    <>
      {isConnected && (
        <ControlBar
          leftComponents={[
            <SettingsView key={0}/>
          ]}
          rightComponents={[
            <Button
              shape="rectangle"
              variant={"danger"}
              onClick={() => {
                leave();
                history.push("/");
              }}
              size="lg"
            >
              <HangUpIcon className="mr-2" />
              Leave room
            </Button>,
          ]}
          audioButtonOnClick={async () => await toggleMute("audio")}
          videoButtonOnClick={async () => await toggleMute("video")}
          screenshareButtonOnClick={toggleScreenShare}
          isAudioMuted={!(localPeer.audioTrack && localPeer.audioTrack.enabled)}
          isVideoMuted={!(localPeer.videoTrack && localPeer.videoTrack.enabled)}
          isChatOpen={isChatOpen}
          chatButtonOnClick={toggleChat}
        />
      )}
    </>
  );
};
