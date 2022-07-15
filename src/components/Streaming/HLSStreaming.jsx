import { Fragment, useCallback, useState } from "react";
import { EndStreamIcon, GoLiveIcon, InfoIcon } from "@100mslive/react-icons";
import {
  selectAppData,
  useHMSActions,
  useHMSStore,
  useRecordingStreaming,
} from "@100mslive/react-sdk";
import { Box, Button, Flex, Text } from "@100mslive/react-ui";
import { Container, ContentBody, ContentHeader, RecordStream } from "./Common";
import { useSidepaneToggle } from "../AppData/useSidepane";
import { getDefaultMeetingUrl } from "../../common/utils";
import { APP_DATA, SIDE_PANE_OPTIONS } from "../../common/constants";

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
  const recordingUrl = useHMSStore(selectAppData(APP_DATA.recordingUrl));
  const hmsActions = useHMSActions();
  const toggleStreaming = useSidepaneToggle(SIDE_PANE_OPTIONS.STREAMING);
  const startHLS = useCallback(async () => {
    await hmsActions.startHLSStreaming({
      variants: [{ meetingURL: recordingUrl || getDefaultMeetingUrl() }],
      recording: record
        ? { hlsVod: true, singleFilePerLayer: true }
        : undefined,
    });
    toggleStreaming();
  }, [recordingUrl, hmsActions, record, toggleStreaming]);

  return (
    <Fragment>
      <RecordStream record={record} setRecord={setRecord} />
      <Box css={{ p: "$4 $10" }}>
        <Button css={{ w: "100%", r: "$0" }} icon onClick={startHLS}>
          <GoLiveIcon />
          Go Live
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
  return (
    <Box css={{ p: "$4 $10" }}>
      <Button
        variant="danger"
        css={{ w: "100%", r: "$0", my: "$8" }}
        icon
        onClick={async () => {
          await hmsActions.stopHLSStreaming();
        }}
      >
        <EndStreamIcon />
        End Stream
      </Button>
    </Box>
  );
};
