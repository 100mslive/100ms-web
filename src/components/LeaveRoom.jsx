import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import {
  selectIsConnectedToRoom,
  selectPermissions,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  AlertTriangleIcon,
  ExitIcon,
  HangUpIcon,
  VerticalMenuIcon,
} from "@100mslive/react-icons";
import {
  Box,
  Button,
  Dialog,
  Dropdown,
  Flex,
  IconButton,
  styled,
  Text,
  Tooltip,
} from "@100mslive/roomkit-react";
import { ToastManager } from "./Toast/ToastManager";
import {
  DialogCheckbox,
  DialogContent,
  DialogRow,
} from "../primitives/DialogContent";
import { useDropdownList } from "./hooks/useDropdownList";
import { useNavigation } from "./hooks/useNavigation";
import { isStreamingKit } from "../common/utils";

export const LeaveRoom = () => {
  const navigate = useNavigation();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();
  useDropdownList({ open, name: "LeaveRoom" });

  const redirectToLeavePage = () => {
    if (params.role) {
      navigate("/leave/" + params.roomId + "/" + params.role);
    } else {
      navigate("/leave/" + params.roomId);
    }
    ToastManager.clearAllToast();
  };

  const leaveRoom = () => {
    hmsActions.leave();
    redirectToLeavePage();
  };

  const endRoom = () => {
    hmsActions.endRoom(lockRoom, "End Room");
    redirectToLeavePage();
  };

  const isStreamKit = isStreamingKit();
  if (!permissions || !isConnected) {
    return null;
  }

  return (
    <Fragment>
      {permissions.endRoom ? (
        <Flex>
          <LeaveIconButton
            variant="danger"
            key="LeaveRoom"
            data-testid="leave_room_btn"
            css={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            onClick={leaveRoom}
          >
            <Tooltip title="Leave Room">
              {!isStreamKit ? (
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
          <Dropdown.Root open={open} onOpenChange={setOpen} modal={false}>
            <Dropdown.Trigger
              asChild
              css={{
                '&[data-state="open"]': {
                  bg: "$alert_error_dim",
                },
              }}
            >
              <MenuTriggerButton
                variant="danger"
                data-testid="leave_end_dropdown_trigger"
              >
                <VerticalMenuIcon />
              </MenuTriggerButton>
            </Dropdown.Trigger>
            <Dropdown.Content css={{ p: 0 }} alignOffset={-50} sideOffset={10}>
              <Dropdown.Item
                css={{
                  w: "100%",
                  bg: "rgba(178, 71, 81, 0.1)",
                  "&:hover": { backgroundColor: "$surface_bright" },
                }}
                onClick={() => {
                  setShowEndRoomModal(true);
                }}
                data-testid="end_room_btn"
              >
                <Flex gap={4}>
                  <Box css={{ color: "$alert_error_default" }}>
                    <AlertTriangleIcon />
                  </Box>
                  <Flex direction="column" align="start">
                    <Text variant="lg" css={{ c: "$alert_error_default" }}>
                      End Room for All
                    </Text>
                    <Text
                      variant="sm"
                      css={{ c: "$on_surface_medium", mt: "$2" }}
                    >
                      Warning: You can’t undo this action
                    </Text>
                  </Flex>
                </Flex>
              </Dropdown.Item>
              <Dropdown.Item
                css={{
                  bg: "$surface_default",
                  "&:hover": { bg: "$surface_bright" },
                }}
                onClick={leaveRoom}
                data-testid="just_leave_btn"
              >
                <Flex gap={4}>
                  <Box>
                    <ExitIcon />
                  </Box>
                  <Flex direction="column" align="start">
                    <Text variant="lg">
                      Leave {isStreamKit ? "Studio" : "Room"}
                    </Text>
                    <Text
                      variant="sm"
                      css={{ c: "$on_surface_medium", mt: "$2" }}
                    >
                      You can always rejoin later
                    </Text>
                  </Flex>
                </Flex>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </Flex>
      ) : (
        <LeaveIconButton
          onClick={leaveRoom}
          variant="danger"
          key="LeaveRoom"
          data-testid="leave_room_btn"
        >
          <Tooltip title="Leave Room">
            <Box>
              {isStreamKit ? (
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
        modal={false}
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
  color: "$on_primary_high",
  h: "$14",
  px: "$8",
  r: "$1",
  bg: "$alert_error_default",
  "&:not([disabled]):hover": {
    bg: "$alert_error_bright",
  },
  "&:not([disabled]):active": {
    bg: "$alert_error_bright",
  },
  "@md": {
    px: "$4",
    mx: 0,
  },
});

const MenuTriggerButton = styled(LeaveIconButton, {
  borderLeft: "1px solid $alert_error_dim",
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  px: "$3",
  "@md": {
    px: "$2",
  },
});
