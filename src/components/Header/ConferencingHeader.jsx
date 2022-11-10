import React from "react";
import { Flex, VerticalDivider } from "@100mslive/react-ui";
import { Logo, SpeakerTag } from "./HeaderComponents";
import { ParticipantCount } from "./ParticipantList";
import { StreamActions } from "./StreamActions";

export const ConferencingHeader = ({ isPreview }) => {
  return (
    <Flex
      justify="between"
      align="center"
      css={{ position: "relative", height: "100%" }}
    >
      <Flex align="center" css={{ position: "absolute", left: "$10" }}>
        <Logo />
        <VerticalDivider css={{ ml: "$8" }} />
        {!isPreview ? <SpeakerTag /> : null}
      </Flex>

      <Flex
        align="center"
        css={{
          position: "absolute",
          right: "$10",
          gap: "$4",
        }}
      >
        <StreamActions />
        <ParticipantCount />
      </Flex>
    </Flex>
  );
};
