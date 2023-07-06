// @ts-check
import React from "react";
import {
  selectPeerNameByID,
  selectPollByID,
  useHMSStore,
} from "@100mslive/react-sdk";
import { CrossIcon } from "@100mslive/react-icons";
import { Box, Flex, Text } from "@100mslive/react-ui";
import { StandardView } from "./Views/StandardView";
import { TimedView } from "./Views/TimedView";
import { Container } from "../Streaming/Common";
import { StatusIndicator } from "./StatusIndicator";

export const Voting = ({ id, toggleVoting }) => {
  const poll = useHMSStore(selectPollByID(id));
  const pollCreatorName = useHMSStore(selectPeerNameByID(poll?.createdBy));

  if (!poll) {
    return null;
  }

  // Sets view - linear or vertical, toggles timer indicator
  const isTimed = (poll?.duration || 0) > 0;

  return (
    <Container rounded>
      <Box css={{ px: "$10" }}>
        <Flex
          align="center"
          css={{
            gap: "$6",
            py: "$10",
            w: "100%",
            color: "$textHighEmp",
            borderBottom: "1px solid $borderDefault",
          }}
        >
          <Text variant="h6">{poll?.type?.toUpperCase()}</Text>
          <StatusIndicator isTimed={isTimed} />
          <Box
            css={{
              marginLeft: "auto",
              cursor: "pointer",
              "&:hover": { opacity: "0.8" },
            }}
          >
            <CrossIcon onClick={toggleVoting} />
          </Box>
        </Flex>
      </Box>

      <Flex direction="column" css={{ p: "$8 $10" }}>
        <Text css={{ color: "$textMedEmp", fontWeight: "$semiBold" }}>
          {pollCreatorName || "Participant"} started a {poll.type}
        </Text>
        {isTimed ? <TimedView poll={poll} /> : <StandardView poll={poll} />}
      </Flex>
    </Container>
  );
};
