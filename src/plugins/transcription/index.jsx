import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import { useHMSStore, selectRoom } from "@100mslive/react-sdk";
import { Box, Tooltip, IconButton } from "@100mslive/react-ui";
import { FeatureFlags } from "../../services/FeatureFlags";

const pusher =
  FeatureFlags.enableTranscription &&
  new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
    cluster: "ap2",
    authEndpoint: process.env.REACT_APP_PUSHER_AUTHENDPOINT,
  });
let channel = null;

export function TranscriptionButton() {
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const [transcript, setTranscript] = useState("");
  const transcriber = useRef(null);
  const roomId = useHMSStore(selectRoom)?.id;
  useEffect(() => {
    channel = pusher.subscribe(`private-${roomId}`);
    channel.bind(`client-transcription`, ({ text }) => {
      setTranscript(text);
      setTimeout(() => {
        setTranscript("");
      }, 5000);
    });
  }, [roomId]);

  const enableTranscription = () => {
    if (!transcriber.current) {
      transcriber.current = new Transcriber(setTranscript);
      transcriber.current.enabled = false;
    }
    transcriber.current.enableTranscription(!isTranscriptionEnabled);
    setIsTranscriptionEnabled(!isTranscriptionEnabled);
  };

  return (
    <>
      <Box
        css={{
          textAlign: "center",
          fontWeight: "$medium",
          bottom: "120px",
          position: "fixed",
          width: "100%",
          fontSize: "$20px",
          zIndex: "1000000",
          color: "white",
          textShadow: "0px 0px 6px #000",
          whiteSpace: "pre-line",
        }}
      >
        {transcript}
      </Box>
      <IconButton
        active={!isTranscriptionEnabled}
        onClick={enableTranscription}
        key="transcribe"
      >
        <Tooltip
          title={`Turn ${!isTranscriptionEnabled ? "on" : "off"} transcription`}
        >
          <span>
            <b>T</b>
          </span>
        </Tooltip>
      </IconButton>
    </>
  );
}
class Transcriber {
  constructor(setTranscript) {
    this.enabled = false;
    this.socket = null;
    this.totalTimeDiff = 0;
    this.totalCount = 0;
    this.streams = {};
    this.setTranscript = setTranscript;
    this.initialized = false;
    this.lastMessage = {};
    this.localPeerId = null;
    this.sttTuningConfig = {
      timeSlice: 250,
      desiredSampRate: 8000,
      numberOfAudioChannels: 1,
      bufferSize: 256,
    };
  }

  broadcast = (text, eventName = "transcription") => {
    channel.trigger(`client-${eventName}`, { text, eventName });
  };

  async listen() {
    try {
      const localPeer = window.__hms.sdk.getLocalPeer();
      this.localPeerId = localPeer.peerId;
      this.streams[localPeer.peerId] = {
        stream: new MediaStream([localPeer.audioTrack.nativeTrack]),
        name: localPeer.name,
      };

      let url = process.env.REACT_APP_DYNAMIC_STT_TOKEN_GENERATION_ENDPOINT;
      let res = await fetch(url);
      let body = await res.json();
      if (body && body.token) {
        const token = body.token;
        this.socket = await new WebSocket(
          `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=${this.sttTuningConfig.desiredSampRate}&token=${token}`
        );
        this.setTranscript("");
        this.socket.onmessage = message => {
          const res = JSON.parse(message.data);
          if (res.text && this.enabled) {
            let peername = this.streams[this.localPeerId]["name"];
            peername = peername
              .toLowerCase()
              .replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
            let messageText =
              res.text.length >= 80
                ? res.text
                    .split(" ")
                    .slice(Math.max(res.text.split(" ").length - 10, 1))
                    .join(" ")
                : res.text;
            this.broadcast(messageText + "\n[" + peername + "]");
          }
        };

        this.socket.onerror = event => {
          console.error(event);
          this.socket.close();
        };

        this.socket.onclose = event => {
          console.log(event);
          this.socket = null;
          if (this.enabled) {
            this.listen();
          }
        };

        this.socket.onopen = () => {
          for (let i in this.streams) {
            this.observeStream(this.streams[i]["stream"]);
          }
        };
      } else {
        console.log("Unable to fetch dynamic token!!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  observeStream(stream) {
    let recorder = new RecordRTC(stream, {
      ...this.sttTuningConfig,
      type: "audio",
      mimeType: "audio/webm;codecs=pcm",
      recorderType: StereoAudioRecorder,
      ondataavailable: blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result;
          if (
            this.socket &&
            this.enabled &&
            this.socket.readyState &&
            this.socket.readyState === 1
          ) {
            try {
              this.socket.send(
                JSON.stringify({ audio_data: base64data.split("base64,")[1] })
              );
            } catch (err) {
              console.log(err);
            }
          }
        };
        reader.readAsDataURL(blob);
      },
    });
    recorder.startRecording();
  }

  enableTranscription(enable) {
    if (enable && !this.enabled) {
      this.setTranscript("[ Initializing Transcription.. ]");
      this.enabled = true;
      this.listen();
    } else if (!enable && this.enabled) {
      this.enabled = false;
      this.socket.close();
      this.socket = null;
      setTimeout(() => {
        this.setTranscript("");
      }, 200);
    }
  }
}
