// @ts-check
import React from "react";
import { Flex, Text } from "@100mslive/roomkit-react";

export const StatusIndicator = ({ isLive, shouldShowTimer }) => {
  return (
    <Flex align="center">
      <Flex
        css={{
          backgroundColor: isLive
            ? "$alert_error_default"
            : "$secondary_default",
          p: "$2 $4",
          borderRadius: shouldShowTimer ? "$0 0 0 $0" : "$0",
        }}
      >
        <Text
          variant="caption"
          css={{
            fontWeight: "$semiBold",
            color: "$on_surface_high",
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
            backgroundColor: "$background_default",
          }}
        >
          <Text
            variant="caption"
            css={{
              fontWeight: "$semiBold",
              color: "$on_surface_high",
            }}
          >
            0:32
          </Text>
        </Flex>
      ) : null}
    </Flex>
  );
};
