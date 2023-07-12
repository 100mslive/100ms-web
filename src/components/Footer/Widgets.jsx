// @ts-check
import React from "react";
import { QuizIcon } from "@100mslive/react-icons";
import { Flex, Text } from "@100mslive/react-ui";
import { PollsQuizMenu } from "../Polls/CreatePollQuiz/PollsQuizMenu";
import { CreateQuestions } from "../Polls/CreateQuestions/CreateQuestions";
import { Voting } from "../Polls/Voting/Voting";
import { Container, ContentHeader } from "../Streaming/Common";
import { useWidgetToggle } from "../AppData/useSidepane";
import { useWidgetState } from "../AppData/useUISettings";
import { WIDGET_STATE, WIDGET_VIEWS } from "../../common/constants";

export const Widgets = () => {
  const toggleWidget = useWidgetToggle();
  const { pollInView: pollID, widgetView, setWidgetState } = useWidgetState();

  return (
    <Container rounded>
      <ContentHeader content="Widgets" onClose={toggleWidget} />
      {widgetView === WIDGET_VIEWS.LANDING && (
        <Flex direction="column" css={{ p: "$10" }}>
          <Flex css={{ gap: "$10", mb: "$12" }}>
            {cardData.map(card => {
              return <WidgetCard {...card} />;
            })}
          </Flex>

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

const cardData = [
  {
    title: "Share Music",
    subtitle: "Play music from Spotify or any other tab",
    imageSrc: require("../../images/audio.png"),
    onClick: () => {},
  },
  {
    title: "Whiteboard",
    subtitle: "Collaboratively sketch ideas",
    imageSrc: require("../../images/whiteboard.png"),
    onClick: () => {},
  },
];

const WidgetCard = ({ title, subtitle, imageSrc, onClick, css = {} }) => {
  return (
    <Flex
      direction="column"
      css={{
        cursor: "pointer",
        w: "100%",
        "&:hover": { opacity: 0.7, r: "$0" },
        ...css,
      }}
      onClick={onClick}
      key={title}
    >
      <Flex css={{ border: "$space$px solid $borderLight", r: "$0" }}>
        <img
          src={imageSrc}
          alt={`${imageSrc}-polls`}
          style={{ borderRadius: "4px" }}
        />
      </Flex>
      <Text variant="sub2" css={{ mt: "$md", c: "$textHighEmp" }}>
        {title}
      </Text>
      <Text variant="caption" css={{ c: "$textMedEmp", mt: "$2" }}>
        {subtitle}
      </Text>
    </Flex>
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
