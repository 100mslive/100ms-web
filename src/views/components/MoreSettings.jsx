import React, {
  useState,
  useContext,
  Fragment,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  HamburgerMenuIcon,
  PersonIcon,
  Settings,
  UiSettings,
  SettingsIcon,
  useHMSStore,
  selectAvailableRoleNames,
  selectLocalPeer,
  TickIcon,
  GridIcon,
  ArrowRightIcon,
  useHMSActions,
  selectPermissions,
  FullScreenIcon,
  MessageModal,
  Text,
  RecordIcon,
  selectRecordingState,
  selectRTMPState,
  StarIcon,
} from "@100mslive/hms-video-react";
import { AppContext } from "../../store/AppContext";
import { hmsToast } from "./notifications/hms-toast";
import { arrayIntersection, setFullScreenEnabled } from "../../common/utils";
import screenfull from "screenfull";
import { RecordingAndRTMPForm } from "./RecordingAndRTMPForm";
import { MuteAll } from "./MuteAll";

const defaultMeetingUrl =
  window.location.href.replace("meeting", "preview") + "?token=beam_recording";

export const MoreSettings = () => {
  const {
    setMaxTileCount,
    maxTileCount,
    subscribedNotifications,
    setSubscribedNotifications,
    appPolicyConfig: { selfRoleChangeTo },
  } = useContext(AppContext);
  const roles = useHMSStore(selectAvailableRoleNames);
  const localPeer = useHMSStore(selectLocalPeer);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();
  const [showMenu, setShowMenu] = useState(false);
  const [showMuteAll, setShowMuteAll] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUiSettings, setShowUiSettings] = useState(false);
  const [showRecordingAndRTMPModal, setShowRecordingAndRTMPModal] =
    useState(false);

  const [meetingURL, setMeetingURL] = useState(defaultMeetingUrl);
  const [rtmpURL, setRtmpURL] = useState("");
  const recording = useHMSStore(selectRecordingState);
  const rtmp = useHMSStore(selectRTMPState);
  const [isRecordingOn, setIsRecordingOn] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(
    screenfull.isFullscreen
  );

  const availableSelfChangeRoles = useMemo(
    () => arrayIntersection(selfRoleChangeTo, roles),
    [roles, selfRoleChangeTo]
  );

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        setIsFullScreenEnabled(screenfull.isFullscreen);
      });
    }
  }, []);

  const onChange = count => {
    setMaxTileCount(count);
  };

  const onNotificationChange = notification => {
    setSubscribedNotifications(notification);
  };

  const uiSettingsProps = {
    sliderProps: {
      onTileCountChange: onChange,
      maxTileCount,
    },
    notificationProps: {
      onNotificationChange,
      subscribedNotifications,
    },
  };
  const getText = useCallback(() => {
    let text = "";
    if (rtmp.running) {
      text += "Streaming";
    }
    if (recording.browser.running) {
      if (text) text += "/";
      text += "Recording";
    }
    text += " is running";
    return text;
  }, [recording.browser.running, rtmp.running]);

  const startStopRTMPRecording = async action => {
    try {
      if (action === "start") {
        await hmsActions.startRTMPOrRecording({
          meetingURL,
          rtmpURLs: rtmpURL.length > 0 ? [rtmpURL] : undefined,
          record: isRecordingOn,
        });
      } else {
        await hmsActions.stopRTMPAndRecording();
      }
    } catch (error) {
      console.error("failed to start/stop rtmp/recording", error);
      hmsToast(error.message);
    } finally {
      setMeetingURL("");
      setRtmpURL("");
      setIsRecordingOn(false);
      setShowRecordingAndRTMPModal(false);
    }
  };

  return (
    <Fragment>
      <ContextMenu
        menuOpen={showMenu}
        onTrigger={value => {
          setShowMenu(value);
        }}
        classes={{
          root: "static",
          trigger: "bg-transparent-0",
          menu: "mt-0 py-0 w-52",
        }}
        trigger={
          <Button
            iconOnly
            variant="no-fill"
            iconSize="md"
            shape="rectangle"
            active={showMenu}
            key="hamburgerIcon"
          >
            <HamburgerMenuIcon />
          </Button>
        }
        menuProps={{
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
        }}
      >
        {permissions.changeRole && (
          <ContextMenuItem
            icon={<PersonIcon />}
            label="Change my role"
            key="changeRole"
            classes={{
              menuTitleContainer: "relative",
              menuItemChildren: "hidden",
            }}
            closeMenuOnClick={false}
            iconRight={<ArrowRightIcon />}
            onClick={event => {
              setAnchorEl(anchorEl ? null : event.currentTarget);
            }}
            active={!!anchorEl}
          >
            {anchorEl && (
              <ContextMenu
                classes={{ trigger: "bg-transparent-0", menu: "w-44" }}
                menuOpen
                menuProps={{
                  anchorEl: anchorEl,
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                  },
                  transformOrigin: {
                    vertical: "center",
                    horizontal: -12,
                  },
                }}
                trigger={<div className="absolute w-full h-0"></div>}
              >
                {availableSelfChangeRoles.map(role => {
                  return (
                    <ContextMenuItem
                      label={role}
                      key={role}
                      onClick={async () => {
                        try {
                          await hmsActions.changeRole(localPeer.id, role, true);
                          setShowMenu(false);
                        } catch (error) {
                          hmsToast(error.message);
                        }
                      }}
                      iconRight={
                        localPeer && localPeer.roleName === role ? (
                          <TickIcon width={16} height={16} />
                        ) : null
                      }
                    />
                  );
                })}
              </ContextMenu>
            )}
          </ContextMenuItem>
        )}
        <ContextMenuItem
          icon={<RecordIcon />}
          label="Streaming/Recording"
          key="streaming-recording"
          onClick={() => {
            setMeetingURL(defaultMeetingUrl);
            setShowRecordingAndRTMPModal(true);
          }}
        />
        {screenfull.isEnabled && (
          <ContextMenuItem
            icon={<FullScreenIcon />}
            label={`${isFullScreenEnabled ? "Exit " : ""}Full Screen`}
            key="toggleFullScreen"
            onClick={() => {
              setFullScreenEnabled(!isFullScreenEnabled);
            }}
          />
        )}
        {permissions.mute && (
          <ContextMenuItem
            label="Mute All"
            icon={<StarIcon />}
            onClick={() => {
              setShowMuteAll(true);
            }}
          />
        )}
        <ContextMenuItem
          icon={<GridIcon />}
          label="UI Settings"
          key="changeLayout"
          addDivider={true}
          onClick={() => {
            setShowUiSettings(true);
          }}
        />
        <ContextMenuItem
          icon={<SettingsIcon />}
          label="Device Settings"
          key="settings"
          onClick={() => {
            setShowSettings(true);
          }}
        />
      </ContextMenu>
      <Settings
        className="hidden"
        showModal={showSettings}
        onModalClose={() => setShowSettings(false)}
      />
      <UiSettings
        {...uiSettingsProps}
        showModal={showUiSettings}
        onModalClose={() => setShowUiSettings(false)}
      />
      <MuteAll
        showModal={showMuteAll}
        onCloseModal={() => setShowMuteAll(false)}
      />
      <MessageModal
        title="Start Streaming/Recording"
        body={
          <RecordingAndRTMPForm
            meetingURL={meetingURL}
            RTMPURLs={rtmpURL}
            isRecordingOn={isRecordingOn}
            recordingStatus={recording.browser.running}
            rtmpStatus={rtmp.running}
            setIsRecordingOn={setIsRecordingOn}
            setMeetingURL={setMeetingURL}
            setRTMPURLs={setRtmpURL}
          />
        }
        footer={
          <>
            {(recording.browser.running || rtmp.running) && (
              <Text
                variant="body"
                size="md"
                classes={{ root: "mx-2 self-center text-yellow-500" }}
              >
                {getText()}
              </Text>
            )}
            <div className="space-x-1">
              <Button
                variant="danger"
                shape="rectangle"
                onClick={() => startStopRTMPRecording("stop")}
                disabled={!recording.browser.running && !rtmp.running}
              >
                Stop All
              </Button>
              <Button
                variant="emphasized"
                shape="rectangle"
                onClick={() => startStopRTMPRecording("start")}
                disabled={recording.browser.running || rtmp.running}
              >
                Start
              </Button>
            </div>
          </>
        }
        show={showRecordingAndRTMPModal}
        onClose={() => setShowRecordingAndRTMPModal(false)}
      />
    </Fragment>
  );
};
