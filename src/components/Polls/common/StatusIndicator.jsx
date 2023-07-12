// @ts-check
import React from "react";
import { Flex, Text } from "@100mslive/react-ui";

export const StatusIndicator = ({ isLive, shouldShowTimer }) => {
  return (
    <Flex align="center">
      <Flex
        css={{
          backgroundColor: isLive ? "$error" : "$secondaryDefault",
          p: "$2 $4",
          borderRadius: shouldShowTimer ? "$0 0 0 $0" : "$0",
        }}
      >
        <Text
          variant="caption"
          css={{
            fontWeight: "$semiBold",
            color: "$textHighEmp",
          }}
        >
          {isLive ? "LIVE" : "ENDED"}
        </Text>
      </Flex>

      {shouldShowTimer ? (
        <Flex
          css={{
            borderRadius: "0 $0 $0 0",
            p: "$2 $4",
            backgroundColor: "$backgroundDefault",
          }}
        >
          <Text
            variant="caption"
            css={{
              fontWeight: "$semiBold",
              color: "$textHighEmp",
            }}
          >
            0:32
          </Text>
        </Flex>
      ) : null}
    </Flex>
  );
};
