import React from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { CrossIcon, ShareScreenIcon } from "@100mslive/react-icons";
import { Button, Flex, Text } from "@100mslive/react-ui";

export const ScreenshareDisplay = () => {
  const hmsActions = useHMSActions();

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      css={{
        position: "relative",
        overflow: "hidden",
        w: "37.5rem",
        maxWidth: "80%",
        h: "100%",
        r: "$3",
        m: "0 auto",
        color: "$textPrimary",
        bg: "$surfaceDefault",
        textAlign: "center",
      }}
    >
      <ShareScreenIcon width={48} height={48} />
      <Text variant="h5" css={{ m: "$8 0" }}>
        You are sharing your screen
      </Text>
      <Button
        variant="danger"
        onClick={async () => {
          await hmsActions.setScreenShareEnabled(false);
        }}
        data-testid="stop_screen_share_btn"
      >
        <CrossIcon width={18} height={18} />
        &nbsp; Stop screen share
      </Button>
    </Flex>
  );
};
