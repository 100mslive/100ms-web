// @ts-check
import React, { useMemo } from "react";
import { selectLocalPeerID, useHMSStore } from "@100mslive/react-sdk";
import { Box, Text } from "@100mslive/roomkit-react";
import { checkCorrectAnswer } from "../../../common/utils";

/**
 * @param {{ isQuiz: boolean;
 * isAdmin: boolean;
 * pollResult: import("@100mslive/react-sdk").HMSPoll['result'];
 *  questions: import("@100mslive/react-sdk").HMSPoll['questions'] }} param0
 */
export const PollResultSummary = ({
  isQuiz,
  isAdmin,
  pollResult,
  questions,
}) => {
  const localPeerID = useHMSStore(selectLocalPeerID);
  const noAnswers = pollResult?.maxUsers || 0 - (pollResult?.totalUsers || 0);
  const participationPercentage =
    pollResult?.maxUsers && pollResult?.maxUsers > 0
      ? ((pollResult?.totalUsers || 0) * 100) / pollResult.maxUsers
      : 0;

  const totalCorrectAnswers = useMemo(() => {
    let correctAnswers = 0;
    questions?.forEach(question => {
      correctAnswers += question.result?.correctResponses || 0;
    });
    return correctAnswers;
  }, [questions]);

  const totalIncorrectAnswers = useMemo(() => {
    let incorrectAnswers = 0;
    questions?.forEach(question => {
      incorrectAnswers +=
        (question.result?.totalResponses || 0) -
        (question.result?.correctResponses || 0) -
        (question.result?.skippedCount || 0);
    });
    return incorrectAnswers;
  }, [questions]);

  const localCorrectAnswers = useMemo(() => {
    let correctAnswers = 0;
    questions?.forEach(question => {
      const localResponse = question.responses?.find(
        response => response.peer?.peerid === localPeerID
      );
      if (checkCorrectAnswer(question.answer, localResponse, question.type)) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  }, [localPeerID, questions]);

  const localIncorrectAnswers = useMemo(() => {
    let incorrectAnswers = 0;
    questions?.forEach(question => {
      const localResponse = question.responses?.find(
        response => response.peer?.peerid === localPeerID
      );
      if (
        !checkCorrectAnswer(question.answer, localResponse, question.type) &&
        localResponse
      ) {
        incorrectAnswers++;
      }
    });
    return incorrectAnswers;
  }, [localPeerID, questions]);

  if (!pollResult) {
    return null;
  }

  let StatsComponents;

  if (isQuiz && isAdmin) {
    StatsComponents = (
      <>
        <PollStat label="No. of correct answers" value={totalCorrectAnswers} />
        <PollStat label="No. of wrong answerss" value={totalIncorrectAnswers} />
        <PollStat label="Peers who didn't answer" value={noAnswers} />
        <PollStat
          label="Participation Percentage"
          value={participationPercentage.toFixed(2) + "%"}
        />
      </>
    );
  } else if (isQuiz && !isAdmin) {
    StatsComponents = (
      <>
        <PollStat label="No. of correct answers" value={localCorrectAnswers} />
        <PollStat label="No. of wrong answers" value={localIncorrectAnswers} />
      </>
    );
  } else if (!isQuiz && isAdmin) {
    StatsComponents = (
      <>
        <PollStat label="Peers who didn't answer" value={noAnswers} />
        <PollStat
          label="Participation Percentage"
          value={participationPercentage.toFixed(2) + "%"}
        />
      </>
    );
  } else {
    return null;
  }

  return (
    <Box
      css={{
        display: "grid",
        "grid-template-columns": "repeat(2, 2fr)",
        gap: "$4",
        mt: "$3",
      }}
    >
      {StatsComponents}
    </Box>
  );
};

const PollStat = ({ label, value }) => {
  return (
    <Box css={{ bg: "$surface_bright", p: "$8", r: "$1" }}>
      <Text
        variant="overline"
        css={{
          fontWeight: "$semiBold",
          color: "$on_surface_medium",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <Text
        variant="sub1"
        css={{ fontWeight: "$semiBold", color: "$on_surface_medium" }}
      >
        {value}
      </Text>
    </Box>
  );
};
