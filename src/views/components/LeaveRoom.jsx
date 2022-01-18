import { Fragment, useState } from "react";
import {
  ContextMenu,
  ContextMenuItem,
  MessageModal,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { HangUpIcon } from "@100mslive/react-icons";
import { Button, Text } from "@100mslive/react-ui";

export const LeaveRoom = () => {
  const history = useHistory();
  const params = useParams();
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();

  const leaveRoom = () => {
    hmsActions.leave();
    if (params.role) {
      history.push("/leave/" + params.roomId + "/" + params.role);
    } else {
      history.push("/leave/" + params.roomId);
    }
  };

  return (
    <Fragment>
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
        key="LeaveAction"
        trigger={
          <Button variant="danger" key="LeaveRoom">
            <HangUpIcon key="hangUp" />
            <Text variant="body" css={{ ml: "$2", "@md": { display: "none" } }}>
              Leave Room
            </Text>
          </Button>
        }
        menuProps={{
          anchorOrigin: {
            vertical: "top",
            horizontal: "center",
          },
          transformOrigin: {
            vertical: 128,
            horizontal: "center",
          },
        }}
      >
        {permissions?.endRoom && (
          <ContextMenuItem
            label="End Room"
            key="endRoom"
            classes={{
              menuTitleContainer: "hidden",
              menuItemChildren: "my-1 w-full",
            }}
          >
            <Button
              variant="standard"
              className="w-full"
              onClick={() => {
                setShowEndRoomModal(true);
              }}
            >
              End Room for all
            </Button>
          </ContextMenuItem>
        )}
        <ContextMenuItem
          label="Leave Room"
          key="leaveRoom"
          classes={{
            menuTitleContainer: "hidden",
            menuItemChildren: "my-1 w-full overflow-hidden",
          }}
        >
          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              leaveRoom();
            }}
          >
            Just Leave
          </Button>
        </ContextMenuItem>
      </ContextMenu>
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
              variant="standard"
              className="mr-3 ml-3"
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
    </Fragment>
  );
};
