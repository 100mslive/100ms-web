import React, { useCallback, useRef, useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import {
  AlertTriangleIcon,
  ChangeRoleIcon,
  CheckIcon,
} from "@100mslive/react-icons";
import {
  Button,
  Checkbox,
  Dialog,
  Dropdown,
  Flex,
  Loading,
  Text,
} from "@100mslive/react-ui";
import { DialogContent, DialogRow } from "../../primitives/DialogContent";
import { DialogDropdownTrigger } from "../../primitives/DropdownTrigger";
import { useFilteredRoles } from "../../common/hooks";

export const BulkRoleChangeModal = ({ onOpenChange }) => {
  const roles = useFilteredRoles();
  const hmsActions = useHMSActions();
  const ref = useRef(null);
  const roleRef = useRef(null);
  const [selectedBulkRole, setBulkRole] = useState([]);
  const [selectedRole, setRole] = useState("");
  const [bulkRoleDialog, setBulkRoleDialog] = useState(false);
  const [roleDialog, setRoleDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  const changeBulkRole = useCallback(async () => {
    if (selectedBulkRole.length > 0 && selectedRole) {
      try {
        setIsSubmiting(true);
        await hmsActions.changeRoleOfPeersWithRoles(
          selectedBulkRole,
          selectedRole
        );
        setIsSubmiting(false);
        setErrorMessage("");
        onOpenChange(false);
      } catch (err) {
        setErrorMessage(err?.message ? err?.message : "Unknown error");
        setIsSubmiting(false);
      }
    }
  }, [selectedBulkRole, selectedRole, hmsActions, onOpenChange]);

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogContent title="Bulk Role Change" Icon={ChangeRoleIcon}>
        <DialogRow>
          <Text>For Roles: </Text>
          <Dropdown.Root
            open={bulkRoleDialog}
            onOpenChange={value => {
              if (value) {
                setBulkRoleDialog(value);
              }
            }}
            modal={false}
          >
            <DialogDropdownTrigger
              ref={ref}
              title={
                selectedBulkRole.length === 0
                  ? "Select Multiple Roles"
                  : selectedBulkRole.toString()
              }
              css={{
                w: "70%",
                p: "$8",
              }}
              open={bulkRoleDialog}
            />
            <Dropdown.Content
              css={{ w: ref.current?.clientWidth, zIndex: 1000 }}
              onInteractOutside={() => {
                if (bulkRoleDialog) {
                  setBulkRoleDialog(false);
                }
              }}
            >
              {roles &&
                roles.map(role => {
                  return (
                    <Dropdown.CheckboxItem
                      key={role}
                      checked={selectedBulkRole.includes(role)}
                      onCheckedChange={value => {
                        setBulkRole(selection => {
                          return value
                            ? [...selection, role]
                            : selection.filter(
                                selectedRole => selectedRole !== role
                              );
                        });
                        setErrorMessage("");
                      }}
                    >
                      <Checkbox.Root
                        css={{ margin: "$2" }}
                        checked={selectedBulkRole.includes(role)}
                      >
                        <Checkbox.Indicator>
                          <CheckIcon width={16} height={16} />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      {role}
                    </Dropdown.CheckboxItem>
                  );
                })}
            </Dropdown.Content>
          </Dropdown.Root>
        </DialogRow>
        <DialogRow>
          <Text>To Role: </Text>
          <Dropdown.Root
            open={roleDialog}
            onOpenChange={value => setRoleDialog(value)}
          >
            <DialogDropdownTrigger
              ref={roleRef}
              title={selectedRole || "Select Role"}
              css={{
                w: "70%",
                p: "$8",
              }}
              open={roleDialog}
            />
            <Dropdown.Content
              css={{ w: roleRef.current?.clientWidth, zIndex: 1000 }}
            >
              {roles &&
                roles.map(role => {
                  return (
                    <Dropdown.Item
                      key={role}
                      onSelect={() => {
                        setRole(role);
                        setErrorMessage("");
                      }}
                    >
                      {role}
                    </Dropdown.Item>
                  );
                })}
            </Dropdown.Content>
          </Dropdown.Root>
        </DialogRow>
        <DialogRow>
          {errorMessage && (
            <Flex gap={2} css={{ c: "$error", w: "70%", ml: "auto" }}>
              <AlertTriangleIcon />
              <Text css={{ c: "inherit" }}>{errorMessage}</Text>
            </Flex>
          )}
        </DialogRow>
        <DialogRow justify="end">
          <Button
            variant="primary"
            onClick={changeBulkRole}
            disabled={!(selectedRole && selectedBulkRole.length > 0)}
          >
            {isSubmiting && <Loading css={{ color: "$textSecondary" }} />}
            Apply
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
