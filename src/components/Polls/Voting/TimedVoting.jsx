// @ts-check
import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";

/**
 *
 * @param {{poll: import("@100mslive/react-sdk").HMSPoll}} param0
 * @returns
 */
export const TimedView = ({ poll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeQuestion = poll.questions?.[currentIndex];
  if (!activeQuestion) {
    return null;
  }
  return (
    <QuestionCard
      pollID={poll.id}
      isQuiz={poll.type === "quiz"}
      index={activeQuestion.index}
      text={activeQuestion.text}
      type={activeQuestion.type}
      totalResponses={activeQuestion.totalResponses}
      totalQuestions={poll.questions?.length || 0}
      options={activeQuestion.options}
      skippable={activeQuestion.skippable || false}
      responses={activeQuestion.responses}
      answer={activeQuestion.answer}
      setCurrentIndex={setCurrentIndex}
      isTimed
    />
  );
};
