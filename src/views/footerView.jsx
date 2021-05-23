import {
  useHMSStore,
  ControlBar,
  HangUpIcon,
  TwButton,
  ShareScreenIcon,
  ChatIcon,
  VerticalDivider,
  useHMSActions,
  selectIsLocalScreenShared,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
} from "@100mslive/sdk-components";
import { useContext } from "react";
import { AppContext } from "../store/AppContext";
import { useHistory } from "react-router-dom";
import {Settings} from "@100mslive/sdk-components";

const SettingsView = () => {
  const {maxTileCount, setMaxTileCount} = useContext(AppContext);
  console.log(maxTileCount);
  const onChange = ({maxTileCount:newMaxTileCount}) => {
    setMaxTileCount(newMaxTileCount);
  }
  return (
    <>
          <Settings
          onChange={onChange}
        />                  
    </>
  )
}

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const hmsActions = useHMSActions();
  const { isConnected, leave } = useContext(AppContext);
  const history = useHistory();

  const toggleScreenShare = () => {
      hmsActions.setScreenShareEnabled(!isScreenShared);
  }

  return (
    <>
      {isConnected && (
        <ControlBar
          leftComponents={[
            <SettingsView key={0}/>,
            <VerticalDivider key={1}/>,
            <TwButton key={2}
              iconOnly
              variant={'no-fill'}
              iconSize="md"
              shape={'rectangle'}
              onClick={toggleScreenShare}
              >
                <ShareScreenIcon/>
            </TwButton>,
            <VerticalDivider key={3}/>,
            <TwButton
              key={4}
              iconOnly
              variant={'no-fill'}
              iconSize='md'
              shape={'rectangle'}
              onClick={toggleChat}
              active={isChatOpen}
              >
                <ChatIcon />
            </TwButton>,
          ]}
          rightComponents={[
            <TwButton
                key={0}
                size='md'
                shape={'rectangle'}
                variant={'danger'}
                onClick={() => {
                  leave();
                  history.push("/");
                }}
            >
              <HangUpIcon className="mr-2" />
              Leave room
            </TwButton>
          ]}
          audioButtonOnClick={() => hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled)}
          videoButtonOnClick={() => hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled)}
          isAudioMuted={!isLocalAudioEnabled}
          isVideoMuted={!isLocalVideoEnabled}
        />
      )}
    </>
  );
};
