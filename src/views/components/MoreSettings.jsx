import React, {
  useState,
  useContext,
  Fragment,
  useMemo,
  useEffect,
} from "react";
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  HamburgerMenuIcon,
  PersonIcon,
  Settings,
  ParticipantsInView,
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
} from "@100mslive/hms-video-react";
import { AppContext } from "../../store/AppContext";
import { hmsToast } from "./notifications/hms-toast";
import { arrayIntersection, setFullScreenEnabled } from "../../common/utils";
import screenfull from "screenfull";
import { RecordingAndRTMPForm } from "./RecordingAndRTMPForm";

export const MoreSettings = () => {
  const {
    setMaxTileCount,
    maxTileCount,
    appPolicyConfig: { selfRoleChangeTo },
  } = useContext(AppContext);
  const roles = useHMSStore(selectAvailableRoleNames);
  const localPeer = useHMSStore(selectLocalPeer);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showParticipantsInView, setShowParticipantsInView] = useState(false);
  const [showRecordingAndRTMP, setShowRecordingAndRTMP] = useState(false);

  const [meeting_url, setMeetingURL] = useState(
    `https://fullscreen.qa-app.100ms.live/preview/614ac265ec8e7f242b77404b/beam?token=beam_recording`
    // `https://youtu.be/LKbzXBEU-lg`
  );
  const [rtmp_url, setRTMPURLs] = useState(
    `rtmp://blr01.contribute.live-video.net/app/live_727369748_GlgwzwWIfksqHYIesfawCkXFwKnRa7`
  );
  const [record, setIsRecordingOn] = useState(false);

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

  const handleClick = async () => {
    try {
      const rtmp_urls = new Array(rtmp_url);
      console.log(meeting_url, rtmp_urls, record);
      hmsActions.startRTMPOrRecording(meeting_url, rtmp_urls, record);
    } catch (e) {
      // log for errors
      console.log("RTMP start error ====>", e);
    }
  };

  const handleClick2 = async () => {
    try {
      hmsActions.stopRTMPAndRecording();
    } catch (e) {
      console.log("RTMP stop error ====>", e);
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
        <ContextMenuItem
          icon={<GridIcon />}
          label="Change Layout"
          key="changeLayout"
          onClick={() => {
            setShowParticipantsInView(true);
          }}
        />
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
          icon={<SettingsIcon />}
          label="Start Streaming"
          key="settings"
          addDivider={true}
          onClick={() => {
            setShowRecordingAndRTMP(true);
          }}
        />
        <ContextMenuItem
          icon={<SettingsIcon />}
          label="Device Settings"
          key="settings"
          addDivider={true}
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
      <ParticipantsInView
        onTileCountChange={onChange}
        maxTileCount={maxTileCount}
        showModal={showParticipantsInView}
        onModalClose={() => setShowParticipantsInView(false)}
      />
      <MessageModal
        title="Start Streaming & Recording"
        body={
          <RecordingAndRTMPForm
            meetingURL={meeting_url}
            RTMPURLs={rtmp_url}
            isRecordingOn={record}
            setIsRecordingOn={setIsRecordingOn}
            setMeetingURL={setMeetingURL}
            setRTMPURLs={setRTMPURLs}
          />
        }
        footer={
          <div className="text-center">
            <Button shape="rectangle" onClick={handleClick2}>
              Stop
            </Button>
            <Button shape="rectangle" onClick={handleClick}>
              Start
            </Button>
          </div>
        }
        show={showRecordingAndRTMP}
        onClose={() => setShowRecordingAndRTMP(false)}
      />
    </Fragment>
  );
};
