import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@100mslive/react-icons";
import { Text, Flex, Dropdown, textEllipsis } from "@100mslive/react-ui";

const DialogDropdownTrigger = ({ title, css, open, icon }) => {
  return (
    <Dropdown.Trigger
      asChild
      data-testid={`${title}_selector`}
      css={{
        border: "1px solid $borderLight",
        bg: "$surfaceLight",
        r: "$1",
        p: "$6 $9",
        zIndex: 10,
        ...css,
      }}
    >
      <Flex
        css={{
          display: "flex",
          justifyContent: "space-between",
          color: "$textHighEmp",
          w: "100%",
        }}
      >
        {icon}
        <Text
          css={{
            color: "inherit",
            ...textEllipsis("90%"),
            flex: "1 1 0",
            mx: "$6",
          }}
        >
          {title}
        </Text>
        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Flex>
    </Dropdown.Trigger>
  );
};

export { DialogDropdownTrigger };
