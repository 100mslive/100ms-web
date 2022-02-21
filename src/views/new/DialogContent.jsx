import {
  Dialog,
  Select,
  Flex,
  HorizontalDivider,
  Text,
} from "@100mslive/react-ui";
import React from "react";
import { Box } from "@100mslive/react-ui";
import { CrossIcon } from "@100mslive/react-icons";

export const DialogContent = ({
  Icon,
  title,
  closeable = true,
  children,
  css,
  iconCSS = {},
  ...props
}) => {
  return (
    <>
      <Dialog.Overlay />
      <Dialog.Content css={{ width: "min(600px, 100%)", ...css }} {...props}>
        <Dialog.Title>
          <Flex justify="between">
            <Flex align="center" css={{ mb: "$1" }}>
              {Icon ? (
                <Box css={{ mr: "$2", color: "$textPrimary", ...iconCSS }}>
                  <Icon />
                </Box>
              ) : null}
              <Text variant="h6" inline>
                {title}
              </Text>
            </Flex>
            {closeable && <Dialog.DefaultClose />}
          </Flex>
        </Dialog.Title>
        <HorizontalDivider css={{ mt: "0.8rem" }} />
        <Box>{children}</Box>
      </Dialog.Content>
    </>
  );
};

export const ErrorDialog = ({
  open = true,
  onOpenChange,
  title,
  children,
  ...props
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <DialogContent
        Icon={CrossIcon}
        title={title}
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        onPointerDownOutside={e => e.preventDefault()}
        closeable={false}
        iconCSS={{ color: "$error" }}
        {...props}
      >
        <Box css={{ mt: "$lg" }}>{children}</Box>
      </DialogContent>
    </Dialog.Root>
  );
};

/**
 * a row of items which breaks into column on small screen. For e.g. title on left and options to select
 * from on right for select component.
 */
export const DialogRow = ({
  children,
  breakSm = false,
  css,
  justify = "between",
}) => {
  let finalCSS = {
    margin: "1.5rem 0",
  };
  if (breakSm) {
    finalCSS["@sm"] = {
      flexDirection: "column",
      alignItems: "flex-start",
    };
  }
  if (css) {
    finalCSS = Object.assign(finalCSS, css);
  }
  return (
    <Flex align="center" justify={justify} css={finalCSS}>
      {children}
    </Flex>
  );
};

/**
 * key field and label field are optional, option is directly used if not passed
 */
export const DialogSelect = ({
  title,
  options,
  keyField,
  labelField,
  selected,
  onChange,
}) => {
  return (
    <DialogRow breakSm>
      <Text>{title}:</Text>
      <Select.Root css={{ width: "70%", "@sm": { width: "100%" } }}>
        <Select.DefaultDownIcon />
        <Select.Select
          onChange={e => onChange(e.target.value)}
          value={selected}
          css={{ width: "100%" }}
        >
          {options.map(option => {
            const id = keyField ? option[keyField] : option;
            const label = labelField ? option[labelField] : option;
            return (
              <option value={id} key={id}>
                {label}
              </option>
            );
          })}
        </Select.Select>
      </Select.Root>
    </DialogRow>
  );
};
