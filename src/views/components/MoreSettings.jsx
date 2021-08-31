import React, { useState, useContext, Fragment } from "react";
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
} from "@100mslive/hms-video-react";
import { AppContext } from "../../store/AppContext";
import { hmsToast } from "./notifications/hms-toast";

export const MoreSettings = () => {
  const { setMaxTileCount, maxTileCount } = useContext(AppContext);
  const roles = useHMSStore(selectAvailableRoleNames);
  const localPeer = useHMSStore(selectLocalPeer);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showParticipantsInView, setShowParticipantsInView] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const onChange = count => {
    setMaxTileCount(count);
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
                {roles.map(role => {
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
      <ParticipantsInView
        onTileCountChange={onChange}
        maxTileCount={maxTileCount}
        showModal={showParticipantsInView}
        onModalClose={() => setShowParticipantsInView(false)}
      />
    </Fragment>
  );
};
