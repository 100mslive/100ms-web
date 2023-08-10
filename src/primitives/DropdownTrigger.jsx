import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@100mslive/react-icons";
import { Dropdown, Flex, Text, textEllipsis } from "@100mslive/roomkit-react";

const DialogDropdownTrigger = React.forwardRef(
  ({ title, css, open, icon, titleCSS = {} }, ref) => {
    return (
      <Dropdown.Trigger
        asChild
        data-testid={`${title}_selector`}
        css={{
          border: "1px solid $border_bright",
          bg: "$surface_bright",
          r: "$1",
          p: "$6 $9",
          zIndex: 10,
          ...css,
        }}
        ref={ref}
      >
        <Flex
          css={{
            display: "flex",
            justifyContent: "space-between",
            color: "$on_surface_high",
            w: "100%",
          }}
        >
          {icon}
          <Text
            css={{
              color: "inherit",
              ...textEllipsis("90%"),
              flex: "1 1 0",
              mx: icon ? "$6" : "0",
              ...titleCSS,
            }}
          >
            {title}
          </Text>
          {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Flex>
      </Dropdown.Trigger>
    );
  }
);

export { DialogDropdownTrigger };
