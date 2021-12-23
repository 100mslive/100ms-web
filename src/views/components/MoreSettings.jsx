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
  RecordIcon,
  StarIcon,
  ChangeTextIcon,
} from "@100mslive/hms-video-react";
import { AppContext } from "../../store/AppContext";
import { hmsToast } from "./notifications/hms-toast";
import { arrayIntersection, setFullScreenEnabled } from "../../common/utils";
import screenfull from "screenfull";
import { RecordingAndRTMPModal } from "./RecordingAndRTMPModal";
import { MuteAll } from "./MuteAll";
import { ChangeName } from "./ChangeName";

export const MoreSettings = () => {
  const {
    setMaxTileCount,
    maxTileCount,
    subscribedNotifications,
    setSubscribedNotifications,
    uiViewMode,
    setuiViewMode,
    appPolicyConfig: { selfRoleChangeTo },
    HLS_VIEWER_ROLE,
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

  const [anchorEl, setAnchorEl] = useState(null);
  const [, setIsFullScreenEnabled] = useState(screenfull.isFullscreen);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);

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
    return () =>
      screenfull.off("change", () => {
        setIsFullScreenEnabled(screenfull.isFullscreen);
      });
  }, []);

  const onChange = count => {
    setMaxTileCount(count);
  };

  const onNotificationChange = notification => {
    setSubscribedNotifications(notification);
  };
  const onViewModeChange = layout => {
    setuiViewMode(layout);
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
    layoutProps: {
      onViewModeChange,
      uiViewMode,
    },
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
        <ContextMenuItem
          icon={<ChangeTextIcon />}
          label="Change my name"
          key="change-name"
          onClick={() => setShowChangeNameModal(true)}
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
          icon={<RecordIcon />}
          label="Streaming/Recording"
          key="streaming-recording"
          onClick={() => {
            setShowRecordingAndRTMPModal(true);
          }}
        />
        {screenfull.isEnabled && (
          <ContextMenuItem
            icon={<FullScreenIcon />}
            label={`${screenfull.isFullscreen ? "Exit " : ""}Full Screen`}
            key="toggleFullScreen"
            onClick={() => {
              setFullScreenEnabled(!screenfull.isFullscreen);
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
      <RecordingAndRTMPModal
        showRecordingAndRTMPModal={showRecordingAndRTMPModal}
        setShowRecordingAndRTMPModal={setShowRecordingAndRTMPModal}
      />
      <ChangeName
        setShowChangeNameModal={setShowChangeNameModal}
        showChangeNameModal={showChangeNameModal}
      />
    </Fragment>
  );
};
