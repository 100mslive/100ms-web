import {
  useHMSStore,
  ControlBar,
  HangUpIcon,
  TwButton,
  ShareScreenIcon,
  ChatIcon,
  ChatUnreadIcon,
  VerticalDivider,
  useHMSActions,
  selectIsLocalScreenShared,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectUnreadHMSMessagesCount,
} from "@100mslive/hms-video-react";
import { useContext, useCallback } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory, useParams } from "react-router-dom";
import { Settings } from "@100mslive/hms-video-react";

const SettingsView = () => {
  const hmsActions = useHMSActions();
  const {
    loginInfo: { selectedAudioInput, selectedVideoInput },
    setLoginInfo,
    setMaxTileCount,
  } = useContext(AppContext);

  const onChange = ({
    maxTileCount: newMaxTileCount,
    selectedVideoInput: newSelectedVideoInput,
    selectedAudioInput: newSelectedAudioInput,
  }) => {
    setMaxTileCount(newMaxTileCount);
    if (selectedAudioInput !== newSelectedAudioInput) {
      hmsActions.setAudioSettings({ deviceId: newSelectedAudioInput });
      setLoginInfo({ selectedAudioInput: newSelectedAudioInput });
    }

    if (selectedVideoInput !== newSelectedVideoInput) {
      hmsActions.setVideoSettings({ deviceId: newSelectedVideoInput });
      setLoginInfo({ selectedVideoInput: newSelectedVideoInput });
    }
  };
  return (
    <>
      <Settings onChange={onChange} />
    </>
  );
};

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const countUnreadMessages = useHMSStore(selectUnreadHMSMessagesCount);
  const hmsActions = useHMSActions();
  const { isConnected, leave } = useContext(AppContext);
  const history = useHistory();
  const params = useParams();

  const toggleScreenShare = useCallback(() => {
    hmsActions.setScreenShareEnabled(!isScreenShared);
  }, [hmsActions, isScreenShared]);

  return (
    <>
      {isConnected && (
        <ControlBar
          leftComponents={[
            <SettingsView key={0} />,
            <VerticalDivider key={1} />,
            <TwButton
              key={2}
              iconOnly
              variant={"no-fill"}
              iconSize="md"
              shape={"rectangle"}
              onClick={toggleScreenShare}
            >
              <ShareScreenIcon />
            </TwButton>,
            <VerticalDivider key={3} />,
            <TwButton
              key={4}
              iconOnly
              variant={"no-fill"}
              iconSize="md"
              shape={"rectangle"}
              onClick={toggleChat}
              active={isChatOpen}
            >
              {countUnreadMessages === 0 ? <ChatIcon /> : <ChatUnreadIcon />}
            </TwButton>,
          ]}
          rightComponents={[
            <TwButton
              key={0}
              size="md"
              shape={"rectangle"}
              variant={"danger"}
              onClick={() => {
                leave();
                history.push("/leave/" + params.roomId);
              }}
            >
              <HangUpIcon className="mr-2" />
              Leave room
            </TwButton>,
          ]}
          audioButtonOnClick={() =>
            hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)
          }
          videoButtonOnClick={() =>
            hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled)
          }
          isAudioMuted={!isLocalAudioEnabled}
          isVideoMuted={!isLocalVideoEnabled}
        />
      )}
    </>
  );
};
