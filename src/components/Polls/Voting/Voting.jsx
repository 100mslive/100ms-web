// @ts-check
import React from "react";
import {
  selectLocalPeerID,
  selectPeerNameByID,
  selectPollByID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { CrossIcon } from "@100mslive/react-icons";
import { Box, Button, Flex, Text } from "@100mslive/roomkit-react";
import { Container } from "../../Streaming/Common";
// import { PollResultSummary } from "./PollResultSummary";
import { StandardView } from "./StandardVoting";
import { TimedView } from "./TimedVoting";
import { StatusIndicator } from "../common/StatusIndicator";

export const Voting = ({ id, toggleVoting }) => {
  const actions = useHMSActions();
  const poll = useHMSStore(selectPollByID(id));
  const pollCreatorName = useHMSStore(selectPeerNameByID(poll?.createdBy));
  const isLocalPeerCreator = useHMSStore(selectLocalPeerID) === poll?.createdBy;

  if (!poll) {
    return null;
  }

  // Sets view - linear or vertical, toggles timer indicator
  const isTimed = (poll.duration || 0) > 0;
  const isLive = poll.state === "started";

  return (
    <Container rounded>
      <Box css={{ px: "$10" }}>
        <Flex
          align="center"
          css={{
            gap: "$6",
            py: "$10",
            w: "100%",
            color: "$on_surface_high",
            borderBottom: "1px solid $border_default",
          }}
        >
          <Text variant="h6">{poll.title}</Text>
          <StatusIndicator
            isLive={isLive}
            shouldShowTimer={isLive && isTimed}
          />
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
        <Flex align="center">
          <Box css={{ flex: "auto" }}>
            <Text
              css={{ color: "$on_surface_medium", fontWeight: "$semiBold" }}
            >
              {pollCreatorName || "Participant"} started a {poll.type}
            </Text>
          </Box>
          {poll.state === "started" && isLocalPeerCreator && (
            <Box css={{ flex: "initial" }}>
              <Button
                variant="danger"
                css={{ fontSize: "$sm", fontWeight: "$semiBold", p: "$3 $6" }}
                onClick={() => actions.interactivityCenter.stopPoll(id)}
              >
                End {poll.type}
              </Button>
            </Box>
          )}
        </Flex>
        {/* {poll.state === "stopped" && (
          <PollResultSummary
            pollResult={poll.result}
            questions={poll.questions}
            isQuiz={poll.type === "quiz"}
            isAdmin={isLocalPeerCreator}
          />
        )} */}
        {isTimed ? <TimedView poll={poll} /> : <StandardView poll={poll} />}
      </Flex>
    </Container>
  );
};
