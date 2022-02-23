import React, { Fragment, useState } from "react";
import { Dropdown, IconButton, Text, Tooltip } from "@100mslive/react-ui";
import { HamburgerMenuIcon, TextboxIcon } from "@100mslive/react-icons";
import { ChangeName } from "../../components/ChangeName";
import { ChangeSelfRole } from "./ChangeSelfRole";

export const MoreSettings = () => {
  const [open, setOpen] = useState(false);
  const [showChangeNameModal, setShowChangeNameModal] = useState(false);

  return (
    <Fragment>
      <Dropdown.Root open={open} onOpenChange={setOpen}>
        <Tooltip title="More Settings">
          <Dropdown.Trigger asChild>
            <IconButton active={!open}>
              <HamburgerMenuIcon />
            </IconButton>
          </Dropdown.Trigger>
        </Tooltip>
        <Dropdown.Content sideOffset={5} align="center">
          <Dropdown.Item
            onClick={() => setShowChangeNameModal(value => !value)}
          >
            <TextboxIcon />
            <Text variant="sm" css={{ ml: "$4" }}>
              Change Name
            </Text>
          </Dropdown.Item>
          <ChangeSelfRole />
        </Dropdown.Content>
      </Dropdown.Root>
      <ChangeName
        show={showChangeNameModal}
        onToggle={value => setShowChangeNameModal(value)}
      />
    </Fragment>
  );
};
