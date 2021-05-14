import {
  useHMSRoom,
  Button,
  ControlBar,
  HangUpIcon,
} from "@100mslive/sdk-components";
import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory } from "react-router-dom";

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const { toggleMute, toggleScreenShare, localPeer } = useHMSRoom();
  const { isConnected, leave, maxTileCount, setMaxTileCount } =
    useContext(AppContext);
  const history = useHistory();

  return (
    <>
      {isConnected && (
        <ControlBar
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
          maxTileCount={maxTileCount}
          setMaxTileCount={setMaxTileCount}
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
