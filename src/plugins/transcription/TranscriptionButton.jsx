import { useCallback, useEffect, useRef } from "react";
import {
  selectIsAllowedToPublish,
  selectSessionStore,
  useHMSActions,
  useHMSStore,
  useHMSVanillaStore,
} from "@100mslive/react-sdk";
import { ClosedCaptionIcon } from "@100mslive/react-icons";
import { Box, IconButton, Text, Tooltip } from "@100mslive/roomkit-react";
import { Transcriber } from "./Transcriber";
import { SESSION_STORE_KEY } from "../../common/constants";

export function TranscriptionButton() {
  const transcriptionState = useHMSStore(
    selectSessionStore(SESSION_STORE_KEY.TRANSCRIPTION_STATE)
  );
  const rawStore = useHMSVanillaStore();
  const isTranscriptionEnabled = !!transcriptionState?.enabled;
  let transcript = "",
    speakingPeer = "";
  if (isTranscriptionEnabled) {
    transcript = transcriptionState.transcript || "";
    speakingPeer = transcriptionState.speakingPeer || "";
  }

  const transcriber = useRef(null);
  const hmsActions = useHMSActions();
  const isAllowedToPublish = useHMSStore(selectIsAllowedToPublish);

  useEffect(() => {
    hmsActions.sessionStore.observe(SESSION_STORE_KEY.TRANSCRIPTION_STATE);
  }, [hmsActions]);

  useEffect(() => {
    if (!transcriber.current) {
      // create transcriber with the current room state for transcription
      transcriber.current = new Transcriber({
        hmsStore: rawStore,
        setTranscriptAndSpeakingPeer: async (transcript, peerName) => {
          const transcriptionCurrentEnabledState = !!rawStore.getState(
            selectSessionStore(SESSION_STORE_KEY.TRANSCRIPTION_STATE)
          )?.enabled;
          await hmsActions.sessionStore.set(
            SESSION_STORE_KEY.TRANSCRIPTION_STATE,
            {
              enabled: transcriptionCurrentEnabledState,
              transcript,
              speakingPeer: peerName,
            }
          );
        },
        setIsTranscriptionEnabled: async newEnabledState => {
          await hmsActions.sessionStore.set(
            SESSION_STORE_KEY.TRANSCRIPTION_STATE,
            {
              enabled: newEnabledState,
            }
          );
        },
      });
    }
    return () => {
      if (transcriber.current) {
        transcriber.current.cleanup();
      }
    };
  }, [hmsActions, rawStore]);

  useEffect(() => {
    // remote enabled transcript
    if (isTranscriptionEnabled) {
      transcriber.current.enableTranscription(true);
    }
  }, [isTranscriptionEnabled]);

  const toggleTranscriptionState = useCallback(() => {
    transcriber.current.toggleTranscriptionState();
  }, []);

  return (
    <>
      <Box
        css={{
          textAlign: "left",
          fontWeight: "$medium",
          bottom: "120px",
          position: "fixed",
          width: "100%",
          fontSize: "$20px",
          zIndex: "1000000",
          color: "white",
          textShadow: "0px 0px 6px #000",
          whiteSpace: "pre-line",
          paddingLeft: "40px",
        }}
      />
      <Box
        css={{
          textAlign: "center",
          fontWeight: "$medium",
          bottom: "90px",
          position: "fixed",
          width: "100%",
          fontSize: "$20px",
          zIndex: "1000000",
          color: "white",
          textShadow: "0px 0px 6px #000",
          whiteSpace: "pre-line",
        }}
      >
        <Text
          css={{
            color: "white",
            textShadow: "0px 0px 6px #000",
          }}
        >
          {transcript}
        </Text>
        <Text
          css={{
            color: "#c0bbbb",
            textShadow: "0px 0px 6px #000",
            textTransform: "capitalize",
          }}
        >
          {speakingPeer}
        </Text>
      </Box>
      {isAllowedToPublish.audio && (
        <Tooltip
          title={`Turn ${!isTranscriptionEnabled ? "on" : "off"} transcription`}
        >
          <IconButton
            active={!isTranscriptionEnabled}
            onClick={toggleTranscriptionState}
            data-testid="transcription_btn"
          >
            <ClosedCaptionIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
