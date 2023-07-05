// @ts-check
import React, { useCallback, useEffect, useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { ChevronLeftIcon, ChevronRightIcon } from "@100mslive/react-icons";
import {
  Box,
  Flex,
  IconButton,
  Input,
  styled,
  Text,
} from "@100mslive/react-ui";
import { QuestionCardFooter } from "./QuestionCardComponents/QuestionCardFooter";
import { MultipleChoiceOptions } from "./MultipleChoiceOptions";
import { SingleChoiceOptions } from "./SingleChoiceOptions";
import { QUESTION_TYPE } from "../../common/constants";

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
  index,
  totalQuestions,
  totalResponses,
  type,
  text,
  options = [],
  setCurrentIndex = () => {},
  skippable = false,
  isTimed = false,
}) => {
  const actions = useHMSActions();
  const [voted, setVoted] = useState(false);
  const prev = index !== 0;
  const next = index !== totalQuestions - 1 && (skippable || voted);
  const [textAnswer, setTextAnswer] = useState("");
  const [singleOptionAnswer, setSingleOptionAnswer] = useState();
  const [multipleOptionAnswer, setMultipleOptionAnswer] = useState(new Set());

  const stringAnswerExpected = [
    QUESTION_TYPE.LONG_ANSWER,
    QUESTION_TYPE.SHORT_ANSWER,
  ].includes(type);

  useEffect(() => setVoted(false), [index]);

  const handleVote = useCallback(async () => {
    await actions.interactivityCenter.addResponsesToPoll(pollID, [
      {
        questionIndex: index,
        text: textAnswer,
        option: singleOptionAnswer,
        options: Array.from(multipleOptionAnswer).sort(),
      },
    ]);
    setVoted(true);
  }, [
    actions,
    index,
    pollID,
    textAnswer,
    singleOptionAnswer,
    multipleOptionAnswer,
  ]);

  return (
    <Box
      css={{
        backgroundColor: "$surfaceLight",
        borderRadius: "$1",
        p: "$md",
        mt: "$md",
      }}
    >
      <Flex align="center" justify="between">
        <Text
          variant="caption"
          css={{ color: "$textDisabled", fontWeight: "$semiBold" }}
        >
          QUESTION {index + 1} OF {totalQuestions}: {type.toUpperCase()}
        </Text>

        {isTimed ? (
          <Flex align="center" css={{ gap: "$4" }}>
            <IconButton
              disabled={!prev}
              onClick={() => {
                setCurrentIndex(prev => Math.max(0, prev - 1));
                setVoted(false);
              }}
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
              onClick={() => {
                setCurrentIndex(prev => Math.min(totalQuestions, prev + 1));
                setVoted(false);
              }}
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
          disabled={voted}
          placeholder="Enter your answer"
          onChange={e => setTextAnswer(e.target.value)}
          css={{
            w: "100%",
            backgroundColor: "$surfaceLighter",
            mb: "$md",
            border: "1px solid $borderDefault",
            cursor: voted ? "not-allowed" : "text",
          }}
        />
      ) : null}

      {type === QUESTION_TYPE.LONG_ANSWER ? (
        <TextArea
          disabled={voted}
          placeholder="Enter your answer"
          onChange={e => setTextAnswer(e.target.value)}
        />
      ) : null}

      {type === QUESTION_TYPE.SINGLE_CHOICE ? (
        <SingleChoiceOptions
          voted={voted}
          options={options}
          setAnswer={setSingleOptionAnswer}
          totalResponses={totalResponses}
        />
      ) : null}

      {type === QUESTION_TYPE.MULTIPLE_CHOICE ? (
        <MultipleChoiceOptions
          voted={voted}
          options={options}
          selectedOptions={multipleOptionAnswer}
          setSelectedOptions={setMultipleOptionAnswer}
          totalResponses={totalResponses}
        />
      ) : null}

      <QuestionCardFooter
        skippable={skippable}
        voted={voted}
        stringAnswerExpected={stringAnswerExpected}
        handleVote={handleVote}
      />
    </Box>
  );
};
