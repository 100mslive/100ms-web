import { Dialog, Flex, HorizontalDivider, Text } from "@100mslive/react-ui";
import React from "react";
import { Box } from "@100mslive/react-ui";
import { CrossIcon } from "@100mslive/react-icons";

export const DialogContent = ({
  Icon,
  title,
  closeable = true,
  children,
  iconCSS,
  ...props
}) => {
  return (
    <>
      <Dialog.Overlay />
      <Dialog.Content {...props}>
        <Dialog.Title>
          <Flex justify="between">
            <Flex align="center" css={{ mb: "$1" }}>
              {Icon ? (
                <Box css={{ mr: "$2", ...iconCSS }}>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        Icon={CrossIcon}
        title={title}
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        onPointerDownOutside={e => e.preventDefault()}
        closeable={false}
        css={{ width: "min(600px, 100%)" }}
        iconCSS={{ color: "$error" }}
        {...props}
      >
        <Box css={{ mt: "$lg" }}>{children}</Box>
      </DialogContent>
    </Dialog>
  );
};
