// @ts-check
import React from "react";
import { Flex, Text } from "@100mslive/roomkit-react";

export const VoteCount = ({ isQuiz, voteCount, isCorrectAnswer }) => {
  return (
    <Flex css={{ alignItems: "center" }}>
      {isQuiz && (
        <Text
          variant="xs"
          css={{
            p: "$2",
            mr: "$2",
            color: isCorrectAnswer ? "$alert_success" : "$alert_error_default",
            borderRadius: "$1",
            border: `1px solid ${
              isCorrectAnswer ? "$alert_success" : "$alert_error_default"
            }`,
          }}
        >
          {isCorrectAnswer ? "Correct" : "Incorrect"}
        </Text>
      )}
      <Text variant="sm" css={{ color: "$on_surface_medium" }}>
        {voteCount}&nbsp;
        {voteCount === 1 ? "vote" : "votes"}
      </Text>
    </Flex>
  );
};
