import React from "react";
import { Box, Flex, Text } from "@100mslive/react-ui";

export const TextWithIcon = ({ Icon, children }) => (
  <Flex>
    <Box css={{ flexShrink: 0 }}>
      <Icon />
    </Box>
    <Text css={{ ml: "$4" }}>{children}</Text>
  </Flex>
);
