import React, { useCallback, useRef, useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { ChangeRoleIcon, CheckIcon } from "@100mslive/react-icons";
import { Button, Dialog, Dropdown, Text } from "@100mslive/react-ui";
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

  const changeBulkRole = useCallback(async () => {
    if (selectedBulkRole.length > 0 && selectedRole) {
      await hmsActions.changeRoleOfPeersWithRoles(
        selectedBulkRole,
        selectedRole
      );
    }
    onOpenChange(false);
  }, [selectedBulkRole, selectedRole, onOpenChange, hmsActions]);

  return (
    <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
      <DialogContent title="Bulk Role Change" Icon={ChangeRoleIcon}>
        <DialogRow>
          <Text>For Roles: </Text>
          <Dropdown.Root
            open={bulkRoleDialog}
            onOpenChange={value => setBulkRoleDialog(value)}
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
            >
              {roles &&
                roles.map(role => {
                  return (
                    <Dropdown.CheckboxItem
                      key={role}
                      checked={selectedBulkRole.includes(role)}
                      onCheckedChange={value =>
                        setBulkRole(selection => {
                          return value
                            ? [...selection, role]
                            : selection.filter(
                                selectedRole => selectedRole !== role
                              );
                        })
                      }
                    >
                      {role}
                      <Dropdown.ItemIndicator>
                        <CheckIcon />
                      </Dropdown.ItemIndicator>
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
                    <Dropdown.Item key={role} onSelect={() => setRole(role)}>
                      {role}
                    </Dropdown.Item>
                  );
                })}
            </Dropdown.Content>
          </Dropdown.Root>
        </DialogRow>
        <DialogRow justify="end">
          <Button variant="primary" onClick={changeBulkRole}>
            Apply
          </Button>
        </DialogRow>
      </DialogContent>
    </Dialog.Root>
  );
};
