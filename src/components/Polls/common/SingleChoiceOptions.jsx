// @ts-check
import React, { useCallback } from "react";
import { Flex, Input, Label, RadioGroup, Text } from "@100mslive/react-ui";
import { VoteCount } from "./VoteCount";
import { VoteProgress } from "./VoteProgress";

export const SingleChoiceOptions = ({
  questionIndex,
  isQuiz,
  options,
  response,
  canRespond,
  correctOptionIndex,
  setAnswer,
  totalResponses,
}) => {
  return (
    <RadioGroup.Root
      value={response?.option}
      onValueChange={value => setAnswer(value)}
    >
      <Flex direction="column" css={{ gap: "$md", w: "100%", mb: "$md" }}>
        {options.map(option => {
          const isCorrectAnswer = isQuiz && option.index === correctOptionIndex;

          return (
            <Flex
              align="center"
              key={`${questionIndex}-${option.index}`}
              css={{ w: "100%", gap: "$5" }}
            >
              <RadioGroup.Item
                css={{
                  background: "none",
                  h: "$9",
                  w: "$9",
                  border: "2px solid",
                  borderColor: "$textHighEmp",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: canRespond ? "pointer" : "not-allowed",
                  '&[data-state="checked"]': {
                    borderColor: "$primaryLight",
                    borderWidth: "2px",
                  },
                }}
                disabled={!canRespond}
                value={option.index}
                id={`${questionIndex}-${option.index}`}
              >
                <RadioGroup.Indicator
                  css={{
                    h: "80%",
                    w: "80%",
                    background: "$primaryLight",
                    borderRadius: "$round",
                  }}
                />
              </RadioGroup.Item>

              <Flex direction="column" css={{ flexGrow: "1" }}>
                <Flex css={{ w: "100%", mb: canRespond ? "0" : "$4" }}>
                  <Text css={{ display: "flex", flexGrow: "1" }}>
                    <Label htmlFor={`${questionIndex}-${option.index}`}>
                      {option.text}
                    </Label>
                  </Text>
                  {response && (
                    <VoteCount
                      isQuiz={isQuiz}
                      isCorrectAnswer={isCorrectAnswer}
                      voteCount={option.voteCount}
                    />
                  )}
                </Flex>

                <VoteProgress
                  response={response}
                  option={option}
                  totalResponses={totalResponses}
                />
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </RadioGroup.Root>
  );
};

export const SingleChoiceOptionInputs = ({ isQuiz, options, setOptions }) => {
  const selectAnswer = useCallback(
    answerIndex => {
      if (!isQuiz) {
        return;
      }
      setOptions(options =>
        options.map((option, index) => ({
          ...option,
          isCorrectAnswer: index === answerIndex,
        }))
      );
    },
    [setOptions, isQuiz]
  );

  const correctOptionIndex = options.findIndex(
    option => option.isCorrectAnswer
  );

  return (
    <RadioGroup.Root value={correctOptionIndex} onValueChange={selectAnswer}>
      <Flex direction="column" css={{ gap: "$md", w: "100%", mb: "$md" }}>
        {options.map((option, index) => {
          return (
            <Flex
              align="center"
              key={`option-${index}`}
              css={{ w: "100%", gap: "$9" }}
            >
              {isQuiz && (
                <RadioGroup.Item
                  css={{
                    background: "none",
                    h: "$9",
                    w: "$9",
                    border: "2px solid",
                    borderColor: "$textHighEmp",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    '&[data-state="checked"]': {
                      borderColor: "$primaryLight",
                      borderWidth: "2px",
                    },
                  }}
                  value={index}
                >
                  <RadioGroup.Indicator
                    css={{
                      h: "80%",
                      w: "80%",
                      background: "$primaryLight",
                      borderRadius: "$round",
                    }}
                  />
                </RadioGroup.Item>
              )}

              <Input
                placeholder={`Option ${index + 1}`}
                css={{ w: "100%" }}
                value={option?.text || ""}
                key={index}
                onChange={event => {
                  setOptions(options => [
                    ...options.slice(0, index),
                    { ...options[index], text: event.target.value },
                    ...options.slice(index + 1),
                  ]);
                }}
              />
            </Flex>
          );
        })}
      </Flex>
    </RadioGroup.Root>
  );
};
