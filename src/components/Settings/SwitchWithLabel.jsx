import React from "react";
import { Flex, Label, Switch } from "@100mslive/react-ui";

const SwitchWithLabel = ({ label, icon, id, onChange, checked }) => {
  return (
    <Flex
      align="center"
      css={{
        my: "$2",
        py: "$8",
        w: "100%",
        borderBottom: "1px solid $borderDefault",
      }}
    >
      <Label
        htmlFor={id}
        css={{
          fontSize: "$md",
          fontWeight: "$semiBold",
          color: checked ? "$textHighEmp" : "$textDisabled",
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
