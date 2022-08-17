import React, { useState } from "react";
import {
  useHMSStore,
  selectPeerByID,
  useHMSActions,
  selectAvailableRoleNames,
} from "@100mslive/react-sdk";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@100mslive/react-icons";
import {
  Dialog,
  Button,
  Text,
  Label,
  Checkbox,
  Box,
  Flex,
  Dropdown,
} from "@100mslive/react-ui";
import { useDropdownSelection } from "./hooks/useDropdownSelection";

export const RoleChangeModal = ({ peerId, onOpenChange }) => {
  const peer = useHMSStore(selectPeerByID(peerId));
  const roles = useHMSStore(selectAvailableRoleNames);
  const [selectedRole, setRole] = useState(peer?.roleName);
  const [requestPermission, setRequestPermission] = useState(true);
  const hmsActions = useHMSActions();
  const [open, setOpen] = useState(false);
  const selectionBg = useDropdownSelection();
  if (!peer) {
    return null;
  }
  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content css={{ width: "min(400px,80%)", p: "$10" }}>
          <Dialog.Title css={{ p: 0 }}>
            <Text variant="h6">Change Role</Text>
            <Text
              variant="body2"
              css={{ fontWeight: 400, mt: "$4", mb: "$8", c: "$textMedEmp" }}
            >{`Change the role of "${peer.name}" to`}</Text>
          </Dialog.Title>
          <Flex
            align="center"
            css={{
              w: "100%",
              mb: "$10",
            }}
          >
            <Box
              css={{
                position: "relative",
                flex: "1 1 0",
                minWidth: 0,
                "[data-radix-popper-content-wrapper]": {
                  w: "100%",
                  minWidth: "0 !important",
                  transform: "translateY($space$17) !important",
                  zIndex: 11,
                },
              }}
            >
              <Dropdown.Root
                open={open}
                onOpenChange={setOpen}
                css={{ width: "100%" }}
              >
                <Dropdown.Trigger
                  asChild
                  css={{
                    border: "1px solid $borderLight",
                    bg: "$surfaceLight",
                    r: "$1",
                    p: "$6 $9",
                    zIndex: 10,
                  }}
                >
                  <Flex
                    align="center"
                    justify="between"
                    css={{ width: "100%" }}
                  >
                    <Text>{selectedRole}</Text>
                    {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </Flex>
                </Dropdown.Trigger>
                <Dropdown.Content
                  align="start"
                  sideOffset={8}
                  css={{ w: "100%" }}
                  portalled={false}
                >
                  {roles.map(role => {
                    return (
                      <Dropdown.Item
                        key={role}
                        onSelect={() => setRole(role)}
                        css={{
                          px: "$9",
                          bg: role === selectedRole ? selectionBg : undefined,
                        }}
                      >
                        {role}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Content>
              </Dropdown.Root>
            </Box>
          </Flex>
          {!peer.isLocal && (
            <Flex justify="between" css={{ w: "100%", mb: "$10" }}>
              <Label
                htmlFor="requestRoleChangePermission"
                css={{ cursor: "pointer" }}
              >
                Request Permission
              </Label>
              <Checkbox.Root
                checked={requestPermission}
                onCheckedChange={value => setRequestPermission(value)}
                id="requestRoleChangePermission"
              >
                <Checkbox.Indicator>
                  <CheckIcon width={16} height={16} />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </Flex>
          )}
          <Flex
            justify="center"
            align="center"
            css={{ width: "100%", gap: "$md" }}
          >
            <Box css={{ width: "50%" }}>
              <Dialog.Close css={{ width: "100%" }}>
                <Button variant="standard" outlined css={{ width: "100%" }}>
                  Cancel
                </Button>
              </Dialog.Close>
            </Box>
            <Box css={{ width: "50%" }}>
              <Button
                variant="primary"
                css={{ width: "100%" }}
                onClick={async () => {
                  await hmsActions.changeRole(
                    peerId,
                    selectedRole,
                    peer.isLocal ? true : !requestPermission
                  );
                  onOpenChange(false);
                }}
              >
                Change
              </Button>
            </Box>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
