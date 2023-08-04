// @ts-check
import React from "react";
import { QuestionCard } from "./QuestionCard";

/**
 *
 * @param {{poll: import("@100mslive/react-sdk").HMSPoll}} param0
 * @returns
 */
export const StandardView = ({ poll }) => {
  if (!poll?.questions) {
    return null;
  }
  return (
    <>
      {poll.questions?.map((question, index) => (
        <QuestionCard
          pollID={poll.id}
          isQuiz={poll.type === "quiz"}
          startedBy={poll.startedBy}
          pollState={poll.state}
          key={`${question.text}-${index}`}
          index={question.index}
          text={question.text}
          type={question.type}
          result={question.result}
          totalQuestions={poll.questions?.length || 0}
          options={question.options}
          skippable={question.skippable}
          responses={question.responses}
          answer={question.answer}
          setCurrentIndex={() => {}}
          rolesThatCanViewResponses={poll.rolesThatCanViewResponses}
        />
      ))}
    </>
  );
};
