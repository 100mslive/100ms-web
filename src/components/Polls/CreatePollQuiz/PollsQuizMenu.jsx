// @ts-check
import React, { useState } from "react";
import {
  selectPermissions,
  selectPolls,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { QuestionIcon, StatsIcon } from "@100mslive/react-icons";
import { Button, Flex, Input, Switch, Text } from "@100mslive/react-ui";
import { Container, ContentHeader, ErrorText } from "../../Streaming/Common";
import { useWidgetToggle } from "../../AppData/useSidepane";
import { useWidgetState } from "../../AppData/useUISettings";
import { isValidTextInput } from "../../../common/utils";
import { StatusIndicator } from "../common/StatusIndicator";
import {
  INTERACTION_TYPE,
  WIDGET_STATE,
  WIDGET_VIEWS,
} from "../../../common/constants";

export const PollsQuizMenu = () => {
  const toggleWidget = useWidgetToggle();
  const { setWidgetView } = useWidgetState();
  const permissions = useHMSStore(selectPermissions);

  return (
    <Container rounded>
      <ContentHeader
        content="Polls/Quiz"
        onBack={() => setWidgetView(WIDGET_VIEWS.LANDING)}
        onClose={toggleWidget}
      />
      <Flex
        direction="column"
        css={{ px: "$10", pb: "$10", overflowY: "auto" }}
      >
        {permissions?.pollWrite && <AddMenu />}
        <PrevMenu />
      </Flex>
    </Container>
  );
};

function InteractionSelectionCard({ title, icon, active, onClick }) {
  const activeBorderStyle = active
    ? "$space$px solid $borderAccent"
    : "$space$px solid $borderLight";
  return (
    <Flex
      onClick={onClick}
      css={{
        border: activeBorderStyle,
        p: "$4",
        r: "$2",
        w: "100%",
        cursor: "pointer",
      }}
      align="center"
    >
      <Flex
        css={{
          border: activeBorderStyle,
          p: "$4",
          bg: "$surfaceLight",
          c: "$textHighEmp",
          r: "$0",
        }}
      >
        {icon}
      </Flex>
      <Text variant="sub1" css={{ ml: "$md" }}>
        {title}
      </Text>
    </Flex>
  );
}

const AddMenu = () => {
  const actions = useHMSActions();
  const [title, setTitle] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState();
  const { setWidgetState } = useWidgetState();
  const [interactionType, setInteractionType] = useState(INTERACTION_TYPE.POLL);

  const handleCreate = id => {
    setWidgetState({
      [WIDGET_STATE.pollInView]: id,
      [WIDGET_STATE.view]: WIDGET_VIEWS.CREATE_QUESTIONS,
    });
  };
  // const [timer, setTimer] = useState(10);
  // const [showTimerDropDown, setShowTimerDropDown] = useState(false);

  return (
    <>
      <Text variant="caption" css={{ c: "$textMedEmp", mb: "$md" }}>
        Select the type you want to continue with
      </Text>
      <Flex css={{ w: "100%", gap: "$10", mb: "$md" }}>
        <InteractionSelectionCard
          title={INTERACTION_TYPE.POLL}
          icon={<StatsIcon width={32} height={32} />}
          onClick={() => setInteractionType(INTERACTION_TYPE.POLL)}
          active={interactionType === INTERACTION_TYPE.POLL}
        />
        <InteractionSelectionCard
          title={INTERACTION_TYPE.QUIZ}
          icon={<QuestionIcon width={32} height={32} />}
          onClick={() => setInteractionType(INTERACTION_TYPE.QUIZ)}
          active={interactionType === INTERACTION_TYPE.QUIZ}
        />
      </Flex>
      <Flex direction="column">
        <Text
          variant="body2"
          css={{ mb: "$4" }}
        >{`Name this ${interactionType.toLowerCase()}`}</Text>
        <Input
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <Flex align="center" css={{ mt: "$10" }}>
          <Switch css={{ mr: "$6" }} />
          <Text variant="body2" css={{ c: "$textMedEmp" }}>
            Hide Vote Count
          </Text>
        </Flex>
        <Flex align="center" css={{ mt: "$10" }}>
          <Switch
            onCheckedChange={value => setAnonymous(value)}
            css={{ mr: "$6" }}
          />
          <Text variant="body2" css={{ c: "$textMedEmp" }}>
            Make Results Anonymous
          </Text>
        </Flex>
        {/* <Timer
        timer={timer}
        setTimer={setTimer}
        showTimerDropDown={showTimerDropDown}
        setShowTimerDropDown={setShowTimerDropDown}
      /> */}

        <Button
          variant="primary"
          disabled={!isValidTextInput(title)}
          css={{ mt: "$10" }}
          onClick={async () => {
            const id = Date.now().toString();
            await actions.interactivityCenter
              .createPoll({
                id,
                title,
                anonymous,
                type: interactionType.toLowerCase(),
                // duration: showTimerDropDown ? timer : undefined,
              })
              .then(() => handleCreate(id))
              .catch(err => setError(err.message));
          }}
        >
          Create {interactionType}
        </Button>
        <ErrorText error={error} />
      </Flex>
    </>
  );
};

const PrevMenu = () => {
  const polls = useHMSStore(selectPolls)?.filter(
    poll => poll.state === "started" || poll.state === "stopped"
  );
  return polls?.length ? (
    <Flex
      css={{
        borderTop: "$space$px solid $borderLight",
        mt: "$10",
        pt: "$10",
      }}
    >
      <Flex direction="column" css={{ w: "100%" }}>
        <Text variant="h6" css={{ c: "$textHighEmp" }}>
          Previous Polls/Quiz
        </Text>
        <Flex direction="column" css={{ gap: "$10", mt: "$8" }}>
          {polls.map(poll => (
            <InteractionCard
              key={poll.id}
              id={poll.id}
              title={poll.title}
              isLive={poll.state === "started"}
              isTimed={(poll.duration || 0) > 0}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  ) : null;
};

const InteractionCard = ({ id, title, isLive, isTimed }) => {
  const { setWidgetState } = useWidgetState();

  const goToVote = id => {
    setWidgetState({
      [WIDGET_STATE.pollInView]: id,
      [WIDGET_STATE.view]: WIDGET_VIEWS.VOTE,
    });
  };

  return (
    <Flex
      direction="column"
      css={{ backgroundColor: "$surfaceLight", borderRadius: "$1", p: "$8" }}
    >
      <Flex css={{ w: "100%", justifyContent: "space-between", mb: "$sm" }}>
        <Text
          variant="sub1"
          css={{ c: "$textHighEmp", fontWeight: "$semiBold" }}
        >
          {title}
        </Text>
        <StatusIndicator isLive={isLive} shouldShowTimer={isLive && isTimed} />
      </Flex>
      <Flex css={{ w: "100%", gap: "$4" }} justify="end">
        <Button variant="primary" onClick={() => goToVote(id)}>
          View
        </Button>
      </Flex>
    </Flex>
  );
};
