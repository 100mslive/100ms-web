import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import {
  selectIsLocalAudioEnabled,
  selectLocalPeerName,
} from "@100mslive/react-sdk";

export class Transcriber {
  constructor({
    hmsStore,
    setTranscriptAndSpeakingPeer,
    setIsTranscriptionEnabled,
  }) {
    this.hmsStore = hmsStore;
    this.enabled = false;
    this.audioSocket = null; // this is the socket that will be used to send audio to the STT server
    this.setTranscriptAndSpeakingPeer = setTranscriptAndSpeakingPeer;
    this.setIsTranscriptionEnabled = setIsTranscriptionEnabled;
    this.sttTuningConfig = {
      timeSlice: 250,
      desiredSampRate: 8000,
      numberOfAudioChannels: 1,
      bufferSize: 256,
    };
    this.resetTextTimer = null; // used to reset the transcript after some time, if no new update comes
    this.localPeerName = hmsStore.getState(selectLocalPeerName);
    this.observingLocalPeerTrack = false;
    this.trackIdBeingObserved = null;
    this.recordRTCInstance = null;
    this.unsubscribes = [];
  }

  async toggleTranscriptionState() {
    await this.enableTranscription(!this.enabled);
  }

  async enableTranscription(enable) {
    if (enable === this.enabled) {
      return;
    }
    console.log("transcription enabled", enable);
    if (enable) {
      this.enabled = true;
      await this.setIsTranscriptionEnabled(true);
      await this.listen();
    } else {
      this.enabled = false;
      await this.setIsTranscriptionEnabled(false);
      this.cleanup();
    }
  }

  setTranscriptAndPeerWithExpiry(transcript, peerName) {
    if (!transcript) {
      return;
    }
    this.setTranscriptAndSpeakingPeer(transcript, `[${peerName}]`);
    // reset after some time if no new update comes
    clearTimeout(this.resetTextTimer);
    this.resetTextTimer = setTimeout(() => {
      this.resetTranscriptAndPeer();
    }, 5000);
  }

  resetTranscriptAndPeer() {
    this.setTranscriptAndSpeakingPeer("", "");
    clearTimeout(this.resetTextTimer);
  }

  async listen(retryCount = 0) {
    if (retryCount > 5) {
      console.error("transcription", "Max retry count reached!!", retryCount);
      this.cleanup();
      return;
    }
    try {
      let url = process.env.REACT_APP_DYNAMIC_STT_TOKEN_GENERATION_ENDPOINT;
      let res = await fetch(url);
      let body = await res.json();
      const authToken = body.token;

      if (authToken) {
        this.audioSocket = await new WebSocket(
          `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=${this.sttTuningConfig.desiredSampRate}&token=${authToken}`
        );
        this.resetTranscriptAndPeer();
        this.audioSocket.onmessage = message => {
          try {
            const res = JSON.parse(message.data);
            if (res.text && this.enabled) {
              //Limiting the transcript size based on it's charecter length.
              let messageText =
                res.text.length >= 80
                  ? res.text
                      .split(" ")
                      .slice(Math.max(res.text.split(" ").length - 10, 1))
                      .join(" ")
                  : res.text;
              if (messageText) {
                this.setTranscriptAndPeerWithExpiry(
                  messageText,
                  this.localPeerName
                );
              }
            }
          } catch (err) {
            console.error("transcription", err);
          }
        };

        this.audioSocket.onerror = event => {
          console.error("transcription", event);
          this.audioSocket.close();
        };

        this.audioSocket.onclose = event => {
          try {
            console.log(event);
            this.audioSocket = null;
            if (this.enabled && event.code !== 4001) {
              this.listen(retryCount++);
            }
          } catch (err) {
            console.error("transcription", err);
          }
        };

        this.audioSocket.onopen = () => {
          this.observeLocalPeerTrack();
        };
      } else {
        console.error("Unable to fetch dynamic token!!");
      }
    } catch (err) {
      console.error("transcription", err);
    }
  }

  async observeLocalPeerTrack() {
    try {
      if (this.observingLocalPeerTrack) {
        return;
      }
      this.observingLocalPeerTrack = true;
      console.log("transcription - observing local peer track");
      let unsub = this.hmsStore.subscribe(
        this.getAndObserveStream,
        selectIsLocalAudioEnabled
      );
      this.unsubscribes.push(unsub);
      this.getAndObserveStream(); // call it once to start observing initially
    } catch (err) {
      console.error("transcription - observing local peer track", err);
    }
  }

  /**
   * This method is used to get the local peer's stream and observe it for changes.
   * @returns {Promise<void>}
   */
  getAndObserveStream = async () => {
    // a hacky way to get the local peer's stream till we have a better way
    const localPeer = window.__hms.sdk.getLocalPeer();
    const mediaTrack = localPeer.audioTrack.nativeTrack;
    if (!mediaTrack || mediaTrack.id === this.trackIdBeingObserved) {
      return;
    }
    this.trackIdBeingObserved = mediaTrack.id;
    console.log("transcription - observing local peer track", mediaTrack.id);
    try {
      if (this.recordRTCInstance) {
        console.log("transcription - destroying earlier instance");
        this.recordRTCInstance.destroy();
      }
      this.recordRTCInstance = null;
    } catch (err) {
      console.error("transcription - in destroying earlier instance", err);
    }
    const stream = new MediaStream([mediaTrack]);
    await this.observeStream(stream);
  };

  async observeStream(stream) {
    this.recordRTCInstance = new RecordRTC(stream, {
      ...this.sttTuningConfig,
      type: "audio",
      mimeType: "audio/webm;codecs=pcm",
      recorderType: StereoAudioRecorder,
      ondataavailable: blob => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result;
          if (
            this.audioSocket &&
            this.enabled &&
            this.audioSocket.readyState &&
            this.audioSocket.readyState === 1
          ) {
            try {
              this.audioSocket.send(
                JSON.stringify({ audio_data: base64data.split("base64,")[1] })
              );
            } catch (err) {
              console.error("transcription", err);
            }
          }
        };
        reader.readAsDataURL(blob);
      },
    });
    this.recordRTCInstance.startRecording();
  }

  cleanup() {
    console.log("transcription - cleanup");
    if (this.audioSocket) {
      try {
        this.audioSocket.close();
        this.audioSocket = null;
      } catch (err) {
        console.error("transcription cleanup - couldn't close socket", err);
      }
    }
    if (this.recordRTCInstance) {
      try {
        this.recordRTCInstance.destroy();
        this.recordRTCInstance = null;
      } catch (err) {
        console.error("transcription cleanup - couldn't stop recording", err);
      }
    }
    for (const unsub of this.unsubscribes) {
      unsub();
    }
    this.resetTranscriptAndPeer();
  }
}
