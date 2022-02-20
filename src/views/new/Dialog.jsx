import {
  Dialog,
  Flex,
  HorizontalDivider,
  IconButton,
  Text,
} from "@100mslive/react-ui";
import React from "react";
import { Box } from "@100mslive/react-ui";

export const DialogContent = ({ Icon, title, children, ...props }) => {
  return (
    <>
      <Dialog.Overlay />
      <Dialog.Content {...props}>
        <Dialog.Title>
          <Flex justify="between">
            <Flex align="center" css={{ mb: "$1" }}>
              <IconButton noHover>
                <Icon />
              </IconButton>
              <Text variant="h6" inline>
                {title}
              </Text>
            </Flex>
            <Dialog.DefaultClose />
          </Flex>
        </Dialog.Title>
        <HorizontalDivider css={{ mt: "0.8rem" }} />
        <Box>{children}</Box>
      </Dialog.Content>
    </>
  );
};
