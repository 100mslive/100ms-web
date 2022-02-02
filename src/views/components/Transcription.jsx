import { useRef, useState } from "react";
import { Button } from "@100mslive/hms-video-react";
import RecordRTC,  { StereoAudioRecorder } from 'recordrtc';

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
    this.enabled = false;
    this.socket;
  }

  async listen(){
    try {
      let url = "https://pm8n28hjk0.execute-api.ap-south-1.amazonaws.com/mystage/assemblyai";
      let res = await fetch(url);
      var body = await res.json();
      if(body && body.token){
        const token = body.token
        this.socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);
        const texts = {};
        var stime,etime;
        this.socket.onmessage = (message) => {
            let msg = '';
            const res = JSON.parse(message.data);
            texts[res.audio_start] = res.text;
            const keys = Object.keys(texts);
            keys.sort((a, b) => a - b);
            for (const key of keys) {
                if (texts[key]) {
                    msg = ` ${texts[key]}`;
                }
            }
            if(msg != ""){
              etime = performance.now();
              console.log((etime - stime) + ' ms.');
            }
            document.getElementById("speechtxt").innerText = msg
        };
  
        this.socket.onerror = (event) => {
            console.error(event);
            this.socket.close();
        }
  
        this.socket.onclose = event => {
            console.log(event);
            this.socket = null;
        }
  
        this.socket.onopen = () => {
          document.getElementById("speechtxt").style.display = '';
          navigator.mediaDevices.getUserMedia({ audio: true, echoCancellation : true })
          .then((stream) => {
              let recorder = new RecordRTC(stream, {
              type: 'audio',
              mimeType: 'audio/webm;codecs=pcm',
              recorderType: StereoAudioRecorder,
              timeSlice: 250,
              desiredSampRate: 16000,
              numberOfAudioChannels: 1,
              bufferSize: 4096,
              audioBitsPerSecond: 128000,
              ondataavailable: (blob) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                  const base64data = reader.result;
                  if (this.socket && this.enabled) {
                    stime = performance.now();
                    try{
                      this.socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                    } catch (err) {
                      console.log(err)
                    }
                  }
                  };
                  reader.readAsDataURL(blob);
              },
              });
  
              recorder.startRecording();
          })
          .catch((err) => console.error(err));
        };
      }else{
        console.log("Unable to fetch dynamic token!!")
      }
      
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  enableTranscription(enable) {
    if (enable && !this.enabled) {
      document.getElementById("speechtxt").innerText = "[ Transcripton is initializing.. ]";
      this.enabled = true;
      this.listen()
    } else if (!enable && this.enabled) {
      this.enabled = false;
      this.socket.close();
      this.socket = null;
      setTimeout(function(){
        document.getElementById("speechtxt").innerText = "";
      }, 200);
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
