import {
  useHMSStore,
  ControlBar,
  HangUpIcon,
  Button,
  ShareScreenIcon,
  ChatIcon,
  ChatUnreadIcon,
  VerticalDivider,
  useHMSActions,
  selectIsLocalScreenShared,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectUnreadHMSMessagesCount,
} from '@100mslive/hms-video-react';
import { useContext, useCallback } from 'react';
import { AppContext } from '../store/AppContext';
import { useHistory, useParams } from 'react-router-dom';
import { Settings } from '@100mslive/hms-video-react';
import { ROLES } from '../common/roles';

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
  const { isConnected, leave, loginInfo: { role } } = useContext(AppContext);
  const history = useHistory();
  const params = useParams();

  const toggleScreenShare = useCallback(() => {
    hmsActions.setScreenShareEnabled(!isScreenShared);
  }, [hmsActions, isScreenShared]);

  const leftComponents = [
    <SettingsView key={0} />,
    <VerticalDivider key={1} />,
    <Button
      key={2}
      iconOnly
      variant={'no-fill'}
      iconSize='md'
      shape={'rectangle'}
      onClick={toggleScreenShare}
    >
      <ShareScreenIcon />
    </Button>,
    <VerticalDivider key={3} />,
    <Button
      key={4}
      iconOnly
      variant={'no-fill'}
      iconSize='md'
      shape={'rectangle'}
      onClick={toggleChat}
      active={isChatOpen}
    >
      {countUnreadMessages === 0 ? <ChatIcon /> : <ChatUnreadIcon />}
    </Button>,
  ];
  // Remove ScreenShare and the next divider for Viewer role
  if(role === ROLES.VIEWER) {
    leftComponents.splice(2,2);
  }

  return (
    <>
      {isConnected && (
        <ControlBar
          leftComponents={leftComponents}
          rightComponents={[
            <Button
              key={0}
              size='md'
              shape={'rectangle'}
              variant={'danger'}
              onClick={() => {
                leave();
                history.push('/leave/' + params.roomId);
              }}
            >
              <HangUpIcon className='mr-2' />
              Leave room
            </Button>,
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
