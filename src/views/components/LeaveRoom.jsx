import { Fragment, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { CheckIcon, HangUpIcon } from "@100mslive/react-icons";
import {
  Button,
  Popover,
  Dialog,
  Checkbox,
  Label,
  Flex,
  Tooltip,
  Box,
} from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../new/DialogContent";

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
            <Button
              variant="danger"
              key="LeaveRoom"
              css={{ p: "$2 $6", "@md": { p: "$2 $4" } }}
            >
              <Tooltip title="Leave Room">
                <Box>
                  <HangUpIcon key="hangUp" />
                </Box>
              </Tooltip>
            </Button>
          </Popover.Trigger>
          <Popover.Content sideOffset={10}>
            <Button
              variant="standard"
              onClick={() => {
                setShowEndRoomModal(true);
              }}
            >
              End Room
            </Button>
            <Button variant="danger" css={{ mt: "$4" }} onClick={leaveRoom}>
              Just Leave
            </Button>
          </Popover.Content>
        </Popover.Root>
      ) : (
        <Tooltip title="Leave Room">
          <Button
            variant="danger"
            onClick={leaveRoom}
            css={{ p: "$2 $6", "@md": { p: "$2 $4" } }}
          >
            <HangUpIcon />
          </Button>
        </Tooltip>
      )}

      <Dialog.Root
        open={showEndRoomModal}
        onOpenChange={value => {
          if (!value) {
            setLockRoom(false);
          }
          setShowEndRoomModal(value);
        }}
      >
        <DialogContent title="End Room">
          <DialogRow>Are you sure you want to end the room?</DialogRow>
          <DialogRow justify="end">
            <Flex>
              <Flex align="center" css={{ cursor: "pointer" }}>
                <Checkbox.Root
                  id="lockRoomCheckbox"
                  onCheckedChange={value => {
                    setLockRoom(value);
                  }}
                  checked={lockRoom}
                >
                  <Checkbox.Indicator>
                    <CheckIcon width={16} height={16} />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <Label htmlFor="lockRoomCheckbox" css={{ mx: "$4" }}>
                  Disable future joins
                </Label>
              </Flex>
              <Button
                variant="standard"
                css={{ bg: "$bgSecondary", mx: "$4" }}
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
            </Flex>
          </DialogRow>
        </DialogContent>
      </Dialog.Root>
    </Fragment>
  );
};
