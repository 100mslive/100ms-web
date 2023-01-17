import { Fragment, useCallback, useEffect, useState } from "react";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { EndStreamIcon, GoLiveIcon } from "@100mslive/react-icons";
import { Box, Button, Flex, Loading, Text } from "@100mslive/react-ui";
import { Container, ContentBody, ContentHeader, ErrorText } from "./Common";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { getDefaultMeetingUrl } from "../../common/utils";
import { APP_DATA } from "../../common/constants";

const cards = [
  {
    title: "Broadcaster",
    content:
      "Broadcasters can publish audio/video and livestream their conversations via HLS. They can also change roles, manage stream appearance and control the room.",
    img: "",
    link: "broadcaster",
  },
  {
    title: "Viewer",
    content:
      "Viewers can view the stream and send chat messages, but are unable to publish audio/video and participate with broadcasters. To enable participation, change their role from Viewer to Broadcaster.",
    img: "",
    link: "viewer",
  },
];

export const HLSStreaming = ({ onBack }) => {
  const { isHLSRunning } = useRecordingStreaming();
  return (
    <Container>
      <ContentHeader title="" content="" onBack={onBack} />
      <ContentBody title="HLS Streaming" Icon={GoLiveIcon}>
        Stream directly from the browser using any device with multiple hosts
        and real-time messaging, all within this platform.
      </ContentBody>
      {isHLSRunning ? <EndHLS /> : <StartHLS />}
    </Container>
  );
};

const StartHLS = () => {
  const [record, setRecord] = useState(false);
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
          recording: record
            ? { hlsVod: true, singleFilePerLayer: true }
            : undefined,
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
    [hmsActions, record, isHLSStarted, setHLSStarted, recordingUrl]
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
        <Flex direction="column" css={{ gap: "$md" }}>
          <Text variant="lg" css={{ fontWeight: "$semiBold", mt: "$8" }}>
            Invite people
          </Text>
          {cards.map(card => (
            <Box
              key={card.title}
              css={{
                backgroundColor: "$surfaceLight",
                padding: "$10",
                borderRadius: "$3",
              }}
            >
              <Text variant="lg" css={{ fontWeight: "$semiBold", mb: "$4" }}>
                {card.title}
              </Text>
              <Text variant="sm" css={{ color: "$textMedEmp" }}>
                {card.content}
              </Text>
            </Box>
          ))}
        </Flex>
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
    <Box css={{ p: "$4 $10" }}>
      <ErrorText error={error} />
      <Button
        data-testid="stop_hls"
        variant="danger"
        css={{ w: "100%", r: "$0", my: "$8" }}
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
