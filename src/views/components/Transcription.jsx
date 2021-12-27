import { useRef, useState } from "react";
import { Button } from "@100mslive/hms-video-react";

export const browserSupportsTranscription = "webkitSpeechRecognition" in window;
export function TranscriptionButton() {
  const [isTranscriptionEnabled, setIsTranscriptionEnabled] = useState(false);
  const transcriber = useRef(null);

  const enableTranscription = () => {
    if (!transcriber.current) {
      transcriber.current = new Transcriber();
    }
    transcriber.current.enableTranscription(!isTranscriptionEnabled);
    setIsTranscriptionEnabled(!isTranscriptionEnabled);
  };

  return (
    <>
      <Button
        iconOnly
        variant="no-fill"
        shape="rectangle"
        active={isTranscriptionEnabled}
        onClick={enableTranscription}
        key="transcribe"
      >
        <span title="Transcribe">
          <b>T</b>
        </span>
      </Button>
    </>
  );
}

class Transcriber {
  constructor() {
    if (browserSupportsTranscription) {
      this.speechRecognizer = new window.webkitSpeechRecognition();
      this.speechRecognizer.continuous = true;
      this.speechRecognizer.interimResults = true;
    } else {
      console.log("browser doesn't support transcription");
    }
    this.enabled = false;
  }

  enableTranscription(enable) {
    if (!browserSupportsTranscription) {
      return;
    }
    if (enable && !this.enabled) {
      this.enabled = true;
      this.speechRecognizer.start();
      this.speechRecognizer.onsoundstart = () => {
        console.log("Some sound is being received");
      };
      this.speechRecognizer.onresult = result => this.processResult(result);
      this.speechRecognizer.onerror = err => {
        console.error("error in transcription => ", err);
      };
      this.speechRecognizer.onend = event => {
        console.log("transcription ended - ", event);
        this.enabled = false;
      };
    } else if (!enable && this.enabled) {
      this.speechRecognizer.stop();
    }
  }

  processResult(result) {
    if (result.results.length > 0) {
      let transcript = "";
      const startIndex = Math.max(result.results.length - 10, 0);
      for (let i = startIndex; i < result.results.length; ++i) {
        if (!result.results[i].isFinal) {
          transcript += result.results[i][0].transcript;
        }
      }
      const elem = document.getElementById("speechtxt");
      if (elem) {
        elem.innerText = transcript;
      }
    }
  }
}
