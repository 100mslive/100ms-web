import React from "react";
import { Flex, Label, Switch } from "@100mslive/roomkit-react";

const SwitchWithLabel = ({
  label,
  icon,
  id,
  onChange,
  checked,
  hide = false,
}) => {
  return (
    <Flex
      align="center"
      css={{
        my: "$2",
        py: "$8",
        w: "100%",
        borderBottom: "1px solid $border_default",
        display: hide ? "none" : "flex",
      }}
    >
      <Label
        htmlFor={id}
        css={{
          fontSize: "$md",
          fontWeight: "$semiBold",
          color: checked ? "$on_surface_high" : "$on_surface_low",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "$8",
          flex: "1 1 0",
        }}
      >
        {icon}
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </Flex>
  );
};

export default SwitchWithLabel;
