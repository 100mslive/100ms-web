import { Fragment, useCallback, useEffect, useState } from "react";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { EndStreamIcon, GoLiveIcon, InfoIcon } from "@100mslive/react-icons";
import { Box, Button, Flex, Loading, Text } from "@100mslive/react-ui";
import {
  Container,
  ContentBody,
  ContentHeader,
  ErrorText,
  RecordStream,
} from "./Common";
import { useSetAppDataByKey } from "../AppData/useUISettings";
import { getDefaultMeetingUrl } from "../../common/utils";
import { APP_DATA } from "../../common/constants";

export const HLSStreaming = ({ onBack }) => {
  const { isHLSRunning } = useRecordingStreaming();
  return (
    <Container>
      <ContentHeader title="Start Streaming" content="HLS" onBack={onBack} />
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
      <Flex align="center" css={{ p: "$4 $10" }}>
        <Text>
          <InfoIcon width={16} height={16} />
        </Text>
        <Text variant="tiny" color="$textMedEmp" css={{ mx: "$8" }}>
          You cannot start recording once the stream starts, you will have to
          stop the stream to enable recording.
        </Text>
      </Flex>
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
