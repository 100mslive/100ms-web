import React from "react";
import { Flex, Box, VerticalDivider } from "@100mslive/react-ui";
import { ParticipantCount } from "./ParticipantList";
import { Logo, SpeakerTag } from "./HeaderComponents";
import { AdditionalRoomState } from "./AdditionalRoomState";
import { RecordingStreaming } from "./RecordingAndRTMPModal";

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

      <Flex align="center" css={{ position: "absolute", right: "$10" }}>
        <RecordingStreaming />
        <AdditionalRoomState />
        <Box css={{ mx: "$2" }}>
          <ParticipantCount />
        </Box>
      </Flex>
    </Flex>
  );
};
