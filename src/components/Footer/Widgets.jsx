// @ts-check
import React from "react";
import {
  selectPermissions,
  selectPolls,
  useHMSStore,
} from "@100mslive/react-sdk";
import { QuizIcon } from "@100mslive/react-icons";
import { Flex, Text } from "@100mslive/react-ui";
import { PollsQuizMenu } from "../Polls/CreatePollQuiz/PollsQuizMenu";
import { CreateQuestions } from "../Polls/CreateQuestions/CreateQuestions";
import { Voting } from "../Polls/Voting/Voting";
import { Container, ContentHeader } from "../Streaming/Common";
import { ScreenshareAudio } from "./ScreenshareAudio";
import { ToggleWhiteboard } from "../../plugins/whiteboard/ToggleWhiteboard";
import { useWidgetToggle } from "../AppData/useSidepane";
import { useWidgetState } from "../AppData/useUISettings";
import { WIDGET_STATE, WIDGET_VIEWS } from "../../common/constants";

export const Widgets = () => {
  const toggleWidget = useWidgetToggle();
  const { pollInView: pollID, widgetView, setWidgetState } = useWidgetState();
  const permissions = useHMSStore(selectPermissions);
  const polls = useHMSStore(selectPolls)?.filter(
    poll => poll.state === "started" || poll.state === "stopped"
  );

  const showPolls =
    permissions?.pollWrite || (permissions?.pollRead && polls?.length > 0);

  return (
    <Container rounded>
      <ContentHeader content="Widgets" onClose={toggleWidget} />
      {widgetView === WIDGET_VIEWS.LANDING && (
        <Flex direction="column" css={{ p: "$10" }}>
          <Flex css={{ gap: "$10", mb: "$12" }}>
            <ScreenshareAudio />
            <ToggleWhiteboard />
          </Flex>

          {showPolls && (
            <Flex direction="column" css={{ py: "$12" }}>
              <WidgetOptions
                title="Poll/Quiz"
                Icon={<QuizIcon width={40} height={40} />}
                subtitle="Find out what others think"
                onClick={() =>
                  setWidgetState({
                    [WIDGET_STATE.view]: WIDGET_VIEWS.CREATE_POLL_QUIZ,
                  })
                }
              />
            </Flex>
          )}
        </Flex>
      )}
      {widgetView === WIDGET_VIEWS.CREATE_POLL_QUIZ && <PollsQuizMenu />}
      {widgetView === WIDGET_VIEWS.CREATE_QUESTIONS && <CreateQuestions />}
      {widgetView === WIDGET_VIEWS.VOTE && (
        <Voting toggleVoting={toggleWidget} id={pollID} />
      )}
    </Container>
  );
};

const WidgetOptions = ({ title, onClick, subtitle, Icon }) => {
  return (
    <Flex
      onClick={onClick}
      key={title}
      css={{ cursor: "pointer", "&:hover": { opacity: 0.7, r: "$0" } }}
      align="center"
    >
      <Flex
        css={{
          border: "$space$px solid $borderLight",
          r: "$1",
          p: "$4",
          c: "$textHighEmp",
        }}
      >
        {Icon}
      </Flex>
      <Flex direction="column" css={{ ml: "$md" }}>
        <Text
          variant="sub2"
          css={{ c: "$textHighEmp", fontWeight: "$semiBold", mb: "$4" }}
        >
          {title}
        </Text>
        <Text variant="caption">{subtitle}</Text>
      </Flex>
    </Flex>
  );
};
