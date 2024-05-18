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
import { p2p_abortedEvent } from "../helpers/amplitudeHelper";

export const LeaveRoom = () => {
  const navigate = useNavigation();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [showEndRoomModal, setShowEndRoomModal] = useState(false);
  const [lockRoom, setLockRoom] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const permissions = useHMSStore(selectPermissions);
  const hmsActions = useHMSActions();
  useDropdownList({ open, name: "LeaveRoom" });

  const isPeerLearner = localStorage.getItem("isPeerLearner");
  const startTime = JSON.parse(localStorage.getItem("startTime"));
  const leaveUrl = localStorage.getItem("leaveUrl");
  const learner = localStorage.getItem("learner");
  const coLearner = localStorage.getItem("coLearner");
  const coLearnerName = localStorage.getItem("coLearnerName");
  const coLearnerGender = localStorage.getItem("coLearnerGender");
  const redirectToLeavePage = async () => {
    try {
      // amplitude event
      let currentTime = new Date();
  
      // Extracting date components in UTC
      let year = currentTime.getUTCFullYear();
      let month = (currentTime.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      let date = currentTime.getUTCDate().toString().padStart(2, '0');
  
      // Extracting time components in UTC
      let hours = currentTime.getUTCHours().toString().padStart(2, '0');
      let minutes = currentTime.getUTCMinutes().toString().padStart(2, '0');
      let seconds = currentTime.getUTCSeconds().toString().padStart(2, '0');
      let formattedTime = `${hours}:${minutes}:${seconds}`;
  
      // Combining date and time
      let timeStamp = `${year}-${month}-${date} ${formattedTime}`;
      const amplitudeEventProperties = {
        colearner_name: coLearnerName,
        colearner_id: coLearner,
        time_stamp: timeStamp,
        colearner_gender: coLearnerGender
      };
      const amplitudeUserProperties = {
        user_id: learner
      };
  
      // Await the asynchronous event before continuing
      await new Promise((resolve, reject) => {
        p2p_abortedEvent(amplitudeUserProperties, amplitudeEventProperties, () => {
          console.log("Promise resolved");
          resolve();
        });
      });
  // Adding a delay to ensure the event is sent before redirecting
  setTimeout(() => {
    hmsActions.leave();
    ToastManager.clearAllToast();
    if (leaveUrl !== "null") {
      window.location.replace(leaveUrl);
    } else {
      window.location.replace("https://clapingo.com/learner");
    }
  }, 1000); // Adjust the delay as necessary
    } catch (error) {
      console.error("Error in redirectToLeavePage:", error);
    }
  };
  

  const leaveRoom = () => {
    if (isPeerLearner === "true" && startTime) {
      let currentTime = new Date();
      let timeDifference = Math.abs(currentTime - new Date(startTime));
      let differenceInMinutes = Math.floor(timeDifference / 1000 / 60);

      if (differenceInMinutes >= 7) {
        redirectToLeavePage();
      } else {
        setShowWarningModal(true);
      }
    } else {
      redirectToLeavePage();
    }
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
      <Dialog.Root
        open={showWarningModal}
        onOpenChange={setShowWarningModal}
        modal={true}
      >
        <DialogContent
          title="Warning"
          Icon={AlertTriangleIcon}
          iconCSS={{ color: "red" }}
        >
          <Text css={{ c: "$on_surface_medium", mt: "$10" }}>
            You must not leave in the middle of conversation.
          </Text>
          <Text css={{ c: "$on_surface_medium", mt: "$6" }}>
            Leaving will cost you some specific privileges in future.
          </Text>
          <DialogRow justify="end" css={{ gap: 10 }}>
            <Button onClick={redirectToLeavePage} variant="danger">
              <Text variant="sm">Leave</Text>
            </Button>
            <Button onClick={() => setShowWarningModal(false)}>Stay</Button>
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
