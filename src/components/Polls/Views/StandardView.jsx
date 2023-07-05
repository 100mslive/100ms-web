// @ts-check
import React from "react";
import { QuestionCard } from "../QuestionCard";

/**
 *
 * @param {{poll: import("@100mslive/react-sdk").HMSPoll}} param0
 * @returns
 */
export const StandardView = ({ poll }) => {
  if (!poll?.questions) {
    return null;
  }
  return poll.questions?.map((question, index) => (
    <QuestionCard
      pollID={poll.id}
      key={`${question.text}-${index}`}
      index={question.index}
      text={question.text}
      type={question.type}
      totalResponses={question.totalResponses}
      totalQuestions={poll.questions.length}
      options={question.options}
      skippable={question?.skippable}
    />
  ));
};
