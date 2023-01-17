import { Fragment, useCallback, useEffect, useState } from "react";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { EndStreamIcon, GoLiveIcon, LinkTwoIcon } from "@100mslive/react-icons";
import { Box, Button, Flex, Loading, Text } from "@100mslive/react-ui";
import { Container, ContentBody, ContentHeader, ErrorText } from "./Common";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { getDefaultMeetingUrl } from "../../common/utils";
import { APP_DATA } from "../../common/constants";

const cards = [
  {
    title: "Viewer",
    content:
      "Viewers can view the stream and send chat messages, but are unable to publish audio/video and participate with broadcasters. To enable participation, change their role from Viewer to Broadcaster.",
    img: "/viewer.svg",
    link: "/streaming/preview/ugs-wov-pnq",
    showAlways: false,
  },
  {
    title: "Broadcaster",
    content:
      "Broadcasters can publish audio/video and livestream their conversations via HLS. They can also change roles, manage stream appearance and control the room.",
    img: "/broadcaster.svg",
    link: "/streaming/preview/tey-xrq-rue",
    showAlways: true,
  },
];

const Card = ({ title, img, link, content, showAlways, isHLSRunning }) => {
  const [copied, setCopied] = useState(false);
  return isHLSRunning || showAlways ? (
    <Box
      key={title}
      css={{
        backgroundColor: "$surfaceLight",
        padding: "$8",
        borderRadius: "$1",
      }}
    >
      <Flex align="center" gap="2">
        <img alt={title} src={img} height="24px" width="24px" />
        <Text variant="lg" css={{ fontWeight: "$semiBold" }}>
          {title}
        </Text>
      </Flex>
      <Text variant="sm" css={{ color: "$textMedEmp", mt: "$4" }}>
        {content}
      </Text>
      <Button
        variant="standard"
        onClick={() => {
          navigator.clipboard.writeText(`${window.location.origin}${link}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        css={{ w: "100%", r: "$0", mt: "$8" }}
        icon
      >
        {copied ? (
          "Link copied!"
        ) : (
          <>
            <LinkTwoIcon /> Copy invite link
          </>
        )}
      </Button>
    </Box>
  ) : null;
};

export const HLSStreaming = ({ onBack }) => {
  const { isHLSRunning } = useRecordingStreaming();
  return (
    <Container rounded>
      <ContentHeader title="Start Streaming" content="HLS" onBack={onBack} />
      <ContentBody title="HLS Streaming" Icon={GoLiveIcon}>
        Stream directly from the browser using any device with multiple hosts
        and real-time messaging, all within this platform.
      </ContentBody>
      {isHLSRunning ? <EndHLS /> : <StartHLS />}
      <Flex direction="column" css={{ gap: "$sm", mt: "$6", p: "$0 $10" }}>
        {cards.map(card => (
          <Card key={card.title} {...card} isHLSRunning={isHLSRunning} />
        ))}
      </Flex>
    </Container>
  );
};

const StartHLS = () => {
  const [error, setError] = useState(false);
  const hmsActions = useHMSActions();
  const recordingUrl = useHMSStore(selectAppData(APP_DATA.recordingUrl));
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
          recording: undefined,
        });
      } catch (error) {
        if (error.message.includes("invalid input")) {
          await startHLS([
            { meetingURL: recordingUrl || getDefaultMeetingUrl() },
          ]);
          return;
        }
        setHLSStarted(false);
        setError(error.message);
      }
    },
    [hmsActions, isHLSStarted, setHLSStarted, recordingUrl]
  );

  return (
    <Fragment>
      <Box css={{ p: "$0 $10" }}>
        <ErrorText error={error} />
        <Button
          data-testid="start_hls"
          css={{ w: "100%", r: "$0" }}
          icon
          onClick={startHLS}
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
    </Fragment>
  );
};

const EndHLS = () => {
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
    <Box css={{ p: "$0 $10" }}>
      <ErrorText error={error} />
      <Button
        data-testid="stop_hls"
        variant="danger"
        css={{ w: "100%", r: "$0", my: "$2" }}
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
    </Box>
  );
};
