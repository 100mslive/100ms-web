import { Fragment, useState } from "react";
import {
  MessageModal,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/hms-video-react";
import { useHistory, useParams } from "react-router-dom";
import { HangUpIcon } from "@100mslive/react-icons";
import { Button, Text, Popover } from "@100mslive/react-ui";

export const LeaveRoom = () => {
  const history = useHistory();
  const params = useParams();
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();

  const redirectToLeavePage = () => {
    if (params.role) {
      history.push("/leave/" + params.roomId + "/" + params.role);
    } else {
      history.push("/leave/" + params.roomId);
    }
  };

  const leaveRoom = () => {
    hmsActions.leave();
    redirectToLeavePage();
  };

  const endRoom = () => {
    hmsActions.endRoom(lockRoom, "End Room");
    redirectToLeavePage();
  };
  return (
    <Fragment>
      {permissions.endRoom ? (
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="danger" key="LeaveRoom">
              <HangUpIcon key="hangUp" />
              <Text
                css={{ ml: "$4", "@md": { display: "none" }, color: "$white" }}
              >
                Leave Room
              </Text>
            </Button>
          </Popover.Trigger>
          <Popover.Content sideOffset={10}>
            <Button
              variant="standard"
              className="w-full"
              onClick={() => {
                setShowEndRoomModal(true);
              }}
            >
              End Room for all
            </Button>
            <Button
              variant="danger"
              className="w-full mt-2"
              onClick={leaveRoom}
            >
              Just Leave
            </Button>
          </Popover.Content>
        </Popover.Root>
      ) : (
        <Button variant="danger" className="w-full" onClick={leaveRoom}>
          <HangUpIcon />
          <Text css={{ ml: "$4", "@md": { display: "none" } }}>Leave Room</Text>
        </Button>
      )}

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
            <Button variant="danger" onClick={endRoom}>
              End Room
            </Button>
          </div>
        }
      />
    </Fragment>
  );
};
