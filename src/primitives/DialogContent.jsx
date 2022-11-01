import React from "react";
import { CheckIcon, CrossIcon } from "@100mslive/react-icons";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Flex,
  HorizontalDivider,
  Input,
  Label,
  Select,
  Switch,
  Text,
} from "@100mslive/react-ui";

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
    <Dialog.Portal>
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
            {closeable && (
              <Dialog.DefaultClose data-testid="dialoge_cross_icon" />
            )}
          </Flex>
        </Dialog.Title>
        <HorizontalDivider css={{ mt: "0.8rem" }} />
        <Box>{children}</Box>
      </Dialog.Content>
    </Dialog.Portal>
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

export const RequestDialog = ({
  open = true,
  onOpenChange,
  title,
  body,
  actionText = "Accept",
  onAction,
  Icon,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content css={{ width: "min(400px,80%)", p: "$10" }}>
        <Dialog.Title
          css={{ p: 0, display: "flex", flexDirection: "row", gap: "$md" }}
        >
          {Icon ? Icon : null}
          <Text variant="h6">{title}</Text>
        </Dialog.Title>
        <Text
          variant="md"
          css={{
            fontWeight: 400,
            mt: "$4",
            mb: "$10",
            c: "$textMedEmp",
          }}
        >
          {body}
        </Text>
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
              onClick={onAction}
            >
              {actionText}
            </Button>
          </Box>
        </Flex>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

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
    margin: "$10 0",
    w: "100%",
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
  ...props
}) => {
  return (
    <DialogRow breakSm>
      <Label>{title}</Label>
      <Select.Root
        data-testid={`dialog_select_${title}`}
        css={{ width: "70%", "@sm": { width: "100%" } }}
        {...props}
      >
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

export const DialogInput = ({
  title,
  value,
  onChange,
  placeholder,
  disabled,
  type,
  ...props
}) => {
  return (
    <DialogRow breakSm>
      <Label>{title}</Label>
      <Input
        css={{ width: "70%", "@sm": { width: "100%" } }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        type={type}
        {...props}
      />
    </DialogRow>
  );
};

export const DialogSwitch = ({ title, value, onChange, disabled }) => {
  return (
    <DialogRow>
      <Text>{title}</Text>
      <Flex justify="end" css={{ width: "70%" }}>
        <Switch
          checked={value}
          disabled={disabled}
          onCheckedChange={onChange}
        />
      </Flex>
    </DialogRow>
  );
};

export const DialogCheckbox = ({
  title,
  value,
  onChange,
  disabled,
  css,
  id,
}) => {
  return (
    <DialogRow css={css}>
      <Label htmlFor={id} css={{ cursor: "pointer" }}>
        {title}
      </Label>
      <Checkbox.Root
        checked={value}
        onCheckedChange={value => onChange(value)}
        disabled={disabled}
        id={id}
      >
        <Checkbox.Indicator>
          <CheckIcon width={16} height={16} />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </DialogRow>
  );
};
