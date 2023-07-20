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
            color: isCorrectAnswer ? "$success" : "$error",
            borderRadius: "$1",
            border: `1px solid ${isCorrectAnswer ? "$success" : "$error"}`,
          }}
        >
          {isCorrectAnswer ? "Correct" : "Incorrect"}
        </Text>
      )}
      <Text variant="sm" css={{ color: "$textMedEmp" }}>
        {voteCount}&nbsp;
        {voteCount === 1 ? "vote" : "votes"}
      </Text>
    </Flex>
  );
};
