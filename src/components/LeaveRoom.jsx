import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import {
  selectIsConnectedToRoom,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { HangUpIcon, ExitIcon } from "@100mslive/react-icons";
import {
  Button,
  Popover,
  Dialog,
  Tooltip,
  Box,
  IconButton,
  styled,
  Text,
  Flex,
} from "@100mslive/react-ui";
import {
  DialogCheckbox,
  DialogContent,
  DialogRow,
} from "../primitives/DialogContent";
import { useNavigation } from "./hooks/useNavigation";
import { isStreamingKit } from "../common/utils";

export const LeaveRoom = () => {
  const navigate = useNavigation();
  const params = useParams();
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();

  const redirectToLeavePage = () => {
    if (params.role) {
      navigate("/leave/" + params.roomId + "/" + params.role);
    } else {
      navigate("/leave/" + params.roomId);
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

  if (!permissions || !isConnected) {
    return null;
  }

  return (
    <Fragment>
      {permissions.endRoom ? (
        <Popover.Root>
          <Popover.Trigger asChild>
            <LeaveIconButton
              variant="danger"
              key="LeaveRoom"
              data-testid="leave_room_btn"
            >
              <Tooltip title="Leave Room">
                {!isStreamingKit() ? (
                  <Box>
                    <HangUpIcon key="hangUp" />
                  </Box>
                ) : (
                  <Flex gap={2}>
                    <Box css={{ "@md": { transform: "rotate(180deg)" } }}>
                      <ExitIcon key="hangUp" />
                    </Box>
                    <Text
                      css={{ "@md": { display: "none" }, color: "inherit" }}
                      variant="button"
                    >
                      Leave Studio
                    </Text>
                  </Flex>
                )}
              </Tooltip>
            </LeaveIconButton>
          </Popover.Trigger>
          <Popover.Content sideOffset={10}>
            <Button
              variant="standard"
              css={{ w: "100%" }}
              onClick={() => {
                setShowEndRoomModal(true);
              }}
              data-testid="end_room_btn"
            >
              End Room
            </Button>
            <Button
              variant="danger"
              css={{ mt: "$4" }}
              onClick={leaveRoom}
              data-testid="just_leave_btn"
            >
              Just Leave
            </Button>
          </Popover.Content>
        </Popover.Root>
      ) : (
        <LeaveIconButton onClick={leaveRoom} variant="danger" key="LeaveRoom">
          <Tooltip title="Leave Room">
            <Box>
              {isStreamingKit() ? (
                <Box css={{ "@md": { transform: "rotate(180deg)" } }}>
                  <ExitIcon />
                </Box>
              ) : (
                <HangUpIcon key="hangUp" />
              )}
            </Box>
          </Tooltip>
        </LeaveIconButton>
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
        <DialogContent title="End Room" Icon={HangUpIcon}>
          <DialogCheckbox
            id="lockRoom"
            title="Disable future joins"
            value={lockRoom}
            onChange={setLockRoom}
          />
          <DialogRow justify="end">
            <Button
              variant="danger"
              onClick={endRoom}
              data-testid="lock_end_room"
            >
              End Room
            </Button>
          </DialogRow>
        </DialogContent>
      </Dialog.Root>
    </Fragment>
  );
};

const LeaveIconButton = styled(IconButton, {
  color: "$white",
  h: "$14",
  px: "$8",
  r: "$1",
  mx: "$4",
  bg: "$error",
  "&:not([disabled]):hover": {
    bg: "$errorTint",
  },
  "&:not([disabled]):active": {
    bg: "$errorTint",
  },
});
