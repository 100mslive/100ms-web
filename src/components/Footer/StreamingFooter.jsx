import React from "react";
import { Box, Flex, Footer as AppFooter } from "@100mslive/react-ui";
import { AudioVideoToggle } from "../AudioVideoToggle";
import { StreamActions } from "../Header/StreamActions";
import { LeaveRoom } from "../LeaveRoom";
import MetaActions from "../MetaActions";
import { MoreSettings } from "../MoreSettings/MoreSettings";
import { PIP } from "../PIP";
import { ScreenshareToggle } from "../ScreenShare";
import { ChatToggle } from "./ChatToggle";

export const StreamingFooter = () => {
  return (
    <AppFooter.Root
      css={{
        flexWrap: "nowrap",
        "@md": {
          justifyContent: "center",
        },
      }}
    >
      <AppFooter.Left
        css={{
          "@md": {
            w: "unset",
            p: "0",
          },
        }}
      >
        <AudioVideoToggle />
      </AppFooter.Left>
      <AppFooter.Center
        css={{
          "@md": {
            w: "unset",
          },
        }}
      >
        <ScreenshareToggle css={{ "@sm": { display: "none" } }} />
        <Box css={{ "@md": { display: "none" } }}>
          <PIP />
        </Box>
        <Box
          css={{
            display: "none",
            "@md": {
              display: "flex",
              alignItems: "center",
              mx: "$4",
            },
          }}
        >
          <StreamActions />
        </Box>
        <MoreSettings />
        <Box css={{ "@md": { display: "none" } }}>
          <LeaveRoom />
        </Box>
        <Flex
          align="center"
          css={{ display: "none", "@md": { display: "flex" } }}
        >
          <ChatToggle />
        </Flex>
      </AppFooter.Center>
      <AppFooter.Right>
        <MetaActions />
        <ChatToggle />
      </AppFooter.Right>
    </AppFooter.Root>
  );
};
