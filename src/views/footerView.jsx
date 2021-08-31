import React, {
  useState,
  useCallback,
  useContext,
  useRef,
  Fragment,
} from "react";
import {
  useHMSStore,
  ControlBar,
  ContextMenu,
  ContextMenuItem,
  HangUpIcon,
  MicOffIcon,
  MicOnIcon,
  CamOffIcon,
  CamOnIcon,
  VirtualBackgroundIcon,
  Button,
  ShareScreenIcon,
  ChatIcon,
  ChatUnreadIcon,
  MusicIcon,
  VerticalDivider,
  MessageModal,
  useHMSActions,
  selectIsLocalScreenShared,
  selectIsLocalAudioEnabled,
  selectIsLocalVideoDisplayEnabled,
  selectUnreadHMSMessagesCount,
  isMobileDevice,
  selectIsAllowedToPublish,
  selectIsLocalVideoPluginPresent,
  selectPermissions,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { HMSVirtualBackgroundPlugin } from "@100mslive/hms-virtual-background";
import { AppContext } from "../store/AppContext";
import { getRandomVirtualBackground } from "../common/utils";
import { MoreSettings } from "./components/MoreSettings";

export const ConferenceFooter = ({ isChatOpen, toggleChat }) => {
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);
  const isLocalAudioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoDisplayEnabled);
  const countUnreadMessages = useHMSStore(selectUnreadHMSMessagesCount);
  const isVBPresent = useHMSStore(
    selectIsLocalVideoPluginPresent("@100mslive/hms-virtual-background")
  );
  const hmsActions = useHMSActions();
  const { isConnected, leave } = useContext(AppContext);
  const history = useHistory();
  const params = useParams();
  const pluginRef = useRef(null);
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);
  const permissions = useHMSStore(selectPermissions);
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const initialModalProps = {
    show: false,
    title: "",
    body: "",
  };
  const [errorModal, setErrorModal] = useState(initialModalProps);

  function createVBPlugin() {
    if (!pluginRef.current) {
      pluginRef.current = new HMSVirtualBackgroundPlugin("none");
    }
  }

  async function startPlugin() {
    //create plugin if not present
    createVBPlugin();
    await pluginRef.current.setBackground(getRandomVirtualBackground());
    //Running VB on every alternate frame rate for optimized cpu usage
    await hmsActions.addPluginToVideoTrack(pluginRef.current, 15);
  }

  async function removePlugin() {
    if (pluginRef.current) {
      await hmsActions.removePluginFromVideoTrack(pluginRef.current);
      pluginRef.current = null;
    }
  }

  function handleVirtualBackground() {
    isVBPresent ? removePlugin() : startPlugin();
  }

  const toggleAudio = useCallback(async () => {
    try {
      await hmsActions.setLocalAudioEnabled(!isLocalAudioEnabled);
    } catch (err) {
      console.error("Cannot toggle audio", err);
    }
  }, [hmsActions, isLocalAudioEnabled]);

  const toggleVideo = useCallback(async () => {
    try {
      await hmsActions.setLocalVideoEnabled(!isLocalVideoEnabled);
    } catch (err) {
      console.error("Cannot toggle video", err);
    }
  }, [hmsActions, isLocalVideoEnabled]);

  const toggleScreenShare = useCallback(
    async (audioOnly = false) => {
      try {
        await hmsActions.setScreenShareEnabled(!isScreenShared, audioOnly);
      } catch (error) {
        if (
          error.description &&
          error.description.includes("denied by system")
        ) {
          setErrorModal({
            show: true,
            title: "Screen share permission denied by OS",
            body: "Please update your OS settings to permit screen share.",
          });
        } else if (error.message && error.message.includes("share audio")) {
          // when share audio not selected with audioOnly screenshare
          setErrorModal({
            show: true,
            title: "Screen share error",
            body: error.message,
          });
        }
      }
    },
    [hmsActions, isScreenShared]
  );

  function leaveRoom() {
    leave();
    if (params.role) {
      history.push("/leave/" + params.roomId + "/" + params.role);
    } else {
      history.push("/leave/" + params.roomId);
    }
  }

  const leftComponents = [];

  if (!isMobileDevice()) {
    //creating VB button for only web
    createVBPlugin();
    if (isAllowedToPublish.screen) {
      leftComponents.push(
        <Button
          key={2}
          iconOnly
          variant="no-fill"
          iconSize="md"
          shape="rectangle"
          onClick={() => toggleScreenShare(true)}
        >
          <MusicIcon />
        </Button>,
        <VerticalDivider key={3} />
      );
    }
    leftComponents.push(
      <Button
        key={4}
        iconOnly
        variant="no-fill"
        iconSize="md"
        shape="rectangle"
        onClick={toggleChat}
        active={isChatOpen}
      >
        {countUnreadMessages === 0 ? <ChatIcon /> : <ChatUnreadIcon />}
      </Button>
    );
  }

  const isPublishing = isAllowedToPublish.video || isAllowedToPublish.audio;

  return isConnected ? (
    <>
      <ControlBar
        leftComponents={leftComponents}
        centerComponents={[
          isAllowedToPublish.audio ? (
            <Button
              iconOnly
              variant="no-fill"
              iconSize="md"
              classes={{ root: "mx-2" }}
              shape="rectangle"
              active={!isLocalAudioEnabled}
              onClick={toggleAudio}
              key={0}
            >
              {!isLocalAudioEnabled ? <MicOffIcon /> : <MicOnIcon />}
            </Button>
          ) : null,
          isAllowedToPublish.video ? (
            <Button
              iconOnly
              variant="no-fill"
              iconSize="md"
              classes={{ root: "mx-2" }}
              shape="rectangle"
              active={!isLocalVideoEnabled}
              onClick={toggleVideo}
              key={1}
            >
              {!isLocalVideoEnabled ? <CamOffIcon /> : <CamOnIcon />}
            </Button>
          ) : null,
          isAllowedToPublish.screen && !isMobileDevice() ? (
            <Button
              key={2}
              iconOnly
              variant="no-fill"
              iconSize="md"
              shape="rectangle"
              classes={{ root: "mx-2" }}
              onClick={() => toggleScreenShare(false)}
            >
              <ShareScreenIcon />
            </Button>
          ) : null,
          isAllowedToPublish.video && pluginRef.current?.isSupported() ? (
            <Button
              iconOnly
              variant="no-fill"
              shape="rectangle"
              active={isVBPresent}
              onClick={handleVirtualBackground}
              classes={{ root: "ml-2" }}
              key={3}
            >
              <VirtualBackgroundIcon />
            </Button>
          ) : null,
          isPublishing && <span key={4} className="mx-2 md:mx-3"></span>,
          isPublishing && <VerticalDivider key={5} />,
          isPublishing && <span key={6} className="mx-2 md:mx-3"></span>,
          <MoreSettings key={7} />,
        ]}
        rightComponents={[
          <ContextMenu
            classes={{
              trigger: "w-auto h-auto",
              root: "static",
              menu: "w-56 bg-white dark:bg-gray-100",
              menuItem: "hover:bg-transparent-0 dark:hover:bg-transparent-0",
            }}
            onTrigger={value => {
              if (permissions?.endRoom) {
                setShowMenu(value);
              } else {
                leaveRoom();
              }
            }}
            menuOpen={showMenu}
            trigger={
              <Button
                size="md"
                shape="rectangle"
                variant="danger"
                iconOnly={isMobileDevice()}
                active={isMobileDevice()}
              >
                <HangUpIcon className={isMobileDevice() ? "" : "mr-2"} />
                {isMobileDevice() ? "" : "Leave room"}
              </Button>
            }
            menuProps={{
              anchorOrigin: {
                vertical: "top",
                horizontal: "center",
              },
              transformOrigin: {
                vertical: 144,
                horizontal: "center",
              },
            }}
          >
            <ContextMenuItem
              label="Leave Room"
              key="leaveRoom"
              classes={{
                menuTitleContainer: "hidden",
                menuItemChildren: "my-2 w-full",
              }}
            >
              <Button
                shape="rectangle"
                variant="standard"
                classes={{ root: "w-full" }}
                onClick={() => {
                  leaveRoom();
                }}
              >
                Leave without ending room
              </Button>
            </ContextMenuItem>

            {permissions?.endRoom && (
              <ContextMenuItem
                label="End Room"
                key="endRoom"
                classes={{
                  menuTitleContainer: "hidden",
                  menuItemChildren: "my-2 w-full",
                }}
              >
                <Button
                  shape="rectangle"
                  variant="danger"
                  classes={{ root: "w-full" }}
                  onClick={() => {
                    setShowEndRoomModal(true);
                  }}
                >
                  End Room for all
                </Button>
              </ContextMenuItem>
            )}
          </ContextMenu>,
        ]}
        audioButtonOnClick={toggleAudio}
        videoButtonOnClick={toggleVideo}
        backgroundButtonOnClick={handleVirtualBackground}
        isAudioMuted={!isLocalAudioEnabled}
        isVideoMuted={!isLocalVideoEnabled}
        isBackgroundEnabled={isVBPresent}
      />
      <MessageModal
        {...errorModal}
        onClose={() => setErrorModal(initialModalProps)}
      />
      <MessageModal
        show={showEndRoomModal}
        onClose={() => {
          setShowEndRoomModal(false);
          setLockRoom(false);
        }}
        title="End Room"
        body="Are you sure you want to end the room?"
        footer={
          <div className="flex">
            <div className="flex items-center">
              <label className="text-base dark:text-white text-gray-100">
                <input
                  type="checkbox"
                  className="mr-1"
                  onChange={() => setLockRoom(prev => !prev)}
                  checked={lockRoom}
                />
                <span>Lock room</span>
              </label>
            </div>
            <Button
              classes={{ root: "mr-3 ml-3" }}
              onClick={() => {
                setShowEndRoomModal(false);
                setLockRoom(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                hmsActions.endRoom(lockRoom, "End Room");
                leaveRoom();
              }}
            >
              End Room
            </Button>
          </div>
        }
      />
    </>
  ) : null;
};
