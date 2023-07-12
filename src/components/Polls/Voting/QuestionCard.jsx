// @ts-check
import React, { useCallback, useMemo, useState } from "react";
import {
  selectLocalPeerID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { ChevronLeftIcon, ChevronRightIcon } from "@100mslive/react-icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  styled,
  Text,
} from "@100mslive/react-ui";
import { compareArrays } from "../../../common/utils";
import { MultipleChoiceOptions } from "../common/MultipleChoiceOptions";
import { SingleChoiceOptions } from "../common/SingleChoiceOptions";
import { QUESTION_TYPE } from "../../../common/constants";

const TextArea = styled("textarea", {
  backgroundColor: "$surfaceLighter",
  border: "1px solid $borderLight",
  borderRadius: "$1",
  mb: "$md",
  color: "$textHighEmp",
  resize: "none",
  p: "$2",
  w: "100%",
});

export const QuestionCard = ({
  pollID,
  isQuiz,
  index,
  totalQuestions,
  totalResponses,
  type,
  text,
  options = [],
  answer,
  setCurrentIndex,
  skippable = false,
  responses = [],
  isTimed = false,
}) => {
  const actions = useHMSActions();
  const localPeerID = useHMSStore(selectLocalPeerID);
  const localPeerResponse = responses?.find(
    response => response.peer?.peerid === localPeerID
  );

  const isCorrectAnswer = useMemo(() => {
    if (type === QUESTION_TYPE.SINGLE_CHOICE) {
      return answer?.option === localPeerResponse?.option;
    } else if (type === QUESTION_TYPE.MULTIPLE_CHOICE) {
      return (
        answer?.options &&
        localPeerResponse?.options &&
        compareArrays(answer?.options, localPeerResponse?.options)
      );
    }
  }, [answer, localPeerResponse, type]);

  const prev = index !== 1;
  const next = index !== totalQuestions && (skippable || localPeerResponse);

  const moveNext = () => {
    setCurrentIndex(curr => Math.min(totalQuestions, curr + 1));
  };

  const movePrev = () => {
    setCurrentIndex(curr => Math.max(1, curr - 1));
  };

  const [textAnswer, setTextAnswer] = useState("");
  const [singleOptionAnswer, setSingleOptionAnswer] = useState();
  const [multipleOptionAnswer, setMultipleOptionAnswer] = useState(new Set());

  const stringAnswerExpected = [
    QUESTION_TYPE.LONG_ANSWER,
    QUESTION_TYPE.SHORT_ANSWER,
  ].includes(type);

  const handleVote = useCallback(async () => {
    await actions.interactivityCenter.addResponsesToPoll(pollID, [
      {
        questionIndex: index,
        text: textAnswer,
        option: singleOptionAnswer,
        options: Array.from(multipleOptionAnswer),
      },
    ]);
  }, [
    actions,
    index,
    pollID,
    textAnswer,
    singleOptionAnswer,
    multipleOptionAnswer,
  ]);

  const handleSkip = useCallback(async () => {
    await actions.interactivityCenter.addResponsesToPoll(pollID, [
      {
        questionIndex: index,
        skipped: true,
      },
    ]);
  }, [actions, index, pollID]);

  return (
    <Box
      css={{
        backgroundColor: "$surfaceLight",
        borderRadius: "$1",
        p: "$md",
        mt: "$md",
        border:
          isQuiz && localPeerResponse && !localPeerResponse.skipped
            ? `1px solid ${isCorrectAnswer ? "$success" : "$error"}`
            : "none",
      }}
    >
      <Flex align="center" justify="between">
        <Text
          variant="caption"
          css={{ color: "$textDisabled", fontWeight: "$semiBold" }}
        >
          QUESTION {index} OF {totalQuestions}: {type.toUpperCase()}
        </Text>

        {isTimed ? (
          <Flex align="center" css={{ gap: "$4" }}>
            <IconButton
              disabled={!prev}
              onClick={movePrev}
              css={
                prev
                  ? { color: "$textHighEmp", cursor: "pointer" }
                  : {
                      color: "$textDisabled",
                      cursor: "not-allowed",
                    }
              }
            >
              <ChevronLeftIcon height={16} width={16} />
            </IconButton>
            <IconButton
              disabled={!next}
              onClick={moveNext}
              css={
                next
                  ? { color: "$textHighEmp", cursor: "pointer" }
                  : {
                      color: "$textDisabled",
                      cursor: "not-allowed",
                    }
              }
            >
              <ChevronRightIcon height={16} width={16} />
            </IconButton>
          </Flex>
        ) : null}
      </Flex>

      <Box css={{ my: "$md" }}>
        <Text css={{ color: "$textHighEmp" }}>{text}</Text>
      </Box>

      {type === QUESTION_TYPE.SHORT_ANSWER ? (
        <Input
          disabled={!!localPeerResponse}
          placeholder="Enter your answer"
          onChange={e => setTextAnswer(e.target.value)}
          css={{
            w: "100%",
            backgroundColor: "$surfaceLighter",
            mb: "$md",
            border: "1px solid $borderDefault",
            cursor: localPeerResponse ? "not-allowed" : "text",
          }}
        />
      ) : null}

      {type === QUESTION_TYPE.LONG_ANSWER ? (
        <TextArea
          disabled={!!localPeerResponse}
          placeholder="Enter your answer"
          onChange={e => setTextAnswer(e.target.value)}
        />
      ) : null}

      {type === QUESTION_TYPE.SINGLE_CHOICE ? (
        <SingleChoiceOptions
          questionIndex={index}
          isQuiz={isQuiz}
          response={localPeerResponse}
          correctOptionIndex={answer?.option}
          options={options}
          setAnswer={setSingleOptionAnswer}
          totalResponses={totalResponses}
        />
      ) : null}

      {type === QUESTION_TYPE.MULTIPLE_CHOICE ? (
        <MultipleChoiceOptions
          questionIndex={index}
          isQuiz={isQuiz}
          response={localPeerResponse}
          correctOptionIndexes={answer?.options}
          options={options}
          selectedOptions={multipleOptionAnswer}
          setSelectedOptions={setMultipleOptionAnswer}
          totalResponses={totalResponses}
        />
      ) : null}

      <QuestionCardFooter
        skippable={skippable}
        skipQuestion={async () => {
          await handleSkip();
          moveNext();
        }}
        response={localPeerResponse}
        stringAnswerExpected={stringAnswerExpected}
        handleVote={handleVote}
      />
    </Box>
  );
};

const QuestionCardFooter = ({
  skippable,
  response,
  stringAnswerExpected,
  handleVote,
  skipQuestion,
}) => {
  return (
    <Flex align="center" justify="end" css={{ gap: "$4", w: "100%" }}>
      {skippable && !response ? (
        <Button
          variant="standard"
          onClick={skipQuestion}
          css={{ p: "$xs $10", fontWeight: "$semiBold" }}
        >
          Skip
        </Button>
      ) : null}

      {response ? (
        <Text css={{ fontWeight: "$semiBold", color: "$textMedEmp" }}>
          {response.skipped
            ? "Skipped"
            : stringAnswerExpected
            ? "Submitted"
            : "Voted"}
        </Text>
      ) : (
        <Button
          css={{ p: "$xs $10", fontWeight: "$semiBold" }}
          onClick={() => handleVote()}
        >
          {stringAnswerExpected ? "Submit" : "Vote"}
        </Button>
      )}
    </Flex>
  );
};
