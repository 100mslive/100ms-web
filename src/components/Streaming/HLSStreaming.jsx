import { Fragment, useCallback, useEffect, useState } from "react";
import {
  selectRoomID,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import {
  EndStreamIcon,
  EyeOpenIcon,
  GoLiveIcon,
  InfoIcon,
  LinkIcon,
  PeopleIcon,
  SupportIcon,
  WrenchIcon,
} from "@100mslive/react-icons";
import { Box, Button, Flex, Loading, Text } from "@100mslive/roomkit-react";
import {
  Container,
  ContentBody,
  ContentHeader,
  ErrorText,
  RecordStream,
} from "./Common";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { useFilteredRoles } from "../../common/hooks";
import { APP_DATA } from "../../common/constants";

const getCardData = (roleName, roomId) => {
  let data = {};
  const formattedRoleName = roleName[0].toUpperCase() + roleName.slice(1);

  switch (roleName) {
    case "broadcaster": {
      data = {
        title: formattedRoleName,
        content:
          "Broadcasters can livestream audio or video, manage stream appearance and control the room via HLS.",
        icon: <SupportIcon />,
      };
      break;
    }
    case "hls-viewer": {
      data = {
        title: "HLS Viewer",
        content:
          "Viewers can view and send chat messages, but need to be made broadcasters to participate with audio or video.",
        icon: <EyeOpenIcon />,
      };
      break;
    }
    default:
      data = {
        title: formattedRoleName,
        content: `${formattedRoleName} is customised with specific permissions, which will determine how it interacts with this room.`,
        icon: <WrenchIcon />,
        order: 1,
      };
  }
  data["link"] = `/${roomId}/${roleName}`;
  return data;
};

const Card = ({ title, icon, link, content, isHLSRunning, order = 0 }) => {
  const [copied, setCopied] = useState(false);
  return isHLSRunning ? (
    <Box
      key={title}
      css={{
        backgroundColor: "$surface_bright",
        padding: "$10",
        order,
        borderRadius: "$2",
      }}
    >
      <Flex align="center" gap="2" css={{ color: "$primary_bright" }}>
        {icon}
        <Text variant="h6" css={{ fontWeight: "$semiBold" }}>
          {title}
        </Text>
      </Flex>
      <Text variant="sm" css={{ color: "$on_surface_medium", mt: "$6" }}>
        {content}
      </Text>
      <Button
        variant="standard"
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}${link}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        css={{ w: "100%", r: "$1", mt: "$10", fontWeight: "$semiBold" }}
        icon
      >
        {copied ? (
          <>Link copied!</>
        ) : (
          <>
            <LinkIcon style={{ color: "inherit" }} />
            Copy Invite Link
          </>
        )}
      </Button>
    </Box>
  ) : null;
};

export const HLSStreaming = ({ onBack }) => {
  const roleNames = useFilteredRoles();
  const roomId = useHMSStore(selectRoomID);
  const cards = roleNames.map(roleName => getCardData(roleName, roomId));

  const { isHLSRunning } = useRecordingStreaming();
  const [showLinks, setShowLinks] = useState(false);
  return !showLinks ? (
    <Container rounded>
      <ContentHeader title="Start Streaming" content="HLS" onBack={onBack} />
      <ContentBody
        title="HLS Streaming"
        Icon={GoLiveIcon}
        removeVerticalPadding
      >
        Stream directly from the browser using any device with multiple hosts
        and real-time messaging, all within this platform.
      </ContentBody>
      {isHLSRunning ? <EndHLS setShowLinks={setShowLinks} /> : <StartHLS />}
    </Container>
  ) : (
    <Container rounded>
      <ContentHeader
        title="Invite People"
        content="Start the conversation"
        onBack={() => setShowLinks(false)}
      />

      <Flex
        direction="column"
        css={{ gap: "$10", p: "$0 $10", overflowY: "auto", mb: "$10" }}
      >
        {cards.map(card => (
          <Card key={card.title} {...card} isHLSRunning={isHLSRunning} />
        ))}
      </Flex>
    </Container>
  );
};

const StartHLS = () => {
  const [record, setRecord] = useState(false);
  const [error, setError] = useState(false);
  const hmsActions = useHMSActions();
  const [isHLSStarted, setHLSStarted] = useSetAppDataByKey(APP_DATA.hlsStarted);
  const startHLS = useCallback(
    async variants => {
      try {
        if (isHLSStarted) {
          return;
        }
        setHLSStarted(true);
        setError("");
        await hmsActions.startHLSStreaming({
          variants,
          recording: { hlsVod: record, singleFilePerLayer: record },
        });
      } catch (error) {
        setHLSStarted(false);
        setError(error.message);
      }
    },
    [hmsActions, record, isHLSStarted, setHLSStarted]
  );

  return (
    <Fragment>
      <RecordStream
        record={record}
        setRecord={setRecord}
        testId="hls-recording"
      />
      <Box css={{ p: "$4 $10" }}>
        <ErrorText error={error} />
        <Button
          data-testid="start_hls"
          css={{ w: "100%", r: "$0" }}
          icon
          onClick={() => startHLS()}
          disabled={isHLSStarted}
        >
          {isHLSStarted ? (
            <Loading size={24} color="currentColor" />
          ) : (
            <GoLiveIcon />
          )}
          {isHLSStarted ? "Starting stream..." : "Go Live"}
        </Button>
      </Box>
      <Flex align="center" css={{ p: "$4 $10" }}>
        <Text>
          <InfoIcon width={16} height={16} />
        </Text>
        <Text variant="tiny" color="$on_surface_medium" css={{ mx: "$8" }}>
          You cannot start recording once the stream starts, you will have to
          stop the stream to enable recording.
        </Text>
      </Flex>
    </Fragment>
  );
};

const EndHLS = ({ setShowLinks }) => {
  const hmsActions = useHMSActions();

  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState("");
  const { isHLSRunning } = useRecordingStreaming();

  useEffect(() => {
    if (inProgress && !isHLSRunning) {
      setInProgress(false);
    }
  }, [inProgress, isHLSRunning]);

  return (
    <Box css={{ p: "$4 $10" }}>
      <ErrorText error={error} />
      <Button
        data-testid="stop_hls"
        variant="danger"
        css={{ w: "100%", r: "$0", mt: "$8" }}
        icon
        loading={inProgress}
        disabled={inProgress}
        onClick={async () => {
          try {
            setInProgress(true);
            await hmsActions.stopHLSStreaming();
          } catch (error) {
            setError(error.message);
            setInProgress(false);
          }
        }}
      >
        <EndStreamIcon />
        End Stream
      </Button>
      <Button
        icon
        css={{ w: "100%", r: "$0", mt: "$8" }}
        onClick={() => setShowLinks(true)}
      >
        <PeopleIcon /> Invite People
      </Button>
    </Box>
  );
};
