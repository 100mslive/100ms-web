import React from "react";
import { Flex, Footer as AppFooter, Box } from "@100mslive/react-ui";
import { AudioVideoToggle } from "../AudioVideoToggle";
import { MoreSettings } from "../MoreSettings/MoreSettings";
import { ScreenshareToggle } from "../ScreenShare";
import PIPComponent from "../PIP/PIPComponent";
import { LeaveRoom } from "../LeaveRoom";
import MetaActions from "../MetaActions";
import { ChatToggle } from "./ChatToggle";
import { StreamActions } from "../Header/StreamActions";

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
          <PIPComponent />
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
