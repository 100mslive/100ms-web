// @ts-check
import React, { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  selectPollByID,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { AddCircleIcon } from "@100mslive/react-icons";
import { Button, Flex, Text } from "@100mslive/roomkit-react";
import { Container, ContentHeader } from "../../Streaming/Common";
import { isValidQuestion, QuestionForm } from "./QuestionForm";
import { SavedQuestion } from "./SavedQuestion";
import { useWidgetToggle } from "../../AppData/useSidepane";
import { useWidgetState } from "../../AppData/useUISettings";
import { WIDGET_VIEWS } from "../../../common/constants";

export function CreateQuestions() {
  const [questions, setQuestions] = useState([{ draftID: uuid() }]);
  const actions = useHMSActions();
  const toggleWidget = useWidgetToggle();
  const { pollInView: id, setWidgetView } = useWidgetState();
  const interaction = useHMSStore(selectPollByID(id));

  const isValidPoll = useMemo(
    () =>
      questions.length > 0 &&
      questions.every(question => isValidQuestion(question)),
    [questions]
  );

  const launchPoll = async () => {
    const validQuestions = questions
      .filter(question => isValidQuestion(question))
      .map(question => ({
        text: question.text,
        type: question.type,
        options: question.options,
        skippable: question.skippable,
      }));
    await actions.interactivityCenter.addQuestionsToPoll(id, validQuestions);
    await actions.interactivityCenter.startPoll(id);
    setWidgetView(WIDGET_VIEWS.VOTE);
  };
  const headingTitle = interaction?.type
    ? interaction?.type?.[0]?.toUpperCase() + interaction?.type?.slice(1)
    : "Polls and Quizzes";
  const isQuiz = interaction?.type === "quiz";
  return (
    <Container rounded>
      <ContentHeader
        content={headingTitle}
        onClose={toggleWidget}
        onBack={() => setWidgetView(WIDGET_VIEWS.CREATE_POLL_QUIZ)}
      />
      <Flex direction="column" css={{ p: "$10" }}>
        <Flex direction="column">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.draftID}
              question={question}
              index={index}
              length={questions.length}
              onSave={questionParams => {
                setQuestions(questions => [
                  ...questions.slice(0, index),
                  questionParams,
                  ...questions.slice(index + 1),
                ]);
              }}
              isQuiz={isQuiz}
              removeQuestion={questionID =>
                setQuestions(prev => {
                  return prev.filter(
                    questionFromSet => questionID !== questionFromSet.draftID
                  );
                })
              }
              convertToDraft={questionID =>
                setQuestions(prev => {
                  const copyOfQuestions = [...prev];
                  copyOfQuestions.forEach(question => {
                    if (questionID && question.draftID === questionID) {
                      question.saved = false;
                    }
                  });
                  return copyOfQuestions;
                })
              }
            />
          ))}
        </Flex>
        <Flex
          css={{
            c: "$on_surface_low",
            my: "$sm",
            cursor: "pointer",
            "&:hover": { c: "$on_surface_medium" },
          }}
          onClick={() => setQuestions([...questions, { draftID: uuid() }])}
        >
          <AddCircleIcon />
          <Text variant="body1" css={{ ml: "$md", c: "$inherit" }}>
            Add another question
          </Text>
        </Flex>
        <Flex css={{ w: "100%" }} justify="end">
          <Button disabled={!isValidPoll} onClick={launchPoll}>
            Launch {interaction.type}
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}

const QuestionCard = ({
  question,
  onSave,
  index,
  length,
  removeQuestion,
  isQuiz,
  convertToDraft,
}) => {
  return (
    <Flex
      direction="column"
      css={{ p: "$md", bg: "$surface_default", r: "$1", mb: "$sm" }}
    >
      {question.saved ? (
        <SavedQuestion
          question={question}
          index={index}
          length={length}
          convertToDraft={convertToDraft}
        />
      ) : (
        <QuestionForm
          question={question}
          removeQuestion={() => removeQuestion(question.draftID)}
          onSave={params => onSave(params)}
          index={index}
          length={length}
          isQuiz={isQuiz}
        />
      )}
    </Flex>
  );
};
