// @ts-check
import React, { useMemo, useState } from "react";
import {
  selectLocalPeerRoleName,
  selectPermissions,
  selectPolls,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import { QuestionIcon, StatsIcon } from "@100mslive/react-icons";
import { Button, Flex, Input, Switch, Text } from "@100mslive/roomkit-react";
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
    ? "$space$px solid $primary_default"
    : "$space$px solid $border_bright";
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
          bg: "$surface_bright",
          c: "$on_surface_high",
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
  const localPeerRoleName = useHMSStore(selectLocalPeerRoleName);
  const [anonymous, setAnonymous] = useState(false);
  const [hideVoteCount, setHideVoteCount] = useState(false);
  const [error, setError] = useState();
  const [titleError, setTitleError] = useState("");
  const { setWidgetState } = useWidgetState();
  const [interactionType, setInteractionType] = useState(INTERACTION_TYPE.POLL);

  const handleCreate = id => {
    setWidgetState({
      [WIDGET_STATE.pollInView]: id,
      [WIDGET_STATE.view]: WIDGET_VIEWS.CREATE_QUESTIONS,
    });
  };

  const validateTitle = useMemo(() => {
    if (!isValidTextInput(title)) {
      if (title) {
        setTitleError("Title of Poll/Quiz need to between 2-100 characters");
      }
      return true;
    } else {
      setTitleError("");
      return false;
    }
  }, [title]);
  // const [timer, setTimer] = useState(10);
  // const [showTimerDropDown, setShowTimerDropDown] = useState(false);

  return (
    <>
      <Text variant="caption" css={{ c: "$on_surface_medium", mb: "$md" }}>
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
          css={{
            backgroundColor: "$surface_bright",
            border: "1px solid $border_default",
          }}
        />
        <Flex align="center" css={{ mt: "$10" }}>
          <Switch
            onCheckedChange={value => setHideVoteCount(value)}
            css={{ mr: "$6" }}
          />
          <Text variant="body2" css={{ c: "$on_surface_medium" }}>
            Hide Vote Count
          </Text>
        </Flex>
        <Flex align="center" css={{ mt: "$10" }}>
          <Switch
            onCheckedChange={value => setAnonymous(value)}
            css={{ mr: "$6" }}
          />
          <Text variant="body2" css={{ c: "$on_surface_medium" }}>
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
          disabled={validateTitle}
          css={{ mt: "$10" }}
          onClick={async () => {
            const id = Date.now().toString();
            await actions.interactivityCenter
              .createPoll({
                id,
                title,
                anonymous,
                rolesThatCanViewResponses:
                  hideVoteCount && localPeerRoleName
                    ? [localPeerRoleName]
                    : undefined,
                type: interactionType.toLowerCase(),
                // duration: showTimerDropDown ? timer : undefined,
              })
              .then(() => handleCreate(id))
              .catch(err => setError(err.message));
          }}
        >
          Create {interactionType}
        </Button>
        <ErrorText error={error || titleError} />
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
        borderTop: "$space$px solid $border_bright",
        mt: "$10",
        pt: "$10",
      }}
    >
      <Flex direction="column" css={{ w: "100%" }}>
        <Text variant="h6" css={{ c: "$on_surface_high" }}>
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
      css={{ backgroundColor: "$surface_bright", borderRadius: "$1", p: "$8" }}
    >
      <Flex css={{ w: "100%", justifyContent: "space-between", mb: "$sm" }}>
        <Text
          variant="sub1"
          css={{ c: "$on_surface_high", fontWeight: "$semiBold" }}
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
